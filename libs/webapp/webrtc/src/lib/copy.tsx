import { useEffect, useState, useRef } from 'react';
import { Client, LocalStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';
import { Configuration } from 'ion-sdk-js/lib/client';
import { Button, Typography } from '@mui/material';
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

  /**
   * For every remote stream this object will hold the follwing information:
   * {
   *  "id-of-the-remote-stream": {
   *     stream: [Object], // Reference to the stream object
   *     videoElement: [Object] // Reference to the video element that's rendering the stream.
   *   }
   * }
   */
  const streams = useRef<{
    [key: string]: { stream: MediaStream; videoElement: HTMLVideoElement };
  }>({});

  const [pubShow, setPubShow] = useState<string>('hidden');
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
      console.log(track, stream);
      //if stream is not in streams map
      if (!streams.current[stream.id]) {
        // create a video element
        const videoElement = document.createElement('video');
        videoElement.autoplay = true;
        videoElement.controls = true;
        videoElement.muted = true;
        videoElement.srcObject = stream;
        videoElement.style.width = '100%';
        videoElement.style.height = '40vh';
        videoElement.style.backgroundColor = 'black';

        // add video element to the DOM
        document.getElementById('remotes')?.appendChild(videoElement);

        // add video element to the map
        streams.current[stream.id] = {
          stream,
          videoElement,
        };

        stream.onremovetrack = () => {
          streams.current[stream.id].videoElement.remove();
          delete streams.current[stream.id];
        };
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
            setPubShow('block');
            client.publish(media);
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

      setPubShow('hidden');
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
          if (pubVideo.current) {
            pubVideo.current.srcObject = media;
            pubVideo.current.autoplay = true;
            pubVideo.current.controls = true;
            pubVideo.current.muted = true;

            setPubShow('block');

            client.publish(media);
          }
        })
        .catch(console.error);
    } else {
      const localTracks = client.transports?.[0].pc.getSenders();
      localTracks?.map((track) => {
        track.track?.stop();
        client.transports?.[0].pc.removeTrack(track);
      });

      setPubShow('hidden');
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

  const displayLocalStream = () => {
    if (cameraOn || screenOn) {
      return (
        <video
          id="localVid"
          style={{
            width: '100%',
            borderRadius: '10px',
            // if streams is empty, height= 90vh, otherwise 40vh
            height: Object.keys(streams.current).length === 0 ? '90vh' : '40vh',
          }}
          controls
          ref={pubVideo}
        />
      );
    } else {
      return (
        <video
          id="localVid"
          poster={placeholder}
          style={{
            // choose a random background color from the array
            backgroundColor:
              backgroundColors[
                Math.floor(Math.random() * backgroundColors.length)
              ],
            width: '100%',
            objectFit: 'scale-down',
            borderRadius: '10px',
            // if streams is empty, height= 90vh, otherwise 40vh
            height: Object.keys(streams.current).length === 0 ? '90vh' : '40vh',
          }}
          controls
        />
      );
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
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
        className={
          Object.keys(streams.current).length === 0
            ? 'displayRemote'
            : 'displayNoRemote'
        }
      >
        {displayLocalStream()}
        <div id="remotes" />
      </div>
    </div>
  );
}

export default DisplayRoom;
