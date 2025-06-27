# 🛠️ Documentação de Deploy - Ambiente de Desenvolvimento

Este guia descreve os passos necessários para subir o ambiente de desenvolvimento do projeto.

---

## ✅ Pré-requisitos

Certifique-se de que os seguintes softwares estão instalados na sua máquina:

- [Docker](https://www.docker.com/)
- [Node.js (>= v22.16.0)](https://nodejs.org/)

---

## 🚀 Passo a passo

### 1. Subir os containers com Docker

Entre na pasta `deploy-dev` do projeto:

```bash
cd deploy-dev
```

Suba os serviços com o comando:

```bash
docker compose up -d
```

---

### 2. Configurar o ambiente do back-end

Entre na pasta do back-end do projeto:

```bash
cd ../back-end
```

Crie o arquivo `.env` copiando o conteúdo do arquivo `.env.template`:

```bash
cp .env.template .env
```

Instale as dependências e gere o Prisma Client:

```bash
npm install
npm run prisma:generate
```

Opcionalmente, para visualizar os dados no banco:

```bash
npm run prisma:studio
```

Inicie o servidor em modo desenvolvimento:

```bash
npm run start:dev
```

---

### 3. Configurar e iniciar o front-end

Em um **novo terminal**, siga os passos abaixo:

Entre na pasta do front-end:

```bash
cd ../front-end
```

Crie o arquivo `.env` copiando o conteúdo do `.env.template`:

```bash
cp .env.template .env
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento do front-end:

```bash
npm run dev
```

---

## ✅ Pronto

O ambiente de desenvolvimento estará configurado e rodando localmente com o MongoDB, o back-end e o front-end integrados.

Agora é só começar a desenvolver! 🚀
