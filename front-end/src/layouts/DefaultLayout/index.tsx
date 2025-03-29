import { Outlet } from 'react-router-dom'
import { Header } from './header'

export function DefaultLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
