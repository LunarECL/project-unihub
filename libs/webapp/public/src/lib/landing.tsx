import styles from './webapp-public.module.css';
import { LogoutOptions, useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Grid,
  IconButton,
  Skeleton,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import './landing.css';
import UnIHubPage from './components/UnIHubPage';
import { useTheme } from '@mui/material/styles';

/* eslint-disable-next-line */
export interface LandingProps {}

export function Landing(props: LandingProps) {
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  const login = async () => {
    return loginWithRedirect({
      appState: {
        returnTo: '/',
      },
    });
  };

  const theme = useTheme();

  return (
    <div>
      <Grid>
        <Grid item xs={3}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={20} />
          ) : (
            <>
              {isAuthenticated ? (
                <>
                  <AppBar
                    component="nav"
                    className="AppBar"
                    sx={{ background: theme.palette.primary.main }}
                  >
                    <Toolbar>
                      <Typography
                        variant="h6"
                        component="div"
                        className="AppBarUnIHub"
                      >
                        UnIHub
                      </Typography>
                      <Box>
                        <Button
                          // Should prob make the map the inital page
                          onClick={() => navigate('/home/timetable')}
                          variant="contained"
                          sx={{
                            textTransform: 'none',
                            boxShadow: 'none',
                            fontSize: '18px',
                            background: 'transparent',
                          }}
                        >
                          Home
                        </Button>
                        <Button
                          sx={{
                            textTransform: 'none',
                            boxShadow: 'none',
                            fontSize: '18px',
                            background: 'transparent',
                          }}
                          onClick={() => {
                            logout({ returnTo: '/' } as Omit<
                              LogoutOptions,
                              'onRedirect'
                            >);
                          }}
                          variant="contained"
                        >
                          Logout
                        </Button>
                      </Box>
                    </Toolbar>
                  </AppBar>
                  <UnIHubPage />
                  <Button
                    className="Credit"
                    onClick={() => navigate('/home/credits')}
                  >
                    Credits page
                  </Button>
                </>
              ) : (
                <>
                  <Grid container direction="row" className="GridContainer">
                    <Grid item xs={4}>
                      <Grid
                        container
                        direction="column"
                        className="InnerGetStarted"
                        spacing={1}
                      >
                        <Grid item xs={12}>
                          <Typography color="primary" className="UnIHub-header">
                            UnIHub
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography
                            color="secondary"
                            className="UnIHub-subheader"
                          >
                            Welcome to UnIHub, the ultimate platform for UTSC
                            students! Connect with fellow students via video
                            chat, collaborate on live note-taking during
                            lectures, and track your friends' real-time location
                            on campus. Join now and make your academic journey
                            easier, more efficient, and enjoyable.
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            onClick={login}
                            variant="contained"
                            className="GetStartedButton"
                            color="secondary"
                          >
                            Get Started
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={8} className="LandingImageContainer">
                      <div className="LandingImage"></div>
                    </Grid>
                  </Grid>
                </>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default Landing;
