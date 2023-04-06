import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import VideocamIcon from '@mui/icons-material/Videocam';
import { useState } from 'react';

import './Card.css';
import placeholder from '../assets/placeholder4.png';
import { useTheme } from '@mui/material/styles';

interface CardProps {
  name: string;
  width: number;
  height: number;
  handleCameraToggle: () => void | undefined;
  handleScreenToggle: () => void | undefined;
  display: string;
  refVideo: React.RefObject<HTMLVideoElement> | null;
  isScreenStream: boolean;
  disabled: boolean;
}

export function Card(props: CardProps) {
  const theme = useTheme();
  const [showControls, setShowControls] = useState(false);

  let fontSize = 26;

  if (props.width > 40) {
    fontSize = 35;
  }
  const handleScreenStream = () => {
    if (!props.disabled) props.handleScreenToggle();
  };

  const handleVideoStream = () => {
    if (!props.disabled) props.handleCameraToggle();
  };

  return (
    <div
      className="card"
      style={{
        width: props.width + '%',
        height: props.height + '%',
        backgroundColor: localStorage.getItem('color') as string,
        display: props.display,
      }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        className="video"
        autoPlay={true}
        muted={true}
        poster={props.refVideo != null ? undefined : placeholder}
        style={{
          objectFit: props.refVideo != null ? 'cover' : 'scale-down',
          background: theme.palette.primary.main,
        }}
        ref={props.refVideo}
      />
      <div className="name">{props.name}</div>
      <div
        className="card-icons"
        style={{ display: showControls ? 'flex' : 'none' }}
      >
        <VideocamIcon
          className={
            props.refVideo != null && !props.isScreenStream
              ? 'icon-element active'
              : 'icon-element inactive'
          }
          style={{ fontSize: fontSize + 'px' }}
          onClick={handleVideoStream}
        />
        <ScreenShareIcon
          className={
            props.refVideo != null && props.isScreenStream
              ? 'icon-element active'
              : 'icon-element inactive'
          }
          style={{ fontSize: fontSize + 'px' }}
          onClick={handleScreenStream}
        />
      </div>
    </div>
  );
}
