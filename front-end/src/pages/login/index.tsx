import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Link,
  TextField,
  Typography,
} from '@mui/material'

import { useState } from 'react'
import ForgotPassword from '../../components/ForgotPassword'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export const LoginFormSchema = z.object({
  email: z.string().trim().email({ message: 'E-mail inválido' }),
  password: z
    .string()
    .trim()
    .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
    .regex(/(?=.*[A-Z])/, {
      message: 'A senha deve conter pelo menos uma letra maiúscula',
    })
    .regex(/(?=.*[0-9])/, {
      message: 'A senha deve conter pelo menos um número',
    })
    .regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
      message: 'A senha deve conter pelo menos um símbolo especial',
    }),
})

type LoginFormSchemaType = z.infer<typeof LoginFormSchema>

export function Login() {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormSchemaType>({
    resolver: zodResolver(LoginFormSchema),
  })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  function handleSubmitForm(data: LoginFormSchemaType) {
    console.log(data)
  }

  return (
    <>
      <Typography component="h1" variant="h4">
        Fazer login
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(handleSubmitForm)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2,
        }}
      >
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            size="small"
            id="email"
            type="email"
            placeholder="your@email.com"
            autoFocus
            required
            fullWidth
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email?.message ?? ''}
            {...register('email')}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Senha</FormLabel>
          <TextField
            size="small"
            placeholder="••••••"
            type="password"
            id="password"
            autoFocus
            required
            fullWidth
            variant="outlined"
            error={!!errors.password}
            helperText={errors.password?.message ?? ''}
            {...register('password')}
          />
        </FormControl>
        <ForgotPassword open={open} handleClose={handleClose} />
        <Button
          type="submit"
          size="small"
          fullWidth
          variant="contained"
          disabled={isSubmitting}
        >
          Entrar
        </Button>
        <Link
          component="button"
          type="button"
          onClick={handleClickOpen}
          variant="body2"
          sx={{ alignSelf: 'center' }}
        >
          Esqueceu sua senha?
        </Link>
      </Box>
      <Divider>ou</Divider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ textAlign: 'center' }}>
          Não tem uma conta?{' '}
          <Link href="/cadastrar" variant="body2" sx={{ alignSelf: 'center' }}>
            Inscrever-se
          </Link>
        </Typography>
      </Box>
    </>
  )
}
