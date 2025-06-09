import { createBrowserRouter, Navigate } from 'react-router-dom'
import { DefaultLayout } from './layouts/DefaultLayout'
import { Dom } from './pages/Dom'
import { Login } from './pages/Login'
import { BeforeLayout } from './layouts/BeforeLayout'
import { CreateAccount } from './pages/CreateAccount'
import { Editor } from './pages/Editor'
import { Repository } from './pages/Repository'
import { NotFound } from './pages/NotFound'
import { Profile } from './pages/Perfil'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/editor" replace />,
      },
      {
        path: 'editor',
        element: <Editor />,
      },
      {
        path: 'repositorio',
        element: <Repository />,
      },
      {
        path: 'dom',
        element: <Dom />,
      },
      {
        path: 'perfil',
        element: <Profile />,
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
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])
