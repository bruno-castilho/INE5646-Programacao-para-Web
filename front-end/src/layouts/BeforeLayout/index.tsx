import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

export function BeforeLayout() {
  return (
    <Box>
      <Box
        component="main"
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        paddingTop={2}
        paddingBottom={2}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
