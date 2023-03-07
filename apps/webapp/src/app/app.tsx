import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Landing } from '@unihub/webapp/public';
import { Sharedoc } from '@unihub/sharedoc';
import { ThemeProviderWrapper } from './ThemeProviderWrapper';

export function App() {
  return (
    <ThemeProviderWrapper>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/sharedDocument" element={<Sharedoc />} />
      </Routes>
    </ThemeProviderWrapper>
  );
}

export default App;
