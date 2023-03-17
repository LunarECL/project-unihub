import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { AppState, Auth0Provider } from '@auth0/auth0-react';

import App from './app/app';

const Auth0ProviderWithRedirectCallback: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState?: AppState): void => {
    navigate((appState && appState.returnTo) || window.location.pathname);
  };

  return (
    <Auth0Provider
      onRedirectCallback={onRedirectCallback}
      domain={'dev-a6za28tl8esfwwky.us.auth0.com'}
      clientId={'aStDAa0osXQRNA41V5Al9diBTygvh2Ev'}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://dev-a6za28tl8esfwwky.us.auth0.com/api/v2/',
      }}
    >
      {children}
    </Auth0Provider>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithRedirectCallback>
        <App />
      </Auth0ProviderWithRedirectCallback>
    </BrowserRouter>
  </StrictMode>
);
