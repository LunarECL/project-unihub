import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import './navbar.css';
import { useTheme } from '@mui/material/styles';

/* eslint-disable-next-line */
export interface NavBarProps {}

export function NavBar(props: NavBarProps) {
  const navigate = useNavigate();

  const theme = useTheme();

  return (
    <AppBar
      component="nav"
      className="NavBar"
      sx={{ background: theme.palette.primary.main }}
    >
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
            onClick={() => navigate('/home/rooms/join')}
          >
            Video Chat
          </Button>
          <Button className="AppBarItems" onClick={() => navigate('/home/map')}>
            Map
          </Button>
          <Button
            className="AppBarItems"
            onClick={() => navigate('/home/friends')}
          >
            Friends
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
