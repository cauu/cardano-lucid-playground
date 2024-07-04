import { createBrowserRouter, RouteObject, RouterProvider, Navigate } from 'react-router-dom';

import { MainLayout } from './layouts/MainLayout';

import { HelloWorld } from './pages/HelloWorld';
import { Vesting } from './pages/Vesting';
import NotFound from './pages/404';

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
