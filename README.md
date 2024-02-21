# README

## Descrição

Este repositório contém uma API REST desenvolvida em NestJS, que utiliza um algoritmo de Recuperação Aumentada de Geração (RAG) para análise de documentos em PDF. A API permite enviar arquivos PDF para a geração de embeddings, os quais são armazenados em um banco de dados PostgreSQL utilizando Prisma ORM. Posteriormente, a API possibilita buscar textos similares com base nos embeddings gerados, os quais são utilizados como contexto para formular perguntas à OpenAI.

## Pré-requisitos

Antes de começar, certifique-se de ter os seguintes requisitos instalados em sua máquina:

- Node.js
- PostgreSQL
- Prisma CLI
- Nest CLI

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/brunoaiolfi/RAG.git
```

2. Navegue até o diretório do projeto:

```bash
cd RAG
```

3. Instale as dependências:

```bash
npm install
```

4. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis, substituindo os valores conforme necessário:

```
DATABASE_URL=postgresql://usuario:senha@endereco-do-banco:5432/nome-do-banco
OPENAIKEY=sua-chave-da-openai
```

5. Execute as migrações do banco de dados:

```bash
npx prisma migrate dev
```

6. Inicie o servidor:

```bash
npm run start:dev
```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para enviar um pull request ou abrir uma issue para relatar problemas ou sugestões.
