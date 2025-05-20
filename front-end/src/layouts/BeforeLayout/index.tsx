import { Outlet } from 'react-router-dom'
import { BeforeLayoutCard, BeforeLayoutContainer } from './styles'

export function BeforeLayout() {
  return (
    <BeforeLayoutContainer>
      <BeforeLayoutCard variant="outlined">
        <Outlet />
      </BeforeLayoutCard>
    </BeforeLayoutContainer>
  )
}
