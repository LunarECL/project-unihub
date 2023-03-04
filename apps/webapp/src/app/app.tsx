// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import NxWelcome from './nx-welcome';
import { useAuth0 } from '@auth0/auth0-react';
import { FaGoogle, FaPencilAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { Route, Routes, Link } from 'react-router-dom';
import React from 'react';
import { Button, Skeleton } from '@mui/material';

export function App() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  const login = () => {
    return loginWithRedirect({
      appState: {
        returnTo: '/home',
      },
    });
  };

  return (
    <>
      <NxWelcome title="webapp" />

      <div />

      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <br />
      <hr />
      <br />
      {isLoading ? (
        <Skeleton variant="rectangular" height={20} />
      ) : (
        <>
          {isAuthenticated ? (
            <Button
              onClick={() => navigate('/home')}
              startIcon={<FaPencilAlt />}
              color="success"
              size="large"
            >
              Get Started
            </Button>
          ) : (
            <>
              <Button
                onClick={login}
                startIcon={<FaPencilAlt />}
                color="success"
                size="large"
              >
                Login
              </Button>
            </>
          )}
        </>
      )}

      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{' '}
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          }
        />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
      </Routes>
      {/* END: routes */}
    </>
  );
}

export default App;
