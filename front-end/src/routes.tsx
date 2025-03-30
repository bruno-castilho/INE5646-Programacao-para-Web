import { createBrowserRouter, Navigate } from 'react-router-dom'
import { DefaultLayout } from './layouts/DefaultLayout'
import { Home } from './pages/home'
import { Dom } from './pages/dom'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/home" replace />,
      },
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/dom',
        element: <Dom />,
      },
      {
        path: '*',
        element: <h1>Página não encontrada</h1>,
      },
    ],
  },
])
