import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Landing } from '@unihub/webapp/public';
import { Sharedoc } from '@unihub/webapp/sharedoc';
import { ThemeProviderWrapper } from './ThemeProviderWrapper';
import ProtectedRoute from '../../../../libs/webapp/ui/src/lib/protected-route/protected-route';
import { Home } from '@unihub/webapp/home';

export function App() {
  return (
    <ThemeProviderWrapper>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home/*" element={<ProtectedRoute component={Home} />} />
      </Routes>
    </ThemeProviderWrapper>
  );
}

export default App;
