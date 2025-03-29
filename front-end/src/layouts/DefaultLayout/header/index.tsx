import { Header as HeaderStyled } from './styles.ts'
import logo from '../../../assets/logoufsc.png'

export function Header() {
  return (
    <HeaderStyled>
      <img src={logo} alt="Logo UFSC" />
      <p>Compilador de Linguagem PHP</p>
    </HeaderStyled>
  )
}
