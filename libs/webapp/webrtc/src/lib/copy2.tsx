import { useEffect, useState, useRef } from 'react';
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
    [key: string]: {
      stream: MediaStream;
      videoElement: HTMLVideoElement;
    };
  }>({});

  const [remoteStreams, setRemoteStream] = useState<
    { id: string; stream: MediaStream }[]
  >([]);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [pubShow, setPubShow] = useState<string>('hidden');
  const pubVideo = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<{ [key: string]: HTMLVideoElement }>({});

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
      if (track.kind === 'video') {
        if (remoteStreams.find((item) => item.id === track.id)) {
          return;
        } else {
          setRemoteStream((remoteStream) => [
            ...remoteStream,
            { id: track.id, stream: stream },
          ]);
        }
        setCurrentVideo(track.id);
        stream.onremovetrack = (e) => {
          setRemoteStream((remoteStream) =>
            remoteStream.filter((item) => item.id !== e.track.id)
          );
        };
      }
    };
  }, []);

  useEffect(() => {
    if (!currentVideo) return;
    const videoEl = remoteVideoRef.current[currentVideo];

    remoteStreams.map((ev) => {
      if (ev.id === currentVideo) {
        videoEl.srcObject = ev.stream;
        videoEl.autoplay = true;
      }
    });
  }, [currentVideo]);

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
          // only if a screen is shared

          if (media.getVideoTracks().length > 0) {
            if (pubVideo.current) {
              pubVideo.current.srcObject = media;
              pubVideo.current.autoplay = true;
              pubVideo.current.controls = true;
              pubVideo.current.muted = true;

              setPubShow('block');

              client.publish(media);
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
    const displayDiv = document.getElementById('display');
    //reset display div
    if (displayDiv) {
      displayDiv.innerHTML = '';
    }

    const length = Object.keys(streams.current).length;
    const totalStreams = length + 1; // +1 for local stream
    const gridCols =
      totalStreams === 2 ? 2 : Math.ceil(Math.sqrt(totalStreams));
    console.log(length);

    console.log(streams);

    if (cameraOn || screenOn) {
      return (
        <Grid
          id="stream-container"
          container
          spacing={1}
          style={{ height: '100%', width: '100%' }}
        >
          <Grid item xs={12 / gridCols}>
            <video
              id="localVid"
              style={{
                borderRadius: '10px',
                width: '100%',
              }}
              controls
              ref={pubVideo}
            />
          </Grid>
          {remoteStreams.map((val, index) => {
            return (
              <Grid item xs={12 / gridCols}>
                <video
                  style={{
                    backgroundColor: 'black',
                    height: '100%',
                    width: '100%',
                  }}
                  muted
                  ref={(el) => (remoteVideoRef.current[val.id] = el as any)}
                  controls
                />
              </Grid>
            );
          })}
        </Grid>
      );
    } else {
      return (
        <Grid
          id="stream-container"
          container
          spacing={1}
          style={{ height: '100%', width: '100%' }}
        >
          <Grid item xs={12 / gridCols}>
            <video
              id="localVid"
              poster={placeholder}
              style={{
                backgroundColor:
                  backgroundColors[
                    Math.floor(Math.random() * backgroundColors.length)
                  ],
                objectFit: 'scale-down',
                borderRadius: '10px',
                width: '100%',
                // height:
                //   Object.keys(streams.current).length === 0 ? '90vh' : '40vh',
              }}
              controls
            />
          </Grid>
          {remoteStreams.map((val, index) => {
            return (
              <Grid item xs={12 / gridCols}>
                <video
                  style={{
                    backgroundColor: 'black',
                    height: '100%',
                    width: '100%',
                  }}
                  muted
                  ref={(el) => (remoteVideoRef.current[val.id] = el as any)}
                  controls
                />
              </Grid>
            );
          })}
        </Grid>
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
      <div id="display ">{displayLocalStream()}</div>
    </div>
  );
}

export default DisplayRoom;
