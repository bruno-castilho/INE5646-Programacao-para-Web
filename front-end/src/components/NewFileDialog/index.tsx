import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export const NewFileFormSchema = z.object({
  filename: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9_.\- ]+\.php$/, {
      message: 'Digite um nome de arquivo valido',
    }),
})

type NewFileFormSchemaType = z.infer<typeof NewFileFormSchema>

interface NewFileDialogProps {
  open: boolean
  handleClose: () => void
  handleNewFile: (filename: string) => Promise<void>
}

export default function NewFileDialog({
  open,
  handleClose,
  handleNewFile,
}: NewFileDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewFileFormSchemaType>({
    resolver: zodResolver(NewFileFormSchema),
  })

  async function handleCreate(data: NewFileFormSchemaType) {
    await handleNewFile(data.filename)
    handleClose()
    reset()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: handleSubmit(handleCreate),
          sx: { backgroundImage: 'none' },
        },
      }}
    >
      <DialogTitle>Novo Arquivo</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Digite um nome para o arquivo que será criado
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="filename"
          label="Nome"
          placeholder="Nome"
          fullWidth
          error={!!errors.filename}
          helperText={errors.filename?.message ?? ''}
          {...register('filename')}
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button variant="contained" type="submit" loading={isSubmitting}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  )
}
