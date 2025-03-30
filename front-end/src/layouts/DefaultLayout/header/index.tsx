import { Header as HeaderStyled } from './styles.ts'
import logo from '../../../assets/logoufsc.png'
import { Link } from 'react-router-dom'

export function Header() {
  return (
    <HeaderStyled>
      <img src={logo} alt="Logo UFSC" />
      <h1>Compilador de Linguagem PHP</h1>
      <nav>
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <a href="#sobre">Sobre</a>
          </li>
          <li>
            <a href="#objetivos">Objetivos</a>
          </li>
          <li>
            <a href="#contato">Contato</a>
          </li>
          <li>
            <Link to="/dom">DOM do Projeto</Link>
          </li>
        </ul>
      </nav>
    </HeaderStyled>
  )
}
