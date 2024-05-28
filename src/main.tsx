import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from './Router';
import { MainLayout } from './layouts/MainLayout';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MainLayout>
      <Router />
    </MainLayout>
  </React.StrictMode>
);
