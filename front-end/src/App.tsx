import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { defaultTheme } from './theme'
import { AlertContextProvider } from './context/AlertContext'
import { AlertComponent } from './components/AlertComponent'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/react-query'

export function App() {
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <AlertContextProvider>
            <RouterProvider router={router} />
            <AlertComponent />
          </AlertContextProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  )
}
