import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { GlobalStyle } from './global'

export function App() {
  return (
    <>
      <GlobalStyle />
      <RouterProvider router={router} />
    </>
  )
}
