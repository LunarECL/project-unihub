import React from 'react';
import { ApiProvider } from '@unihub/webapp/api';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Sharedoc } from '@unihub/webapp/sharedoc';
import { Route, Routes } from 'react-router-dom';
import Forum from './forum/forum';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { DisplayRoom, CreateRoom, JoinRoom } from '@unihub/webapp/webrtc';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WebappHomeProps {}

export function Home(props: WebappHomeProps) {
  return (
    <ApiProvider>
      <Routes>
        <Route path="/" element={<Forum />} />
        <Route path="/sharedDocument" element={<Sharedoc />} />
        <Route path="/sharedDocument" element={<Sharedoc />} />
        <Route path="/room/create" element={<CreateRoom />} />
        <Route path="/room/join" element={<JoinRoom />} />
        <Route path="/room/:roomId" element={<DisplayRoom />} />
      </Routes>
    </ApiProvider>
  );
}

export default Home;
