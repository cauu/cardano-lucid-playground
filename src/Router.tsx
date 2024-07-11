import { createBrowserRouter, RouteObject, RouterProvider, Navigate } from 'react-router-dom';

import { MainLayout } from './layouts/MainLayout';

import { HelloWorld } from './pages/HelloWorld';
import { Vesting } from './pages/Vesting';
import { SimplestMint } from './pages/SimplestMint';
import NotFound from './pages/404';
import { MintByGuessword } from './pages/MintByGuessword';

const routerConfig: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/hello-world" />
      },
      {
        path: 'hello-world',
        element: <HelloWorld />
      },
      {
        path: 'simplest-mint',
        element: <SimplestMint />
      },
      {
        path: 'mint-by-guessword',
        element: <MintByGuessword />
      },
      {
        path: 'vesting',
        element: <Vesting />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
];

const router = createBrowserRouter(routerConfig);

export const Router = () => {
  return <RouterProvider router={router} />;
};
