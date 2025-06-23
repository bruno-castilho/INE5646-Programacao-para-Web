import { Box, Tab, Tabs } from '@mui/material'
import { Card } from '../../components/Card'
import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'

export function Repository() {
  const [value, setValue] = useState(0)

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  return (
    <Box component={Card} variant="outlined" maxWidth="1488px">
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Pessoal" component={Link} to="pessoal" />
        <Tab
          label="Compartilhados comigo"
          component={Link}
          to="compartilhado"
        />
      </Tabs>
      <Outlet />
    </Box>
  )
}
