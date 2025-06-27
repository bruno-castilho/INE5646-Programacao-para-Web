import { Delete } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from '@mui/material'
import { useContext } from 'react'
import { AlertContext } from '../../context/AlertContext'
import { useMutation } from '@tanstack/react-query'
import { files } from '../../api/files'
import { File } from '../../types/file'
import axios from 'axios'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { queryClient } from '../../lib/react-query'

export const ShareFormSchema = z.object({
  email: z.string().trim().email({ message: 'E-mail inválido' }),
})

type ShareFormSchemaType = z.infer<typeof ShareFormSchema>

interface ShareDialogProps {
  open: boolean
  handleClose: () => void
  file: File
}

export function ShareDialog({ open, handleClose, file }: ShareDialogProps) {
  const { error, success } = useContext(AlertContext)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShareFormSchemaType>({
    resolver: zodResolver(ShareFormSchema),
  })

  const { mutateAsync: shareFn, isPending: isPendingShare } = useMutation({
    mutationFn: async ({ email }: ShareFormSchemaType) =>
      await files.shareFile({ fileId: file.id, email }),
    onSuccess: (data) => {
      queryClient.setQueriesData<{ files: File[] }>(
        { queryKey: ['personal-files'] },
        (query) => {
          if (query) {
            const newFiles = query.files.map((f) => {
              return {
                id: f.id,
                name: f.name,
                created_by: f.created_by,
                shared_with:
                  f.id === file.id
                    ? [data.shared_with, ...f.shared_with]
                    : [...f.shared_with],
                updated_at: f.updated_at,
                updated_by: f.updated_by,
              }
            })

            return {
              files: newFiles,
            }
          }
          return query
        },
      )

      success(data.message)
    },
    onError: (e) => {
      if (axios.isAxiosError(e)) return error(e.response?.data.message)

      error('Algo não ocorreu bem')
    },
  })

  const { mutateAsync: unshareFn, isPending: isPendingUnshare } = useMutation({
    mutationFn: async ({ email, fileId }: { email: string; fileId: string }) =>
      await files.unshareFile({ fileId, email }),
    onSuccess: (data, { email, fileId }) => {
      queryClient.setQueriesData<{ files: File[] }>(
        { queryKey: ['personal-files'] },
        (query) => {
          if (query) {
            const newFiles = query.files.map((f) => {
              return {
                id: f.id,
                name: f.name,
                created_by: f.created_by,
                shared_with:
                  f.id !== fileId
                    ? f.shared_with
                    : f.shared_with.filter(
                        (share) => share.user.email !== email,
                      ),
                updated_at: f.updated_at,
                updated_by: f.updated_by,
              }
            })

            return {
              files: newFiles,
            }
          }
          return query
        },
      )

      success(data.message)
    },
    onError: (e) => {
      if (axios.isAxiosError(e)) return error(e.response?.data.message)

      error('Algo não ocorreu bem')
    },
  })

  async function handleShare(data: ShareFormSchemaType) {
    await shareFn(data)
    reset()
  }

  async function handleUnshare(email: string) {
    await unshareFn({ email, fileId: file.id })
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        Compartilhar
        <DialogContentText id="alert-dialog-description">
          Compartilhe e controle quem pode acessar seu arquivo.
        </DialogContentText>
      </DialogTitle>
      <DialogContent>
        <Box
          display="flex"
          gap={1}
          width="100%"
          component="form"
          onSubmit={handleSubmit(handleShare)}
        >
          <TextField
            autoFocus
            id="email"
            label="Email"
            placeholder="Email"
            type="email"
            fullWidth
            size="small"
            error={!!errors.email}
            helperText={errors.email?.message ?? ''}
            {...register('email')}
          />
          <Button
            type="submit"
            variant="contained"
            size="small"
            loading={isPendingShare}
          >
            Convidar
          </Button>
        </Box>
        <List>
          {file.shared_with.map(({ user }) => (
            <ListItem
              key={user.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  color="primary"
                  onClick={() => handleUnshare(user.email)}
                  loading={isPendingUnshare}
                >
                  <Delete />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar
                  alt={user.name}
                  src={user.avatar_url ?? ''}
                  variant="rounded"
                />
              </ListItemAvatar>
              <ListItemText primary={user.name} secondary={user.email} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  )
}
