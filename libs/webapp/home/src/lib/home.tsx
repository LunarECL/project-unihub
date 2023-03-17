import React from 'react';
import { ApiProvider } from '@unihub/webapp/api';
import { Sharedoc } from '@unihub/webapp/sharedoc';
import { Route, Routes } from 'react-router-dom';
import Forum from './forum/forum';

export interface WebappHomeProps {}

export function Home(props: WebappHomeProps) {
  return (
    <ApiProvider>
      <Routes>
        <Route path="/" element={<Forum />} />
        <Route path="/sharedDocument" element={<Sharedoc />} />
      </Routes>
    </ApiProvider>
  );
}

export default Home;
