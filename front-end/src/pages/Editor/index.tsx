import {
  Box,
  Button,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  useTheme,
} from '@mui/material'
import { Card } from '../../components/Card'
import { Save, PlayArrow } from '@mui/icons-material'
import { VSEditor } from '../../components/VSEditor'

export function Editor() {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  return (
    <Box component={Card} variant="outlined" maxWidth="1488px">
      <CardHeader
        action={
          <>
            <Button
              startIcon={<Save />}
              sx={{ color: 'text.primary', textTransform: 'none' }}
            >
              Salvar
            </Button>
            <Button
              startIcon={<PlayArrow />}
              sx={{ color: 'text.primary', textTransform: 'none' }}
            >
              Executar
            </Button>
          </>
        }
        subheader={
          <Typography variant="subtitle1" component="h1" color="text.primary">
            sem-nome.php
          </Typography>
        }
      />
      <Divider />
      <CardContent>
        <VSEditor isDarkMode={isDarkMode} />
      </CardContent>
      <Divider />
      <CardContent>
        <Typography variant="subtitle1" component="p" color="text.primary">
          Output:
        </Typography>
        <Box height="20vh">
          <Typography variant="body2" component="pre" color="text.primary">
            Clique no botão Executar para ver a saída.
          </Typography>
        </Box>
      </CardContent>
    </Box>
  )
}
