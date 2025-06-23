import { TablePagination as TablePaginationMUI } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

interface TablePaginationProps {
  totalCount: number | undefined
  disabled: boolean
}

export function TablePagination({
  totalCount,
  disabled,
}: TablePaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const perPage = z.coerce.number().parse(searchParams.get('perPage') ?? '10')
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1')

  function handleChangePage(
    _event: React.MouseEvent<HTMLButtonElement> | null,
    pageIndex: number,
  ) {
    setSearchParams((state) => {
      state.set('page', (pageIndex + 1).toString())
      return state
    })
  }

  function handleChangeRowsPerPage(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setSearchParams((state) => {
      state.set('page', (1).toString())
      state.set('perPage', parseInt(event.target.value, 10).toString())
      return state
    })
  }

  return (
    <TablePaginationMUI
      component="div"
      labelRowsPerPage="Linhas por página"
      labelDisplayedRows={({ from, to, count }) => {
        return `${from}–${to} de ${count !== -1 ? count : `mais do que ${to}`}`
      }}
      rowsPerPageOptions={[10, 25, 50, 100]}
      count={totalCount || 0}
      page={page - 1}
      onPageChange={handleChangePage}
      rowsPerPage={perPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      disabled={disabled}
      color="primary"
    />
  )
}
