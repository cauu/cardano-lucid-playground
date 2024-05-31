import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from './Router';
import { MainLayout } from './layouts/MainLayout';

// import init from 'test-npm-crate?init';

// import './libs/cardano_message_signing_bg.wasm?init';
// import './libs/cardano_multiplatform_lib_bg.wasm?init';

import './index.css';

// console.log('greet', init);

// init().then((res) => {
//   console.log('greet', res.greet());
// });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MainLayout>
      <Router />
    </MainLayout>
  </React.StrictMode>
);
