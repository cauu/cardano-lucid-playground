import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Router } from './Router';
import { ThemeProvider, Toaster } from '@ethsign/ui';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme={'light'} storageKey={'theme'}>
      <Router />
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>
);
