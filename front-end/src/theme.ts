import { createTheme } from '@mui/material/styles'

export const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#4F5B93',
      contrastText: '#FFFFFF',
    },

    secondary: {
      main: '#333333',
      contrastText: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Fira Code", monospace',
  },
})
