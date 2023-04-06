import React, { useEffect, useState, useRef } from 'react';
import { Client, LocalStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';
import { Configuration } from 'ion-sdk-js/lib/client';
import { useParams } from 'react-router-dom';
import './DisplayRoom.css';
import { Card } from '../components/Card';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { usePostInvitationEmail } from '@unihub/webapp/api';
import AddLinkIcon from '@mui/icons-material/AddLink';

/* eslint-disable-next-line */
export interface DisplayRoomProps {}

let client: Client;
let signal: IonSFUJSONRPCSignal;

export function DisplayRoom(props: DisplayRoomProps) {
  const animals = [
    'Ant',
    'Bear',
    'Cat',
    'Dog',
    'Elephant',
    'Fox',
    'Giraffe',
    'Horse',
    'Iguana',
    'Jaguar',
    'Kangaroo',
    'Lion',
    'Monkey',
    'Narwhal',
    'Owl',
    'Panda',
    'Quail',

    'Rabbit',
    'Snake',
    'Tiger',
    'Unicorn',
    'Vulture',
    'Whale',

    'Xerus',
    'Yak',
    'Zebra',
  ];

  let username = localStorage.getItem('username');

  if (!username) {
    username = `Anonymous ${
      animals[Math.floor(Math.random() * animals.length)]
    }`;

    // store username in local storage
    localStorage.setItem('username', username);
  }

  const [cameraOn, setCameraOn] = useState(false);
  const [screenOn, setScreenOn] = useState(false);
  const [pubShow, setPubShow] = useState<string>('none');
  const [noRemoteStreams, setNoRemoteStreams] = useState<boolean>(true);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [issuesModalOpen, setIssuesModalOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  const postInvitationEmailMutation = usePostInvitationEmail();

  const backgroundColors = [
    '#FFC107', // Amber
    '#FF5722', // Deep Orange
    '#F44336', // Red
    '#E91E63', // Pink
    '#9C27B0', // Purple
    '#673AB7', // Deep Purple
    '#3F51B5', // Indigo
    '#2196F3', // Blue
    '#03A9F4', // Light Blue
    '#00BCD4', // Cyan
    '#009688', // Teal
    '#4CAF50', // Green
    '#8BC34A', // Light Green
    '#CDDC39', // Lime
    '#FFEB3B', // Yellow
  ];

  const randomNumber = Math.floor(Math.random() * backgroundColors.length);

  // put the color in local storage if it doesn't exist
  if (!localStorage.getItem('color')) {
    localStorage.setItem('color', backgroundColors[randomNumber]);
  }

  const streams = useRef<{
    [key: string]: {
      stream: MediaStream;
      videoElement: HTMLVideoElement;
    };
  }>({});

  const pubVideo = useRef<HTMLVideoElement>(null);

  const roomId = useParams().roomId as string; // get roomId from params in the URL ("/room/:roomId")
  const uid = undefined as unknown as string; // undefined because we are using uid generated from ion-sfu

  const config: Configuration = {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
    ],
    codec: 'vp8',
  };

  useEffect(() => {
    // signal ||= new IonSFUJSONRPCSignal('wss://unihub.today/ws');
    signal ||= new IonSFUJSONRPCSignal('ws://localhost:8000/ws');
    client ||= new Client(signal, config);
    signal.onopen = () => {
      client.join(roomId, uid);
    };

    client.ontrack = (track: MediaStreamTrack, stream: MediaStream) => {
      if (!streams.current[stream.id]) {
        setNoRemoteStreams(false);
        // create a video element
        const videoElement = document.createElement('video');
        videoElement.autoplay = true;
        videoElement.controls = true;
        videoElement.muted = true;
        videoElement.srcObject = stream;

        // add video element to the map
        streams.current[stream.id] = {
          stream,
          videoElement,
        };

        stream.onremovetrack = () => {
          if (streams.current[stream.id]) {
            streams.current[stream.id].videoElement.remove();
            delete streams.current[stream.id];
            displayRemoteStreams();
          }

          if (Object.keys(streams.current).length === 0) {
            setNoRemoteStreams(true);
          }
        };

        displayRemoteStreams();
      }
    };

    // if the user closes the tab, leave the room
    window.onbeforeunload = () => {
      client.leave();
    };
  }, [streams]);

  // Buttons

  const handleCameraToggle = () => {
    setDisabled(true);
    if (cameraOn) {
      // turn off camera
      handleCameraStream(false);
    } else {
      handleCameraStream(true);
      // turn off screen
      if (screenOn) {
        handleScreenStream(false);
      }
    }

    //TIMEOUT
    setTimeout(() => {
      setDisabled(false);
    }, 1000);
  };

  const handleScreenToggle = () => {
    setDisabled(true);
    if (screenOn) {
      handleScreenStream(false);
    } else {
      handleScreenStream(true);

      // turn off camera
      if (cameraOn) {
        handleCameraStream(false);
      }
    }

    //TIMEOUT
    setTimeout(() => {
      setDisabled(false);
    }, 1000);
  };

  const handleCameraStream = (event: boolean) => {
    if (event) {
      LocalStream.getUserMedia({
        resolution: 'fhd',
        audio: true,
        video: true,
        codec: 'vp8',
      })
        .then((media) => {
          if (pubVideo.current) {
            pubVideo.current.srcObject = media;
            pubVideo.current.autoplay = true;
            pubVideo.current.controls = false;
            pubVideo.current.muted = true;

            client.publish(media);

            setPubShow('');
          }
        })
        .catch(console.error);
    } else {
      const localTracks = client.transports?.[0].pc.getSenders();
      localTracks?.map((track) => {
        track.track?.stop();
        client.transports?.[0].pc.removeTrack(track);
      });

      if (pubVideo.current) {
        pubVideo.current.srcObject = null;
      }
      setPubShow('none');
    }
    setCameraOn(!cameraOn);
  };

  const handleScreenStream = (event: boolean) => {
    if (event) {
      LocalStream.getDisplayMedia({
        resolution: 'fhd',
        video: true,
        audio: true,
        codec: 'vp8',
      })
        .then((media) => {
          if (media.getVideoTracks().length > 0) {
            if (pubVideo.current) {
              pubVideo.current.srcObject = media;
              pubVideo.current.autoplay = true;
              pubVideo.current.controls = false;
              pubVideo.current.muted = true;
              client.publish(media);
              setPubShow('');
            }
          }
        })
        .catch(console.error);
    } else {
      const localTracks = client.transports?.[0].pc.getSenders();
      localTracks?.map((track) => {
        track.track?.stop();
        client.transports?.[0].pc.removeTrack(track);
      });
      setPubShow('none');
    }

    setScreenOn(!screenOn);
  };

  const displayRemoteStreams = () => {
    const gridContainer = document.getElementById('stream-container');
    if (gridContainer) {
      gridContainer.innerHTML = '';
    }

    const length = Object.keys(streams.current).length;

    if (length === 1) {
      // only one stream, so make it full screen
      const videoElement =
        streams.current[Object.keys(streams.current)[0]].videoElement;

      // remove all existing classes
      while (videoElement.classList.length > 0) {
        videoElement.classList.remove(videoElement.classList.item(0) as string);
      }

      const videoContainer = document.createElement('div');
      videoContainer.classList.add('media-element');
      videoContainer.classList.add('one-stream');
      videoContainer.classList.add('stream');

      videoElement.classList.add('videoEl');

      const nameDiv = document.createElement('div');
      nameDiv.classList.add('name');
      nameDiv.innerHTML = `Anonymous ${
        animals[Math.floor(Math.random() * animals.length)]
      }`;

      videoContainer.appendChild(videoElement);
      videoContainer.appendChild(nameDiv);

      if (gridContainer) {
        gridContainer.appendChild(videoContainer);
      }
    } else {
      const numRows = Math.ceil(length / 2); // 5 streams = 3 rows, 6 streams = 3 rows, 7 streams = 4 rows, 8 streams = 4 rows, etc.

      // make grid container scrollable
      if (gridContainer && numRows > 2) {
        gridContainer.classList.add('scrollable');
      }

      for (let i = 0; i < numRows; i++) {
        const row = document.createElement('div');
        row.classList.add('stream-row');

        for (let j = 0; j < 2; j++) {
          const index = i * 2 + j;
          if (index < length) {
            const videoElement =
              streams.current[Object.keys(streams.current)[index]].videoElement;

            // remove all existing classes
            while (videoElement.classList.length > 0) {
              videoElement.classList.remove(
                videoElement.classList.item(0) as string
              );
            }
            const videoContainer = document.createElement('div');
            videoContainer.classList.add('media-element');
            videoContainer.classList.add('multiple-streams');
            videoContainer.classList.add('stream');

            videoElement.classList.add('videoEl');

            const nameDiv = document.createElement('div');
            nameDiv.classList.add('nameEl');
            nameDiv.innerHTML = `Anonymous ${
              animals[Math.floor(Math.random() * animals.length)]
            }`;

            videoContainer.appendChild(videoElement);
            videoContainer.appendChild(nameDiv);

            if (row) {
              row.appendChild(videoContainer);
            }
          }
        }

        if (gridContainer) {
          gridContainer.appendChild(row);
        }
      }
    }
  };

  const copyLinkToClipboard = () => {
    const link = window.location.origin + `/home/rooms/${roomId}`;
    navigator.clipboard.writeText(link).then(() => {
      alert('Copied link to clipboard!');
    });

    setModalOpen(false);
  };

  const handleSendLinkEmail = () => {
    postInvitationEmailMutation.mutate({
      email,
      groupName: roomId,
      groupId: roomId,
    });
    setModalOpen(false);
  };

  useEffect(() => {
    displayRemoteStreams();
  }, [streams.current]);

  return (
    <div className="App">
      <div className="App-header">
        <div>{`Room: ${roomId}`}</div>
        <Button
          className="headerBtn"
          id="bnt_pubcam"
          onClick={() => setModalOpen(true)}
        >
          Invititation Link
        </Button>

        {/* add not working? button */}
        <Button
          className="headerBtn"
          id="bnt_pubcam"
          onClick={() => setIssuesModalOpen(true)}
        >
          Experiencing Issues?
        </Button>

        <Modal
          open={issuesModalOpen}
          onClose={() => setIssuesModalOpen(false)}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <Box className="modal-box">
            <Typography id="modal-modal-title" variant="h4" component="h2">
              Possible Solutions
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              1. Refresh the page
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              2. Make sure you are connected to UofT wifi
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              3. Make sure you are using Google Chrome
            </Typography>
          </Box>
        </Modal>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <Box className="modal-box">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Share Room Link
            </Typography>
            <TextField
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleSendLinkEmail}
              sx={{ mt: 2 }}
              fullWidth={true}
            >
              Send Link via Email
            </Button>

            <Button
              variant="contained"
              onClick={copyLinkToClipboard}
              sx={{ mt: 2 }}
              fullWidth={true}
            >
              <AddLinkIcon className="addLink" />
              Copy Link
            </Button>
          </Box>
        </Modal>
      </div>

      <div
        id="local-stream"
        className={
          noRemoteStreams ? 'displayNoRemote' : 'localStreamBottomLeft'
        }
      >
        <Card
          name={username}
          width={100}
          height={100}
          handleCameraToggle={handleCameraToggle}
          handleScreenToggle={handleScreenToggle}
          display={pubShow === 'none' ? 'none' : ''}
          refVideo={pubVideo}
          isScreenStream={screenOn}
          disabled={disabled}
        />

        <Card
          name={username}
          width={100}
          height={100}
          handleCameraToggle={handleCameraToggle}
          handleScreenToggle={handleScreenToggle}
          display={pubShow === 'none' ? '' : 'none'}
          refVideo={null}
          isScreenStream={false}
          disabled={disabled}
        />
      </div>
      <div
        id="stream-container"
        className="remoteGridContainer"
        style={{
          display: noRemoteStreams ? 'none' : '',
        }}
      ></div>
    </div>
  );
}
