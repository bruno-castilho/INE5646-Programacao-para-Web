import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  IconButton,
  Link as LinkMaterial,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { TableSortLabel } from '../../../components/TableSortLabel'
import { Add } from '@mui/icons-material'

import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { TablePagination } from '../../../components/TablePagination'
import { useContext, useState } from 'react'
import { ShareDialog } from '../../../components/ShareDialog'
import { File } from '../../../types/file'
import { useMutation, useQuery } from '@tanstack/react-query'
import { files } from '../../../api/files'
import { z } from 'zod'
import { Link, useSearchParams } from 'react-router-dom'
import { AlertContext } from '../../../context/AlertContext'
import axios from 'axios'
import { queryClient } from '../../../lib/react-query'

interface PersonalTableRowProps {
  file: File
}

function PersonalTableRow({ file }: PersonalTableRowProps) {
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const { error, success } = useContext(AlertContext)

  const { mutateAsync: removeFile, isPending } = useMutation({
    mutationFn: async () => await files.removeFile({ fileId: file.id }),
    onSuccess: (data) => {
      queryClient.setQueriesData<{ files: File[] }>(
        { queryKey: ['personal-files'] },
        (query) => {
          if (query) {
            const newFiles = query.files.filter((f) => {
              return f.id !== file.id
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

  function handleOpenDialog() {
    setOpenDialog(true)
  }

  function handleCloseDialog() {
    setOpenDialog(false)
  }

  async function handleRemoveFile() {
    await removeFile()
  }

  return (
    <>
      <TableRow>
        <TableCell component="th" scope="row" align="left">
          <LinkMaterial component={Link} to={`/editor/${file.id}`}>
            {file.id}
          </LinkMaterial>
        </TableCell>
        <TableCell component="th" scope="row" align="left">
          {file.name}
        </TableCell>

        <TableCell component="th" scope="row" align="left">
          {file.updated_by.email}
        </TableCell>

        <TableCell component="th" scope="row" align="left">
          {formatDistanceToNow(file.updated_at, {
            locale: ptBR,
            addSuffix: true,
          })}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          align="center"
          sx={{ maxWidth: '400px' }}
        >
          <Box component={AvatarGroup} display="flex" justifyContent="center">
            {file.shared_with.slice(0, 3).map(({ user }) => (
              <Avatar
                key={user.id}
                alt={`${user.name} ${user.last_name}`}
                src={user.avatar_url ?? ''}
                sx={{
                  width: '1.5rem',
                  height: '1.5rem',
                  fontSize: '0.875rem',
                }}
              />
            ))}

            <Avatar
              sx={(theme) => ({
                bgcolor: theme.palette.primary.main,
                width: '1.5rem',
                height: '1.5rem',
                fontSize: '0.875rem',
              })}
            >
              <IconButton
                onClick={handleOpenDialog}
                sx={(theme) => ({
                  color: theme.palette.primary.contrastText,
                })}
              >
                <Add />
              </IconButton>
            </Avatar>
          </Box>
        </TableCell>
        <TableCell component="th" scope="row" align="right">
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleRemoveFile}
            loading={isPending}
          >
            Remover
          </Button>
        </TableCell>
      </TableRow>
      <ShareDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        file={file}
      />
    </>
  )
}

function PersonalTableRowSkeleton() {
  return (
    <TableRow>
      <TableCell component="th" scope="row" align="left">
        <Skeleton variant="text" />
      </TableCell>
      <TableCell component="th" scope="row" align="left">
        <Skeleton variant="text" />
      </TableCell>

      <TableCell component="th" scope="row" align="left">
        <Skeleton variant="text" />
      </TableCell>

      <TableCell component="th" scope="row" align="left">
        <Skeleton variant="text" />
      </TableCell>
      <TableCell
        component="th"
        scope="row"
        align="center"
        sx={{ maxWidth: '400px' }}
      >
        <Box component={AvatarGroup} display="flex" justifyContent="center">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="circular"
              width="1.5rem"
              height="1.5rem"
            />
          ))}
        </Box>
      </TableCell>
      <TableCell component="th" scope="row" align="right">
        <Box display="flex" justifyContent="right">
          <Skeleton variant="rounded" width={75} height={32} />
        </Box>
      </TableCell>
    </TableRow>
  )
}

export function Personal() {
  const [searchParams] = useSearchParams()

  const perPage = z.coerce.number().parse(searchParams.get('perPage') ?? '10')
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1')

  const sortBy = (searchParams.get('sortBy') as 'name' | 'updated_at') ?? 'name'
  const orderBy = (searchParams.get('orderBy') as 'asc' | 'desc') ?? 'asc'

  const { data, isPending } = useQuery({
    queryKey: ['personal-files', perPage, page, sortBy, orderBy],
    queryFn: () =>
      files.searchPersonalFiles({ perPage, page, sortBy, orderBy }),
  })

  return (
    <TableContainer>
      <Table sx={{ width: '100%' }} size="small">
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ minWidth: 260 }}>
              ID
            </TableCell>
            <TableCell align="left">
              <TableSortLabel label="name" defaultLabel="name">
                Nome
              </TableSortLabel>
            </TableCell>
            <TableCell align="left">Atualizado por</TableCell>

            <TableCell align="left" sx={{ minWidth: 200 }}>
              <TableSortLabel label="updated_at" defaultLabel="updated_at">
                Atualizado há
              </TableSortLabel>
            </TableCell>
            <TableCell align="center" sx={{ minWidth: 200 }}>
              Compartilhado com
            </TableCell>
            <TableCell sx={{ width: 200 }} align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {!isPending &&
            data?.files.map((file) => (
              <PersonalTableRow key={file.id} file={file} />
            ))}
          {isPending &&
            Array.from({ length: 10 }).map((_, index) => (
              <PersonalTableRowSkeleton key={index} />
            ))}
        </TableBody>
      </Table>
      <TablePagination disabled={isPending} totalCount={data?.total ?? 0} />
    </TableContainer>
  )
}
