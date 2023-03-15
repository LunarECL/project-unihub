import { useEffect, useState, useRef } from 'react';
import { Client, LocalStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';
import { Configuration } from 'ion-sdk-js/lib/client';

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
  const [isWSOpen, setIsWSOpen] = useState<boolean>(false);
  const [isJoined, setIsJoined] = useState<boolean>(false);

  let checker = false;

  const uid = 'uid';

  const config: Configuration = {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
    ],
    codec: 'vp8',
  };

  useEffect(() => {
    signal = new IonSFUJSONRPCSignal('ws://localhost:8000/ws');
    client = new Client(signal, config);
    signal.onopen = () => {
      checker = true;
    };

    if (checker) {
      client.join('test', uid).then(() => setIsJoined(true));
      console.log('joined' + uid);

      client.ontrack = (track: MediaStreamTrack, stream: MediaStream) => {
        console.log('got track: ', track.id, 'for stream: ', stream.id);
        if (track.kind === 'video') {
          track.onunmute = () => {
            setRemoteStream((remoteStream) => [
              ...remoteStream,
              { id: track.id, stream: stream },
            ]);
            setCurrentVideo(track.id);
            stream.onremovetrack = (e) => {
              setRemoteStream((remoteStream) =>
                remoteStream.filter((item) => item.id !== e.track.id)
              );
            };
          };
        }
      };
    }
  }, [isWSOpen]);

  useEffect(() => {
    if (!currentVideo) return;
    const videoEl = remoteVideoRef.current[currentVideo];
    remoteStreams.map((ev) => {
      if (ev.id === currentVideo) {
        videoEl.srcObject = ev.stream;
      }
    });
  }, [currentVideo, remoteStreams]);

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
            if (isJoined) client.publish(media);
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
            if (isJoined) client.publish(media);
          }
        })
        .catch(console.error);
    }
  };

  return (
    <div className="flex flex-col h-screen relative">
      <header className="flex h-16 justify-center items-center text-xl bg-black text-white">
        <div>ion-sfu</div>
        <div className="absolute top-2 right-5">
          <button
            id="bnt_pubcam"
            className="bg-blue-500 px-4 py-2 text-white rounded-lg mr-5"
            onClick={() => start(true)}
          >
            Publish Camera
          </button>
          <button
            id="bnt_pubscreen"
            className="bg-green-500 px-4 py-2 text-white rounded-lg"
            onClick={() => start(false)}
          >
            Publish Screen
          </button>
        </div>
      </header>
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-5">
        <video
          className={`bg-black h-full w-full ${pubShow}`}
          controls
          ref={pubVideo}
        ></video>
        {remoteStreams.map((val, index) => {
          return (
            <video
              key={index}
              ref={(el) => (remoteVideoRef.current[val.id] = el!)}
              className="bg-black w-full h-full"
              controls
            ></video>
          );
        })}
      </div>
    </div>
  );
}

export default Webrtc;
