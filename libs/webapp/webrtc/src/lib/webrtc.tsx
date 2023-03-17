import { useEffect, useState, useRef } from 'react';
import { Client, LocalStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';
import { Configuration } from 'ion-sdk-js/lib/client';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

/* eslint-disable-next-line */
export interface WebrtcProps {}

let client: Client;
let signal: IonSFUJSONRPCSignal;

export function Webrtc(props: WebrtcProps) {
  const [remoteStreams, setRemoteStream] = useState<
    { id: string; stream: MediaStream }[]
  >([]);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [pubShow, setPubShow] = useState<string>('hidden');
  const pubVideo = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<{ [key: string]: HTMLVideoElement }>({});

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
      client.join('test room', uid);
    };

    client.ontrack = (track: MediaStreamTrack, stream: MediaStream) => {
      console.log('got track: ', track.id, 'for stream: ', stream.id);
      console.log(remoteStreams);
      if (track.kind === 'video') {
        // only add stream if it is not already in the list
        if (remoteStreams.find((item) => item.id === track.id)) {
          // stream already in list
          console.log('stream already in list');
          return;
        } else {
          console.log('adding stream to list');
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
      }
    });
  }, [currentVideo]);

  const start = (event: boolean) => {
    if (event) {
      LocalStream.getUserMedia({
        resolution: 'vga',
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
            console.log(media);
            client.publish(media);
          }
        })
        .catch(console.error);
    } else {
      LocalStream.getDisplayMedia({
        resolution: 'vga',
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
            console.log(media);
            client.publish(media);
          }
        })
        .catch(console.error);
    }
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
            onClick={() => start(true)}
          >
            Publish Camera
          </Button>
          <Button
            id="bnt_pubscreen"
            variant="contained"
            color="success"
            onClick={() => start(false)}
          >
            Publish Screen
          </Button>
        </div>
      </Header>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 5,
        }}
      >
        <video
          style={{
            backgroundColor: 'black',
            height: '100%',
            width: '100%',
            display: pubShow,
          }}
          controls
          ref={pubVideo}
        />
        {remoteStreams.map((val, index) => {
          console.log(remoteStreams);
          return (
            <video
              key={index}
              ref={(el) => (remoteVideoRef.current[val.id] = el as any)}
              style={{
                backgroundColor: 'black',
                height: '100%',
                width: '100%',
              }}
              controls
            />
          );
        })}
      </div>
    </div>
  );
}

export default Webrtc;
