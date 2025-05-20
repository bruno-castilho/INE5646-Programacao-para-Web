import { createTheme } from '@mui/material/styles'

export const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#8A2BE2',
    },

    secondary: {
      main: '#98FF98',
    },
  },
  typography: {
    fontFamily: `'Courier New', Courier, monospace`,
  },
})
