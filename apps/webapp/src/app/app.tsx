import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Landing } from '@unihub/webapp/public';
import { Sharedoc } from '@unihub/webapp/sharedoc';
import { ThemeProviderWrapper } from './ThemeProviderWrapper';
import ProtectedRoute from '../../../../libs/webapp/ui/src/lib/protected-route/protected-route';
import { DisplayRoom, CreateRoom, JoinRoom } from '@unihub/webapp/webrtc';

export function App() {
  return (
    <ThemeProviderWrapper>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/sharedDocument"
          element={<ProtectedRoute component={Sharedoc} />}
        />
        <Route
          path="/room/create"
          element={<ProtectedRoute component={CreateRoom} />}
        />
        <Route
          path="/room/join"
          element={<ProtectedRoute component={JoinRoom} />}
        />
        <Route
          path="/room/:roomId"
          element={<ProtectedRoute component={DisplayRoom} />}
        />
      </Routes>
    </ThemeProviderWrapper>
  );
}

export default App;
