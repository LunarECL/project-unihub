import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

/* eslint-disable-next-line */
export interface CreateRoomProps {}

export function CreateRoom(props: CreateRoomProps) {
  const [roomName, setRoomName] = useState('');

  const handleCreateRoom = () => {
    console.log(roomName);
    // add the roomName to the database
    window.location.replace(`/room/${roomName}`);
  };

  const handleRoomNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setRoomName(name);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4">Create Room</Typography>
        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Room Name"
            value={roomName}
            onChange={handleRoomNameChange}
          />
        </Box>
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" onClick={handleCreateRoom}>
            Create
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default CreateRoom;
