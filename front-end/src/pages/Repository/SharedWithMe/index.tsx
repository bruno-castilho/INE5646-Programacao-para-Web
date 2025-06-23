import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { TableSortLabel } from '../../../components/TableSortLabel'

import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { TablePagination } from '../../../components/TablePagination'

interface File {
  id: string
  name: string
  updated_by: string
  created_by: string
  updated_at: Date
}

const files: File[] = [
  {
    id: 'e7f8a9b0-c1d2-4e5f-8765-4321fedcba98',
    name: 'documento_1.php',
    created_by: 'usuario@example.com',
    updated_by: 'outro.usuario@example.com',
    updated_at: new Date('2024-03-15T10:30:00.000Z'),
  },
  {
    id: 'b2c3d4e5-f6a7-4b8c-9012-3456789abcde',
    name: 'relatorio_2.php',
    created_by: 'usuario@example.com',
    updated_by: 'outro.usuario@example.com',
    updated_at: new Date('2025-01-20T14:45:00.000Z'),
  },
  {
    id: '1a2b3c4d-5e6f-4789-0123-456789abcdef',
    name: 'imagem_3.php',
    created_by: 'usuario@example.com',
    updated_by: 'outro.usuario@example.com',
    updated_at: new Date('2023-07-01T08:00:00.000Z'),
  },
  {
    id: '9f8e7d6c-5b4a-4321-fedc-ba9876543210',
    name: 'planilha_4.php',
    created_by: 'usuario@example.com',
    updated_by: 'outro.usuario@example.com',
    updated_at: new Date('2024-11-05T16:15:00.000Z'),
  },
  {
    id: '3c4d5e6f-7a8b-4901-2345-6789abcdef01',
    name: 'apresentacao.php',
    created_by: 'usuario@example.com',
    updated_by: 'outro.usuario@example.com',
    updated_at: new Date('2025-06-10T09:00:00.000Z'),
  },
  {
    id: 'd1e2f3a4-b5c6-47d8-90ef-1234567890ab',
    name: 'dados_6.php',
    created_by: 'usuario@example.com',
    updated_by: 'outro.usuario@example.com',
    updated_at: new Date('2023-09-22T11:20:00.000Z'),
  },
  {
    id: 'f5e6d7c8-a9b0-4123-4567-89abcdef0123',
    name: 'config_7.php',
    created_by: 'usuario@example.com',
    updated_by: 'outro.usuario@example.com',
    updated_at: new Date('2024-01-01T13:00:00.000Z'),
  },
  {
    id: '8a7b6c5d-4e3f-4210-9876-543210fedcba',
    name: 'log_8.php',
    created_by: 'usuario@example.com',
    updated_by: 'outro.usuario@example.com',
    updated_at: new Date('2025-04-03T17:05:00.000Z'),
  },
  {
    id: '2b3c4d5e-6f7a-4890-1234-56789abcdef0',
    name: 'backup_9.php',
    created_by: 'usuario@example.com',
    updated_by: 'outro.usuario@example.com',
    updated_at: new Date('2023-05-10T19:00:00.000Z'),
  },
  {
    id: '4d5e6f7a-8b9c-4012-3456-789abcdef012',
    name: 'teste_10.php',
    created_by: 'usuario@example.com',
    updated_by: 'outro.usuario@example.com',
    updated_at: new Date('2024-08-28T09:30:00.000Z'),
  },
]

export function SharedWithMe() {
  return (
    <TableContainer>
      <Table sx={{ width: '100%' }} size="small">
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ minWidth: 400 }}>
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
          {files?.map((file) => (
            <TableRow key={file.id}>
              <TableCell component="th" scope="row" align="left">
                {file.id}
              </TableCell>
              <TableCell component="th" scope="row" align="left">
                {file.name}
              </TableCell>

              <TableCell component="th" scope="row" align="left">
                {file.created_by}
              </TableCell>

              <TableCell component="th" scope="row" align="left">
                {file.updated_by}
              </TableCell>

              <TableCell component="th" scope="row" align="left">
                {formatDistanceToNow(file.updated_at, {
                  locale: ptBR,
                  addSuffix: true,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination disabled={false} totalCount={44} />
    </TableContainer>
  )
}
