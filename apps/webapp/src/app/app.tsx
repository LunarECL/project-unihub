import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Landing } from '@unihub/webapp/public';
import { ThemeProviderWrapper } from './ThemeProviderWrapper';

export function App() {
  return (
    <ThemeProviderWrapper>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </ThemeProviderWrapper>
  );
}

export default App;
