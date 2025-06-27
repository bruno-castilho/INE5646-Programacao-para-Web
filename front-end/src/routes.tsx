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
import { Personal } from './pages/Repository/Personal'
import { SharedWithMe } from './pages/Repository/SharedWithMe'

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
        path: 'editor/:id',
        element: <Editor />,
      },
      {
        path: 'repositorio',
        element: <Repository />,
        children: [
          {
            path: 'pessoal',
            element: <Personal />,
          },
          {
            path: 'compartilhado',
            element: <SharedWithMe />,
          },
        ],
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
