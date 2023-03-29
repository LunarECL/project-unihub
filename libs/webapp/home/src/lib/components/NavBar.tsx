import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import './navbar.css';

/* eslint-disable-next-line */
export interface NavBarProps {}

export function NavBar(props: NavBarProps) {
  const navigate = useNavigate();

  return (
    <AppBar component="nav" className="NavBar">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          className="AppBarUnIHub"
          onClick={() => navigate('/')}
        >
          UnIHub
        </Typography>
        <Box>
          <Button
            className="AppBarItems"
            onClick={() => navigate('/home/timetable')}
          >
            Timetable
          </Button>
          <Button
            className="AppBarItems"
            onClick={() => navigate('/home/room/create')}
          >
            Video Chat
          </Button>
          {/* Map goes here */}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
