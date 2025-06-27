import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link as LinkMaterial,
  Skeleton,
} from '@mui/material'
import { TableSortLabel } from '../../../components/TableSortLabel'

import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { TablePagination } from '../../../components/TablePagination'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { files } from '../../../api/files'
import { z } from 'zod'
import { File } from '../../../types/file'

interface SharedWithMeTableRowProps {
  file: File
}

function SharedWithMeTableRow({ file }: SharedWithMeTableRowProps) {
  return (
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
        {file.created_by.email}
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
    </TableRow>
  )
}

function SharedWithMeTableRowSkeleton() {
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

      <TableCell component="th" scope="row" align="left">
        <Skeleton variant="text" />
      </TableCell>
    </TableRow>
  )
}

export function SharedWithMe() {
  const [searchParams] = useSearchParams()

  const perPage = z.coerce.number().parse(searchParams.get('perPage') ?? '10')
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1')

  const sortBy = (searchParams.get('sortBy') as 'name' | 'updated_at') ?? 'name'
  const orderBy = (searchParams.get('orderBy') as 'asc' | 'desc') ?? 'asc'

  const { data, isPending } = useQuery({
    queryKey: ['files-sharedWithMe', perPage, page, sortBy, orderBy],
    queryFn: () =>
      files.searchFilesSharedWithMe({ perPage, page, sortBy, orderBy }),
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
            <TableCell align="left">Criado por</TableCell>
            <TableCell align="left">Atualizado por</TableCell>

            <TableCell align="left" sx={{ minWidth: 200 }}>
              <TableSortLabel label="updated_at" defaultLabel="updated_at">
                Atualizado há
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!isPending &&
            data?.files.map((file) => (
              <SharedWithMeTableRow key={file.id} file={file} />
            ))}

          {isPending &&
            Array.from({ length: 10 }).map((_, index) => (
              <SharedWithMeTableRowSkeleton key={index} />
            ))}
        </TableBody>
      </Table>
      <TablePagination disabled={isPending} totalCount={data?.total ?? 0} />
    </TableContainer>
  )
}
