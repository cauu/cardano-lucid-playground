import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelloWorld } from './page/HelloWorld'
import NotFound from './page/404'

const routerConfig = [
  {
    path: '/',
    element: <HelloWorld />
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
