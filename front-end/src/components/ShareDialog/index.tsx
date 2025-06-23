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

interface User {
  id: string
  name: string
  email: string
  avatar_url: string
}

interface ShareDialogProps {
  open: boolean
  handleClose: () => void
  users: User[]
}

export function ShareDialog({ open, handleClose, users }: ShareDialogProps) {
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        Compartilhar
        <DialogContentText id="alert-dialog-description">
          Compartilhe e controle quem pode acessar seu arquivo.
        </DialogContentText>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" gap={1} width="100%">
          <TextField
            autoFocus
            id="email"
            name="email"
            label="Email address"
            placeholder="Email address"
            type="email"
            fullWidth
            size="small"
          />
          <Button variant="contained" size="small">
            Convidar
          </Button>
        </Box>
        <List>
          {users?.map((user) => (
            <ListItem
              key={user.id}
              secondaryAction={
                <IconButton edge="end" color="primary">
                  <Delete />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar
                  alt={user.name}
                  src={user.avatar_url}
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
