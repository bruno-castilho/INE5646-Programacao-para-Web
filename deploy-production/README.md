# 🛠️ Documentação de Deploy – Ambiente de Produção (VPS UFSC)

Este guia descreve os passos necessários para subir o ambiente de produção do projeto.

---

## ✅ Pré-requisitos

Certifique-se de que os seguintes softwares estão instalados no servidor:

- [Docker](https://www.docker.com/)

---

## 🚀 Passo a passo

### 1. Subir os containers com Docker

Acesse a pasta `deploy-production` do projeto:

```bash
cd deploy-production
```

Crie o arquivo `.env` copiando o conteúdo do arquivo `.env.template` e substitua os valores indicados conforme necessário:

```bash
cp .env.template .env
```

**Antes de subir os containers, adicione os arquivos de certificado SSL.**  
Coloque o certificado e a chave privada na pasta `./nginx/keys` com os seguintes nomes:

- `certificado.crt` – o certificado SSL  
- `chave.key` – a chave privada

O diretório deverá ficar assim:

```
deploy-production/
├── nginx/
│   └── keys/
│       ├── certificado.crt
│       └── chave.key
```

Em seguida, suba os serviços com o comando:

```bash
docker compose up -d
```

---

### 2. Inicializar o Replica Set do MongoDB

Execute o comando abaixo para acessar o container do MongoDB:

```bash
docker exec -it mongo mongosh
```

Dentro do terminal interativo do MongoDB, execute:

```js
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo:27017" }
  ]
})
```

Depois, digite `exit` para sair do prompt:

```bash
exit
```

---

### 3. Baixar a imagem do PHP 8.2 CLI

Como último passo, faça o pull da imagem PHP oficial para a execução dos scripts:

```bash
docker pull php:8.2-cli
```

---

## ✅ Pronto

O ambiente de produção está configurado e em execução, com o MongoDB, back-end e front-end integrados.

Agora é só começar a utilizar! 🚀
