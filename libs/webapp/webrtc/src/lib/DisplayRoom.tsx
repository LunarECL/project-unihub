import React, { useEffect, useState, useRef } from 'react';
import { Client, LocalStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';
import { Configuration } from 'ion-sdk-js/lib/client';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';

import './DisplayRoom.css';
import { Card } from '../components/Card';

/* eslint-disable-next-line */
export interface DisplayRoomProps {}

let client: Client;
let signal: IonSFUJSONRPCSignal;

export function DisplayRoom(props: DisplayRoomProps) {
  const [cameraOn, setCameraOn] = useState(false);

  const [screenOn, setScreenOn] = useState(false);
  const [pubShow, setPubShow] = useState<string>('none');
  const [noRemoteStreams, setNoRemoteStreams] = useState<boolean>(true);

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
    signal ||= new IonSFUJSONRPCSignal('wss://unihub.today/ws');
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
      // FIX:
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
    console.log(length);

    if (length === 1) {
      console.log('displaying one stream');
      // only one stream, so make it full screen
      const videoElement =
        streams.current[Object.keys(streams.current)[0]].videoElement;
      // remove all existing classes
      while (videoElement.classList.length > 0) {
        videoElement.classList.remove(videoElement.classList.item(0) as string);
      }

      videoElement.classList.add('media-element');
      videoElement.classList.add('one-stream');
      videoElement.classList.add('stream');

      if (gridContainer) {
        gridContainer.appendChild(videoElement);
      }
    } else if (length === 2) {
      // two streams, so make them both 50% width
      Object.keys(streams.current).forEach((key) => {
        const videoElement = streams.current[key].videoElement;
        // remove all existing classes
        while (videoElement.classList.length > 0) {
          videoElement.classList.remove(
            videoElement.classList.item(0) as string
          );
        }
        videoElement.classList.add('media-element');
        videoElement.classList.add('upto-four-streams');
        videoElement.classList.add('stream');

        if (gridContainer) {
          gridContainer.appendChild(videoElement);
        }
      });
    } else if (length === 3) {
      // make 2 rows of 2 columns each
      const row1 = document.createElement('div');
      const row2 = document.createElement('div');

      row1.classList.add('stream-row');
      row2.classList.add('stream-row');

      let count = 0;

      Object.keys(streams.current).forEach((key) => {
        const videoElement = streams.current[key].videoElement;
        // remove all existing classes
        while (videoElement.classList.length > 0) {
          videoElement.classList.remove(
            videoElement.classList.item(0) as string
          );
        }
        videoElement.classList.add('media-element');
        videoElement.classList.add('upto-four-streams');
        videoElement.classList.add('stream');

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
    } else if (length === 4) {
      // make 2 rows of 2 columns each
      const row1 = document.createElement('div');
      const row2 = document.createElement('div');

      row1.classList.add('stream-row');
      row2.classList.add('stream-row');

      let count = 0;

      Object.keys(streams.current).forEach((key) => {
        const videoElement = streams.current[key].videoElement;
        // remove all existing classes
        while (videoElement.classList.length > 0) {
          videoElement.classList.remove(
            videoElement.classList.item(0) as string
          );
        }
        videoElement.classList.add('media-element');
        videoElement.classList.add('upto-four-streams');
        videoElement.classList.add('stream');

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

      row1.classList.add('stream-row');
      row2.classList.add('stream-row');

      let count = 0;

      Object.keys(streams.current).forEach((key) => {
        const videoElement = streams.current[key].videoElement;
        // remove all existing classes
        while (videoElement.classList.length > 0) {
          videoElement.classList.remove(
            videoElement.classList.item(0) as string
          );
        }
        videoElement.classList.add('media-element');
        videoElement.classList.add('upto-eight-streams');
        videoElement.classList.add('stream');

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

  useEffect(() => {
    displayRemoteStreams();
  }, [streams.current]);

  return (
    <div className="App">
      <div className="App-header">
        <div>{`Room: ${roomId}`}</div>
        <button
          className="headerBtn"
          id="bnt_pubcam"
          onClick={() => generateInviteLink()}
        >
          Invititation Link
        </button>
      </div>

      <div
        id="local-stream"
        className={
          noRemoteStreams ? 'displayNoRemote' : 'localStreamBottomLeft'
        }
      >
        <Card
          name="Ankit"
          width={100}
          height={100}
          handleCameraToggle={handleCameraToggle}
          handleScreenToggle={handleScreenToggle}
          display={pubShow === 'none' ? 'none' : ''}
          refVideo={pubVideo}
          isScreenStream={screenOn}
        />

        <Card
          name="Ankit"
          width={100}
          height={100}
          handleCameraToggle={handleCameraToggle}
          handleScreenToggle={handleScreenToggle}
          display={pubShow === 'none' ? '' : 'none'}
          refVideo={null}
          isScreenStream={false}
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
