import { useEffect, useState, useRef, LegacyRef } from 'react';
import { Client, LocalStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';
import { Configuration } from 'ion-sdk-js/lib/client';
import { Button } from '@mui/material';
import ScreenShareSharpIcon from '@mui/icons-material/ScreenShare';
import VideocamSharpIcon from '@mui/icons-material/Videocam';
import StopScreenShareSharpIcon from '@mui/icons-material/StopScreenShare';
import VideocamOffSharpIcon from '@mui/icons-material/VideocamOffSharp';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import placeholder from '../assets/placeholder.png';

import './DisplayRoom.css';

/* eslint-disable-next-line */
export interface DisplayRoomProps {}

let client: Client;
let signal: IonSFUJSONRPCSignal;

export function DisplayRoom(props: DisplayRoomProps) {
  const [cameraOn, setCameraOn] = useState(false);
  const [screenOn, setScreenOn] = useState(false);
  const [pubShow, setPubShow] = useState<string>('none');
  const [noRemoteStreams, setNoRemoteStreams] = useState<boolean>(true);
  const [showControls, setShowControls] = useState<boolean>(false);

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
        videoElement.style.backgroundColor = 'black';
        videoElement.style.width = 'fit-content';

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
  }, [streams]);

  const handleCameraToggle = () => {
    if (cameraOn) {
      // turn off camera
      handleCameraStream(false);
    } else {
      handleCameraStream(true);
    }
  };

  const handleScreenToggle = () => {
    if (screenOn) {
      handleScreenStream(false);
    } else {
      // when clicking on screen option, it takes you to another screen share page
      // where you can select the screen you want to share
      // but, if you click cancel, don't turn on the screen

      handleScreenStream(true);
    }
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

      if (pubVideo.current) pubVideo.current.srcObject = null;
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
          // only if a screen is shared

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
      videoElement.style.width = '100%';
      videoElement.style.height = '100%';
      videoElement.style.objectFit = 'cover';
      videoElement.style.boxSizing = 'border-box';
      videoElement.style.margin = '0px';
      videoElement.classList.add('media-element');

      if (gridContainer) {
        gridContainer.appendChild(videoElement);
      }
    } else if (length === 2) {
      // two streams, so make them both 50% width
      Object.keys(streams.current).forEach((key) => {
        const videoElement = streams.current[key].videoElement;
        videoElement.style.width = '50%';
        videoElement.style.height = '100%';
        videoElement.style.objectFit = 'cover';
        videoElement.style.boxSizing = 'border-box';
        videoElement.style.margin = '0px';
        videoElement.classList.add('media-element');

        if (gridContainer) {
          gridContainer.appendChild(videoElement);
        }
      });
    } else if (length === 3) {
      // three streams, so make them all 33% width
      Object.keys(streams.current).forEach((key) => {
        const videoElement = streams.current[key].videoElement;
        videoElement.style.width = '50%';
        videoElement.style.height = '50%';
        videoElement.style.objectFit = 'cover';
        videoElement.classList.add('media-element');
        videoElement.style.boxSizing = 'border-box';
        videoElement.style.margin = '0px';

        // for the 3rd stream, center it vertically
        if (key === '2') {
          videoElement.style.marginTop = '50%';
          videoElement.style.transform = 'translateY(-50%)';
        }

        if (gridContainer) {
          gridContainer.appendChild(videoElement);
        }
      });
    } else if (length === 4) {
      // make 2 rows of 2 columns each
      const row1 = document.createElement('div');
      const row2 = document.createElement('div');
      row1.style.width = '100%';
      row1.style.height = '50%';
      row2.style.width = '100%';
      row2.style.height = '50%';
      row1.style.display = 'flex';
      row2.style.display = 'flex';
      row1.style.flexDirection = 'row';
      row2.style.flexDirection = 'row';

      let count = 0;

      Object.keys(streams.current).forEach((key) => {
        const videoElement = streams.current[key].videoElement;
        videoElement.style.width = '50%';
        videoElement.style.height = '100%';
        videoElement.style.objectFit = 'cover';
        videoElement.classList.add('media-element');
        videoElement.style.boxSizing = 'border-box';
        videoElement.style.margin = '0px';

        if (count < 2) {
          if (row1) {
            row1.appendChild(videoElement);
          }
        } else {
          if (row2) {
            row2.appendChild(videoElement);
          }
        }

        if (gridContainer) {
          gridContainer.appendChild(row1);
          gridContainer.appendChild(row2);
        }

        count += 1;
      });
    } else {
      // JUST SUPPORT 6 STREAMS FOR NOW
      const row1 = document.createElement('div');
      const row2 = document.createElement('div');
      row1.style.width = '100%';
      row1.style.height = '50%';
      row2.style.width = '100%';
      row2.style.height = '50%';
      row1.style.display = 'flex';
      row2.style.display = 'flex';
      row1.style.flexDirection = 'row';
      row2.style.flexDirection = 'row';

      let count = 0;

      Object.keys(streams.current).forEach((key) => {
        const videoElement = streams.current[key].videoElement;
        videoElement.style.width = '25%';
        videoElement.style.height = '100%';
        videoElement.style.objectFit = 'cover';
        videoElement.classList.add('media-element');
        videoElement.style.boxSizing = 'border-box';
        videoElement.style.margin = '0px';

        if (count < 4) {
          if (row1) {
            row1.appendChild(videoElement);
          }
        } else {
          if (row2) {
            row2.appendChild(videoElement);
          }
        }

        if (gridContainer) {
          gridContainer.appendChild(row1);
          gridContainer.appendChild(row2);
        }

        count += 1;
      });
    }
  };

  const generateInviteLink = async () => {
    // want to invite to this rooom
    const link = window.location.origin + `/home/room/${roomId}`;

    // copy to clipboard
    await navigator.clipboard.writeText(link);

    // display a message to the user that the link has been copied
    alert('Invitation link copied to clipboard!');
  };

  const Header = styled('header')({
    display: 'flex',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    // make background color grey transparent
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    '& > div:first-of-type': {
      marginRight: 'auto',
    },
    '& > div:last-child': {
      position: 'absolute',
      top: '2px',
      right: '5px',
    },
  });

  useEffect(() => {
    displayRemoteStreams();
  }, [streams.current]);

  return (
    <div className="App">
      <div className="App-header">
        <div>{`Room: ${roomId}`}</div>
        <Button
          id="bnt_pubcam"
          variant="contained"
          onClick={() => generateInviteLink()}
        >
          Invititation Link
        </Button>
      </div>
      <div
        id="local-stream"
        className={
          noRemoteStreams ? 'displayNoRemote' : 'localStreamBottomLeft'
        }
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          style={{
            display: pubShow,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          className={noRemoteStreams ? '' : ' media-element'}
          controls
          ref={pubVideo}
        ></video>
        <video
          style={{
            // get background color from localstorage
            backgroundColor: localStorage.getItem('color') as string,
            display: pubShow === 'none' ? '' : 'none',
          }}
          className={
            noRemoteStreams ? 'avatarVideo' : 'avatarVideo media-element'
          }
          poster={placeholder}
        ></video>
        <div
          style={{ display: showControls ? '' : 'none' }}
          className={noRemoteStreams ? 'controlsLarge' : 'controls'}
        >
          <div
            style={{
              display: cameraOn ? 'none' : 'flex',
              justifyContent: 'center',
            }}
          >
            <VideocamOffSharpIcon
              onClick={() => handleCameraToggle()}
              className={noRemoteStreams ? 'iconLarge' : 'icon'}
              style={{ color: 'red' }}
            ></VideocamOffSharpIcon>
          </div>
          <div
            style={{
              display: cameraOn ? 'flex' : 'none',
              justifyContent: 'center',
            }}
          >
            <VideocamSharpIcon
              onClick={() => handleCameraToggle()}
              className={noRemoteStreams ? 'iconLarge' : 'icon'}
            ></VideocamSharpIcon>
          </div>
          <div
            style={{
              display: screenOn ? 'flex' : 'none',
              justifyContent: 'center',
            }}
          >
            <ScreenShareSharpIcon
              onClick={() => handleScreenToggle()}
              className={noRemoteStreams ? 'iconLarge' : 'icon'}
            ></ScreenShareSharpIcon>
          </div>
          <div
            style={{
              display: screenOn ? 'none' : 'flex',
              justifyContent: 'center',
            }}
          >
            <StopScreenShareSharpIcon
              onClick={() => handleScreenToggle()}
              className={noRemoteStreams ? 'iconLarge' : 'icon'}
              style={{ color: 'red' }}
            ></StopScreenShareSharpIcon>
          </div>
        </div>
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
