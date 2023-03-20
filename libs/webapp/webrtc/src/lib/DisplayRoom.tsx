import { useEffect, useState, useRef, LegacyRef } from 'react';
import { Client, LocalStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';
import { Configuration } from 'ion-sdk-js/lib/client';
import { Button, Grid, Typography } from '@mui/material';
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
  const [gridCols, setGridCols] = useState(1);
  const [pubShow, setPubShow] = useState<string>('none');
  const [noRemoteStreams, setNoRemoteStreams] = useState<boolean>(false);

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
      //console.log(track, stream);
      //if stream is not in streams map
      if (!streams.current[stream.id]) {
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
        const length = Object.keys(streams.current).length;
        const totalStreams = length + 1; // +1 for local stream

        let tempGridCols = 0;

        if (totalStreams === 2) {
          setGridCols(2);
          tempGridCols = 2;
        } else {
          setGridCols(Math.ceil(Math.sqrt(totalStreams)));
          tempGridCols = Math.ceil(Math.sqrt(totalStreams));
        }

        const gridItemWidth = 12 / tempGridCols;

        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        // we want our grid to use gridItemWidth out of the 12 columns in the container
        // so, if gridCols is 2, we want each grid item to take up 6 columns
        // we can do this by adding the class "grid-item-6" to the grid item
        gridItem.classList.add(`grid-item-${gridItemWidth}`);

        // append video element to the grid item
        gridItem.appendChild(videoElement);

        const gridContainer = document.getElementById('stream-container');
        if (gridContainer) {
          // gridContainer.appendChild(gridItem);
        }

        stream.onremovetrack = () => {
          if (streams.current[stream.id]) {
            streams.current[stream.id].videoElement.remove();
            delete streams.current[stream.id];
            displayRemoteStreams();
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
            pubVideo.current.controls = true;
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
              pubVideo.current.controls = true;
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

  const Header = styled('header')({
    display: 'flex',
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
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
      videoElement.style.borderRadius = '10px';
      videoElement.style.boxSizing = 'border-box';
      videoElement.style.margin = '0px';

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
        videoElement.style.borderRadius = '10px';
        videoElement.style.boxSizing = 'border-box';
        videoElement.style.margin = '0px';

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
        videoElement.style.borderRadius = '10px';
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
      // four streams, so make them all 25% width
      Object.keys(streams.current).forEach((key) => {
        const videoElement = streams.current[key].videoElement;
        videoElement.style.width = '50%';
        videoElement.style.height = '50 %';
        videoElement.style.objectFit = 'cover';
        videoElement.style.borderRadius = '10px';
        videoElement.style.boxSizing = 'border-box';
        videoElement.style.margin = '0px';

        if (gridContainer) {
          gridContainer.appendChild(videoElement);
        }
      });
    } else {
      // for more than 4 streams, make them all 25% width and 50% height
      Object.keys(streams.current).forEach((key) => {
        const videoElement = streams.current[key].videoElement;
        videoElement.style.width = '25%';
        videoElement.style.height = '50%';
        videoElement.style.objectFit = 'cover';
        videoElement.style.borderRadius = '10px';
        videoElement.style.boxSizing = 'border-box';
        videoElement.style.margin = '0px';

        if (gridContainer) {
          gridContainer.appendChild(videoElement);
        }
      });
    }
  };

  /*
  style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        width: '100%',
        backgroundColor: 'lightgray',
      }}
  */

  useEffect(() => {
    displayRemoteStreams();
  }, [streams.current]);

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        position: 'relative',
      }}
    >
      <Header>
        <div>ion-sfu</div>
        <div>
          <Button
            id="bnt_pubcam"
            variant="contained"
            sx={{ marginRight: 2 }}
            onClick={() => handleCameraToggle()}
          >
            Publish Camera
          </Button>
          <Button
            id="bnt_pubscreen"
            variant="contained"
            color="success"
            onClick={() => handleScreenToggle()}
          >
            Publish Screen
          </Button>
        </div>
      </Header>
      <div
        id="local-stream"
        className={
          noRemoteStreams ? 'displayNoRemote' : 'localStreamBottomLeft'
        }
      >
        <video
          style={{ display: pubShow, width: '100%', height: '100%' }}
          controls
          ref={pubVideo}
        ></video>
        <video
          style={{
            backgroundColor:
              backgroundColors[
                Math.floor(Math.random() * backgroundColors.length)
              ],
            display: pubShow === 'none' ? '' : 'none',
          }}
          className="avatarVideo"
          poster={placeholder}
        ></video>
      </div>
      <Grid
        id="stream-container"
        container
        spacing={1}
        className="remoteGridContainer"
        display={noRemoteStreams ? 'none' : ''}
      ></Grid>
    </div>
  );
}

export default DisplayRoom;
