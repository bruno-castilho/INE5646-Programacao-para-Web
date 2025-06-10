// 1. Importa o módulo express
const express = require('express');

// 2. Cria uma instância do aplicativo Express
const app = express();

// 3. Define a porta em que o servidor irá escutar
const port = 3000;

// 4. Define uma rota para o caminho raiz '/'
app.get('/', (req, res) => {
  res.send('Olá, mundo com Express!');
});

// 5. Inicia o servidor e o faz escutar na porta especificada
app.listen(port, () => {
  console.log(`Servidor Express rodando em http://localhost:${port}`);
});