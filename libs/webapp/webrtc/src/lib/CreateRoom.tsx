import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './CreateRoom.css';

/* eslint-disable-next-line */
export interface CreateRoomProps {}

export function CreateRoom(props: CreateRoomProps) {
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    console.log(roomName);
    // add the roomName to the database
    navigate(`/home/room/${roomName}`);
  };

  const handleRoomNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setRoomName(name);
  };

  return (
    <Container maxWidth="sm">
      <Box className="CreateRoomBox">
        <Typography className="CreateRoomStyle" variant="h4">
          Create Room
        </Typography>
        <img
          className="Image"
          src="https://static.wixstatic.com/media/9addde_ba3a606012644feea0a9c807f639026d~mv2.png/v1/fill/w_566,h_568,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Black%20Men%20Office%20Video%20Chat.png"
          alt="image"
        />
        <Box className="GeneralBox">
          <TextField
            fullWidth
            label="Room Name"
            value={roomName}
            onChange={handleRoomNameChange}
          />
        </Box>
        <Box className="GeneralBox">
          <Button
            variant="contained"
            className="CreateButton"
            onClick={handleCreateRoom}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

/*
// for more than 4 streams, make them all 25% width and 50% height
      Object.keys(streams.current).forEach((key) => {
        const videoElement = streams.current[key].videoElement;
        videoElement.style.width = '25%';
        videoElement.style.height = '50%';
        videoElement.style.objectFit = 'cover';
        videoElement.classList.add('media-element');
        videoElement.style.boxSizing = 'border-box';
        videoElement.style.margin = '0px';

        if (gridContainer) {
          gridContainer.appendChild(videoElement);
        }
      });
*/
