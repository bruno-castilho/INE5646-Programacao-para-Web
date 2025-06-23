import {
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useColorScheme,
} from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { useState } from 'react'
import { DarkMode, LightMode, Logout, Person } from '@mui/icons-material'
import { Link } from 'react-router-dom'

export function UserMenu() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  const { mode, systemMode, setMode } = useColorScheme()

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  function handleChangeMode() {
    setMode(mode === 'dark' || systemMode === 'dark' ? 'light' : 'dark')
    setAnchorElUser(null)
  }

  function handleLogout() {
    console.log('logout')
  }

  return (
    <Box flexGrow={0}>
      <Tooltip title="Menu do usuário">
        <IconButton
          onClick={handleOpenUserMenu}
          sx={{ p: 0, color: 'text.primary' }}
        >
          <AccountCircle />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem component={Link} to="/perfil">
          <ListItemIcon>
            <Person fontSize="small" color="primary" />
          </ListItemIcon>
          <Typography textAlign="center">Perfil</Typography>
        </MenuItem>

        {(mode === 'light' || systemMode === 'light') && (
          <MenuItem onClick={handleChangeMode}>
            <ListItemIcon>
              <DarkMode fontSize="small" color="primary" />
            </ListItemIcon>
            <Typography textAlign="center">Habilitar Modo Escuro</Typography>
          </MenuItem>
        )}

        {(mode === 'dark' || systemMode === 'dark') && (
          <MenuItem onClick={handleChangeMode}>
            <ListItemIcon>
              <LightMode fontSize="small" color="primary" />
            </ListItemIcon>
            <Typography textAlign="center">Habilitar Modo Claro</Typography>
          </MenuItem>
        )}

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" color="primary" />
          </ListItemIcon>
          <Typography textAlign="center">Sair</Typography>
        </MenuItem>
      </Menu>
    </Box>
  )
}
