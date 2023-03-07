import styles from './webapp-public.module.css';
import { LogoutOptions, useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Skeleton } from '@mui/material';
import { FaPencilAlt } from 'react-icons/fa';
import React from 'react';

/* eslint-disable-next-line */
export interface LandingProps {}

export function Landing(props: LandingProps) {
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  const login = () => {
    return loginWithRedirect({
      appState: {
        returnTo: '/',
      },
    });
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={3}>
        {isLoading ? (
          <Skeleton variant="rectangular" height={20} />
        ) : (
          <>
            {isAuthenticated ? (
              <>
                <Button onClick={() => navigate('/')} variant="contained">
                  Get Started
                </Button>
                <Button
                  onClick={() => {
                    logout({ returnTo: window.location.origin } as Omit<
                      LogoutOptions,
                      'onRedirect'
                    >);
                  }}
                  variant="contained"
                  sx={{ ml: 2 }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button onClick={login} variant="contained">
                  Login
                </Button>
              </>
            )}
          </>
        )}
      </Grid>
    </Grid>
  );
}

export default Landing;
