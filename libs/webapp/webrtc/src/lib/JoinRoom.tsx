import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  makeStyles,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import placeholder from '../assets/placeholder.png';
import { useTheme } from '@mui/material/styles';

/* eslint-disable-next-line */
export interface JoinRoomProps {}

export function JoinRoom(props: JoinRoomProps) {
  const theme = useTheme();
  const [roomLink, setRoomLink] = useState('');
  const [meetingCode, setMeetingCode] = useState('');
  const navigate = useNavigate();

  const handleRoomLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomLink(event.target.value);
  };

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
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center' as const,
    position: 'relative' as const,
    paddingBottom: 50,
  };

  // Can't change the background colour of the image
  const capStyle = {
    position: 'absolute' as const,
    top: -35,
    left: -30,
    transformOrigin: 'top left',
    transform: 'rotate(-20deg)',
    height: 104,
    color: theme.palette.primary.main,
  };

  const buttonStyle = {
    margin: 1,
    width: '100%',
    alignSelf: 'center' as const,
    height: '70%',
  };
  return (
    <Container maxWidth="sm" style={containerStyle}>
      <Typography variant="h1" style={headingStyle}>
        Welcome to UniHub Video Chat!
        <img src={placeholder} alt="UniHub Cap" height="64" style={capStyle} />
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
