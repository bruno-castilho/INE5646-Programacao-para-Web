import { createBrowserRouter, Navigate } from 'react-router-dom'
import { DefaultLayout } from './layouts/DefaultLayout'
import { Home } from './pages/home'
import { Dom } from './pages/dom'
import { Login } from './pages/login'
import { BeforeLayout } from './layouts/BeforeLayout'
import { CreateAccount } from './pages/create-account'

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
    ],
  },
  {
    path: '/',
    element: <BeforeLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
    ],
  },
  {
    path: '/',
    element: <BeforeLayout />,
    children: [
      {
        path: '/cadastrar',
        element: <CreateAccount />,
      },
    ],
  },
])
