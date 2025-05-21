import {
  Box,
  Button,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from '@mui/material'

export function CreateAccount() {
  return (
    <>
      <Typography component="h1" variant="h4">
        Criar conta
      </Typography>
      <Box
        component="form"
        noValidate
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2,
        }}
      >
        <FormControl>
          <FormLabel htmlFor="name">Nome</FormLabel>
          <TextField
            size="small"
            id="name"
            type="name"
            name="name"
            autoComplete="name"
            autoFocus
            required
            fullWidth
            variant="outlined"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="lastname">Sobrenome</FormLabel>
          <TextField
            size="small"
            id="lastname"
            type="lastname"
            name="lastname"
            autoComplete="lastname"
            autoFocus
            required
            fullWidth
            variant="outlined"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            size="small"
            id="email"
            type="email"
            name="email"
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Senha</FormLabel>
          <TextField
            size="small"
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            autoFocus
            required
            fullWidth
            variant="outlined"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Repetir senha</FormLabel>
          <TextField
            size="small"
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            autoFocus
            required
            fullWidth
            variant="outlined"
          />
        </FormControl>
        <Button type="submit" size="small" fullWidth variant="contained">
          CRIAR
        </Button>
        <Button
          type="submit"
          size="small"
          fullWidth
          variant="contained"
          color="secondary"
        >
          FAZER LOGIN
        </Button>
      </Box>
    </>
  )
}
