import {
  Box,
  Button,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export const CreateAccountFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: 'Digite um nome' })
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
        message: 'O nome deve conter apenas letras',
      }),

    lastname: z
      .string()
      .trim()
      .min(1, { message: 'Digite um sobrenome' })
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
        message: 'O sobrenome deve conter apenas letras',
      }),

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

    repeat_password: z
      .string()
      .trim()
      .min(1, { message: 'Este campo não pode ficar vazio' }),
  })
  .refine((data) => data.password === data.repeat_password, {
    path: ['repeat_password'],
    message: 'As senhas não coincidem',
  })

type CreateAccountFormSchemaType = z.infer<typeof CreateAccountFormSchema>

export function CreateAccount() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateAccountFormSchemaType>({
    resolver: zodResolver(CreateAccountFormSchema),
  })

  function handleSubmitForm(data: CreateAccountFormSchemaType) {
    console.log(data)
  }

  return (
    <>
      <Typography component="h1" variant="h4">
        Criar conta
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
          <FormLabel htmlFor="name">Nome</FormLabel>
          <TextField
            size="small"
            id="name"
            type="name"
            autoFocus
            required
            fullWidth
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name?.message ?? ''}
            {...register('name')}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="lastname">Sobrenome</FormLabel>
          <TextField
            size="small"
            id="lastname"
            type="lastname"
            autoFocus
            required
            fullWidth
            variant="outlined"
            error={!!errors.lastname}
            helperText={errors.lastname?.message ?? ''}
            {...register('lastname')}
          />
        </FormControl>
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
        <FormControl>
          <FormLabel htmlFor="repeat_password">Repetir senha</FormLabel>
          <TextField
            size="small"
            placeholder="••••••"
            type="repeat_password"
            id="repeat_password"
            autoFocus
            required
            fullWidth
            variant="outlined"
            error={!!errors.repeat_password}
            helperText={errors.repeat_password?.message ?? ''}
            {...register('repeat_password')}
          />
        </FormControl>
        <Button
          type="submit"
          size="small"
          fullWidth
          variant="contained"
          disabled={isSubmitting}
        >
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
