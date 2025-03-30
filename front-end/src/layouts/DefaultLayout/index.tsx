import { Outlet } from 'react-router-dom'
import { Header } from './header'
import { Footer, SideBar, Main } from './styles'

export function DefaultLayout() {
  return (
    <>
      <Header />

      <Main>
        <SideBar>
          <h3>Informações do Projeto</h3>
          <section id="sobre">
            <h4>Sobre o Projeto</h4>
            <p>Compilador PHP online desenvolvido como projeto acadêmico.</p>
          </section>
          <section id="objetivos">
            <h4>Objetivos</h4>
            <p>
              Criar uma ferramenta para compilação e execução de código PHP
              diretamente no navegador.
            </p>
          </section>
          <section>
            <h4>Disciplina</h4>
            <p>
              <a href="https://cco.ufsc.br" target="_blank" rel="noreferrer">
                Desenvolvimento Web
              </a>
            </p>
          </section>
          <section>
            <h4>Integrantes</h4>
            <ul>
              <li>Bruno da Silva Castilho</li>
              <li>Lucas Tomio Schwochow</li>
            </ul>
          </section>
          <section>
            <h4>Repositório</h4>
            <p>
              <a
                href="https://github.com/bruno-castilho/INE5646-Programacao-para-Web"
                target="_blank"
                rel="noreferrer"
              >
                GitHub do Projeto
              </a>
            </p>
          </section>
        </SideBar>

        <Outlet />
      </Main>
      <Footer>
        <address id="contato">
          <p>Universidade Federal de Santa Catarina</p>
        </address>
      </Footer>
    </>
  )
}
