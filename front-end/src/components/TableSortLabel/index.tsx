import { TableSortLabel as TableSortLabelMUI } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { ReactNode } from 'react'

interface TableSortLabelProps {
  label: string
  defaultLabel: string
  children: ReactNode
}

export function TableSortLabel({
  label,
  defaultLabel,
  children,
}: TableSortLabelProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const orderBy = (searchParams.get('orderBy') as 'desc' | 'asc') ?? 'asc'
  const sortBy = searchParams.get('sortBy') ?? defaultLabel

  function handleChangeOrder() {
    setSearchParams((state) => {
      state.set('orderBy', orderBy === 'asc' ? 'desc' : 'asc')
      state.set('sortBy', label)
      return state
    })
  }

  return (
    <TableSortLabelMUI
      active={sortBy === label}
      direction={sortBy === label ? orderBy : 'asc'}
      onClick={() => handleChangeOrder()}
      color="primary"
    >
      {children}
    </TableSortLabelMUI>
  )
}
