import React from 'react';
import ReactDOM from 'react-dom/client';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Router } from './Router';
import { MainLayout } from './layouts/MainLayout';
import { LucidProvider } from './hooks/useLucid';

// import init from 'test-npm-crate?init';

import './index.css';

// console.log('greet', init);

// init().then((res) => {
//   console.log('greet', res.greet());
// });

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SnackbarProvider>
      <LucidProvider>
        <QueryClientProvider client={queryClient}>
          <MainLayout>
            <Router />
          </MainLayout>
        </QueryClientProvider>
      </LucidProvider>
    </SnackbarProvider>
  </React.StrictMode>
);
