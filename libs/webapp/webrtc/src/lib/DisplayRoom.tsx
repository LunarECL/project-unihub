import { useEffect, useState, useRef } from 'react';
import { Client, LocalStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';
import { Configuration } from 'ion-sdk-js/lib/client';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';

/* eslint-disable-next-line */
export interface DisplayRoomProps {}

let client: Client;
let signal: IonSFUJSONRPCSignal;

export function DisplayRoom(props: DisplayRoomProps) {
  const [cameraOn, setCameraOn] = useState(false);
  const [screenOn, setScreenOn] = useState(false);

  const [remoteStreams, setRemoteStream] = useState<
    { id: string; stream: MediaStream }[]
  >([]);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [pubShow, setPubShow] = useState<string>('hidden');
  const pubVideo = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<{ [key: string]: HTMLVideoElement }>({});
  // get roomId from params in the URL ("/room/:roomId")
  const roomId = useParams().roomId as string;
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
        resolution: 'vga',
        audio: true,
        codec: 'vp8',
      })
        .then((media) => {
          media.onremovetrack = (e) => {
            setRemoteStream((remoteStream) =>
              remoteStream.filter((item) => item.id !== e.track.id)
            );
          };

          if (pubVideo.current) {
            pubVideo.current.srcObject = media;
            pubVideo.current.autoplay = true;
            pubVideo.current.controls = true;
            pubVideo.current.muted = true;
            setPubShow('block');
            if (!remoteStreams.find((item) => item.id === media.id)) {
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
    setCameraOn(!cameraOn);
  };

  const handleScreenStream = (event: boolean) => {
    if (event) {
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

            client.publish(media);
          }

          client.publish(media);
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

  const displayRemoteStreams = () => {
    return remoteStreams.map((val, index) => {
      return (
        <div
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            position: 'relative',
          }}
        >
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
        </div>
      );
    });
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
        {displayRemoteStreams()}
      </div>
    </div>
  );
}

export default DisplayRoom;
