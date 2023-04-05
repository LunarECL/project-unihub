import React, { useState } from 'react';
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import placeholder from '../assets/placeholder.png';
import { useTheme } from '@mui/material/styles';

/* eslint-disable-next-line */
export interface JoinRoomProps {}

export function JoinRoom(props: JoinRoomProps) {
  const [meetingCode, setMeetingCode] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    // Code to handle joining the room
    navigate(`/home/rooms/${meetingCode}`);
  };

  const handleNewMeeting = () => {
    // Code to handle creating a new meeting
    navigate('/home/rooms/create');
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  };

  const headingStyle = {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center' as const,
    position: 'relative' as const,
    paddingBottom: 50,
  };

  const buttonStyle = {
    margin: 1,
    width: '100%',
    alignSelf: 'center' as const,
    height: '70%',
  };
  return (
    <Container maxWidth="xs" style={containerStyle}>
      <Typography variant="h1" style={headingStyle}>
        Welcome to UniHub Video Chat!
      </Typography>
      <Grid container spacing={1} alignItems="center" justifyContent="center">
        <Grid item xs={12}>
          <Button
            variant="contained"
            style={buttonStyle}
            onClick={handleNewMeeting}
          >
            New Meeting
          </Button>
        </Grid>

        <Grid item xs={12} style={{ textAlign: 'center' as const }}>
          OR
        </Grid>

        <Grid item xs={8}>
          <TextField
            label="Enter a code"
            variant="outlined"
            size="small"
            style={buttonStyle}
            value={meetingCode}
            onChange={(e) => setMeetingCode(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            style={buttonStyle}
            onClick={handleJoinRoom}
            disabled={meetingCode === ''}
          >
            Join
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
