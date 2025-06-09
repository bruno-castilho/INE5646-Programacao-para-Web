import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import {
  InfoRounded,
  GroupRounded,
  MenuBookRounded,
  LocalLibraryRounded,
  ConstructionRounded,
} from '@mui/icons-material'

import logo from '../../../assets/logo_ufsc.svg'
import { List, ListItem, ListItemText } from '@mui/material'

export function InformationContent() {
  return (
    <Stack
      flexDirection="column"
      alignSelf="center"
      gap={4}
      maxWidth={450}
      minWidth={300}
    >
      <Box display="flex" flexDirection="column" gap={1}>
        <Box component="img" src={logo} alt="logo da ufsc" height={48} />
        <Box display="flex" justifyContent="center">
          <Typography variant="h6" component="h1">
            Informações do Projeto
          </Typography>
        </Box>
      </Box>

      <Stack direction="row" gap={2}>
        <InfoRounded />
        <Box>
          <Typography gutterBottom fontWeight="medium">
            Sobre o Projeto
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Compilador PHP online desenvolvido como projeto acadêmico.
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" gap={2}>
        <ConstructionRounded />
        <Box>
          <Typography gutterBottom fontWeight="medium">
            Objetivos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Criar uma ferramenta para compilação e execução de código PHP
            diretamente no navegador.
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" gap={2}>
        <MenuBookRounded />
        <Box>
          <Typography gutterBottom fontWeight="medium">
            Disciplina
          </Typography>
          <Typography variant="body2" color="text.secondary">
            INE5646 - Programação para Web
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" gap={2}>
        <GroupRounded />
        <Box>
          <Typography gutterBottom fontWeight="medium">
            Integrantes
          </Typography>
          <List disablePadding>
            <ListItem disablePadding>
              <ListItemText primary="Bruno da Silva Castilho" />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText primary="Lucas Tomio Schwochow" />
            </ListItem>
          </List>
        </Box>
      </Stack>

      <Stack direction="row" gap={2}>
        <LocalLibraryRounded />
        <Box>
          <Typography gutterBottom fontWeight="medium">
            Repositório
          </Typography>
          <Typography variant="body2" color="text.secondary">
            GitHub do Projeto
          </Typography>
        </Box>
      </Stack>
    </Stack>
  )
}
