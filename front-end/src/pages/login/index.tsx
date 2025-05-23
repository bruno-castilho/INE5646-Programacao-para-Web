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

import { useContext, useState } from 'react'
import ForgotPassword from '../../components/ForgotPassword'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Authenticate } from '../../api/authenticate'
import { AlertContext } from '../../context/AlertContext'
import axios from 'axios'
import { queryClient } from '../../lib/react-query'
import { useNavigate } from 'react-router-dom'

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
  const { error, success } = useContext(AlertContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormSchemaType>({
    resolver: zodResolver(LoginFormSchema),
  })

  const { mutateAsync: loginFn, isPending } = useMutation({
    mutationFn: async ({ email, password }: LoginFormSchemaType) =>
      await Authenticate.login({ email, password }),
    onSuccess: (data) => {
      success(data.message)
      queryClient.setQueryData(['user'], data.user)
    },
    onError: (e) => {
      if (axios.isAxiosError(e)) return error(e.response?.data.message)

      error('Algo não ocorreu bem')
    },
  })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  async function handleSubmitForm(data: LoginFormSchemaType) {
    await loginFn(data)
    reset()
    navigate('/')
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
          disabled={isSubmitting || isPending}
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
