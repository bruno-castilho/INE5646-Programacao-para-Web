import {
  Container,
  Editor,
  FileButton,
  Menu,
  MoreFileButton,
  Output,
  RunButton,
} from './styles'

export function Home() {
  return (
    <>
      <Menu>
        <FileButton className="main">main.php</FileButton>
        <MoreFileButton className="mais">+</MoreFileButton>
        <RunButton className="run">Run</RunButton>
      </Menu>

      <Container>
        <Editor>
          <textarea
            id="codigo"
            placeholder="Digite seu código PHP aqui..."
          ></textarea>
        </Editor>
        <Output>
          <pre id="resultado">Aqui aparecerá o resultado do código...</pre>
        </Output>
      </Container>
    </>
  )
}
