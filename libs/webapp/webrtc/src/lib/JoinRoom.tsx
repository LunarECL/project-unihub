import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

/* eslint-disable-next-line */
export interface JoinRoomProps {}

export function JoinRoom(props: JoinRoomProps) {
  const [roomLink, setRoomLink] = useState('');

  const handleRoomLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomLink(event.target.value);
  };

  const handleJoinRoom = () => {
    // Code to handle joining the room
    window.location.replace(`/room/${roomLink}`);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4">Join Room</Typography>
        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Room Invitation Link"
            value={roomLink}
            onChange={handleRoomLinkChange}
          />
        </Box>
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" onClick={handleJoinRoom}>
            Join
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default JoinRoom;
