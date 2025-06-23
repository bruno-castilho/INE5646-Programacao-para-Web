import {
  Box,
  Button,
  IconButton,
  ListItemIcon,
  Menu,
  Typography,
} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import MenuIcon from '@mui/icons-material/Menu'
import { ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import { Folder, Edit } from '@mui/icons-material'

interface Page {
  name: string
  route: string
  icon: ReactNode
}

const pages: Page[] = [
  {
    name: 'Editor',
    route: '/editor',
    icon: <Edit fontSize="small" color="primary" />,
  },
  {
    name: 'Repositório',
    route: '/repositorio/pessoal',
    icon: <Folder fontSize="small" color="primary" />,
  },
]

export function PageMenu() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)

  function handleOpenNavMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorElNav(event.currentTarget)
  }

  function handleCloseNavMenu() {
    setAnchorElNav(null)
  }

  return (
    <>
      <Box flexGrow={1} display={{ xs: 'flex', md: 'none' }}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
        <Box
          component={Menu}
          display={{ xs: 'block', md: 'none' }}
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
        >
          {pages.map((page) => (
            <MenuItem key={page.name} component={Link} to={page.route}>
              <ListItemIcon>{page.icon}</ListItemIcon>
              <Typography textAlign="center">{page.name}</Typography>
            </MenuItem>
          ))}
        </Box>
      </Box>
      <Box flexGrow={1} display={{ xs: 'none', md: 'flex' }}>
        {pages.map((page) => (
          <Button
            key={page.name}
            component={Link}
            to={page.route}
            sx={{ my: 2, color: 'text.primary', display: 'block' }}
          >
            {page.name}
          </Button>
        ))}
      </Box>
    </>
  )
}
