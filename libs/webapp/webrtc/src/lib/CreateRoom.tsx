import React, { useRef, useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './CreateRoom.css';
import placeholder from '../assets/person-icon.webp';

/* eslint-disable-next-line */
export interface CreateRoomProps {}

export function CreateRoom(props: CreateRoomProps) {
  const navigate = useNavigate();

  const [cameraOn, setCameraOn] = useState(false);
  const pubVideo = useRef<HTMLVideoElement>(null);
  const [micOn, setMicOn] = useState(false);
  const [username, setUsername] = useState('');

  function generateCode() {
    let code = '';
    const length = 7;
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * chars.length);
      code += chars[index];
    }

    return code;
  }

  const handleCreateRoom = () => {
    // put name in local storage
    localStorage.setItem('username', username);
    navigate(`/home/rooms/${generateCode()}`);
  };

  const handleMicClick = async () => {
    let stream: MediaStream;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      if (!micOn) {
        console.log('Microphone is on');
        setMicOn(true);
      } else {
        console.log('Microphone is off');
        const tracks = stream.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
        setMicOn(false);
      }
    } catch (error) {
      console.error('Microphone access denied', error);
    }
  };

  const handleCameraClick = async () => {
    let stream: MediaStream;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });

      if (!cameraOn) {
        setCameraOn(true);
        if (pubVideo.current) {
          pubVideo.current.style.transform = 'scaleX(-1)';
          pubVideo.current.srcObject = stream;
          pubVideo.current.autoplay = true;
          pubVideo.current.controls = false;
          pubVideo.current.muted = true;
        }
      } else {
        console.log('Camera is off');
        const tracks = stream.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
        setCameraOn(false);

        if (pubVideo.current) {
          pubVideo.current.srcObject = null;
        }
      }
    } catch (error) {
      console.error('Camera access denied', error);
    }
  };

  return (
    <div className="container">
      <div className="video-display-area">
        <video
          style={{ objectFit: cameraOn ? 'cover' : 'scale-down' }}
          className="video-display"
          ref={pubVideo}
          poster={placeholder}
        ></video>
      </div>
      <div className="camera-mic-container">
        <button className="mic-btn" onClick={handleMicClick}>
          Microphone
        </button>
        <button className="camera-btn" onClick={handleCameraClick}>
          Camera
        </button>
      </div>
      <div className="name-input-container">
        <input
          type="text"
          id="name-input"
          placeholder="Username (Annyonymous to others)"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      <div className="join-room-container">
        <button className="join-room-btn" onClick={handleCreateRoom}>
          Join Room
        </button>
      </div>
    </div>
  );
}
