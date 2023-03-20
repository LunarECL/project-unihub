import React, { useEffect, useState } from 'react';
import { createTheme } from '@mui/material/styles';
import { CssBaseline, ThemeProvider } from '@mui/material';

type ThemeProviderWrapperProps = {
  children: React.ReactNode;
};

const themeLight = createTheme({
  palette: {
    mode: 'light',
    // primary: {
    //   main: '#275673',
    // },
    // secondary: {
    //   main: '#D9C5AD',
    // },
  },
});

const themeDark = createTheme({
  palette: {
    mode: 'dark',
    // primary: {
    //   main: '#035AA6',
    // },
    // secondary: {
    //   main: '#F2A03D',
    // },
    // background: {
    //   default: '#2C3333',
    // },
  },
});

const getCurrentTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches;

export function ThemeProviderWrapper({ children }: ThemeProviderWrapperProps) {
  const [light, setLight] = useState(
    getCurrentTheme() ? themeDark : themeLight
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      const colorScheme = event.matches ? themeDark : themeLight;
      setLight(colorScheme);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeLight, themeDark]);

  return (
    <ThemeProvider theme={light}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
