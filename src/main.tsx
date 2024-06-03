import React from 'react';
import ReactDOM from 'react-dom/client';
import { SnackbarProvider } from 'notistack';

import { Router } from './Router';
import { MainLayout } from './layouts/MainLayout';
import { LucidProvider } from './hooks/useLucid';

// import init from 'test-npm-crate?init';

import './index.css';

// console.log('greet', init);

// init().then((res) => {
//   console.log('greet', res.greet());
// });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SnackbarProvider>
      <LucidProvider>
        <MainLayout>
          <Router />
        </MainLayout>
      </LucidProvider>
    </SnackbarProvider>
  </React.StrictMode>
);
