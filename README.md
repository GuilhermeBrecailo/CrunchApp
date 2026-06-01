# AppQuadrangular

AppQuadrangular e um MVP de gestao para igrejas, com foco em organizar igreja, membros, ministerios, escalas, tarefas e recursos internos.

O projeto foi construido como uma aplicacao fullstack separada em frontend, backend, banco de dados e autenticacao. A ideia principal e oferecer uma base para que uma igreja consiga cadastrar sua estrutura, criar ministerios, gerenciar membros e montar escalas de voluntarios.

## Status do projeto

Projeto em desenvolvimento.

O core da integracao ja esta funcional: autenticacao, cadastro inicial, criacao de igreja, membros, ministerios, escalas, tarefas e recursos ja possuem fluxo conectado entre frontend e backend. Ainda faltam partes de acabamento para considerar o produto fechado, principalmente CRUD completo, permissoes mais detalhadas, fluxo de convite/vinculo de membros e testes ponta a ponta.

## Stack

### Frontend

- Nuxt 4
- Vue 3
- TypeScript
- Vuetify
- Tailwind CSS
- lucide-vue-next

### Backend

- Node.js
- TypeScript
- Fastify
- Prisma ORM
- PostgreSQL
- Keycloak
- Zod
- Jest

### Infraestrutura local

- Docker Compose
- PostgreSQL para a aplicacao
- PostgreSQL separado para o Keycloak
- Keycloak em modo de desenvolvimento

## Estrutura do repositorio

```text
.
├── api/                 # Backend Fastify, dominio, casos de uso, adapters e Prisma
├── web/                 # Frontend Nuxt/Vue
├── docs/                # Documentacao tecnica separada por contexto
├── docker-compose.yml   # Ambiente local com api, web, db e keycloak
├── package.json         # Dependencias auxiliares da raiz
└── README.md            # Visao geral do projeto
```

## Contexto funcional

O sistema trabalha com uma igreja como unidade principal. Um pastor titular cria sua conta, cria a igreja e passa a administrar membros, ministerios e escalas. Membros podem ser cadastrados dentro da igreja e vinculados a atividades ministeriais.

Entidades principais:

- Igreja
- Usuario
- Pastor titular
- Membro
- Ministerio
- Tarefa de ministerio
- Recurso de ministerio
- Escala
- Voluntario da escala

## O que ja esta feito

### Autenticacao e sessao

- Login integrado ao Keycloak.
- Refresh de sessao por token.
- Logout.
- Middleware global no frontend protegendo rotas privadas.
- Busca de contexto do usuario autenticado em `GET /api/me`.
- Redirecionamento conforme usuario tem ou nao uma igreja vinculada.

### Cadastro inicial

- Cadastro de pastor titular.
- Criacao da propria igreja pelo pastor.
- Fluxo de onboarding para pastor sem igreja.
- Bloqueio visual para membro sem igreja.

### Igreja e membros

- Listagem de membros da igreja.
- Cadastro de membro ja vinculado a igreja.
- Controle basico de permissao para permitir que um membro gerencie outros membros.
- Perfil do usuario autenticado.
- Atualizacao de dados do proprio perfil.
- Datas de indisponibilidade no perfil.
- Vinculo do usuario com ministerio principal.

### Ministerios

- Listagem de ministerios.
- Criacao de ministerio.
- Detalhe de ministerio.
- Definicao de lider do ministerio.
- Tipos de ministerio, como louvor, criancas, recepcao, midia, intercessao e outros.

### Escalas

- Listagem geral de escalas da igreja.
- Criacao de escala.
- Criacao de escala dentro de um ministerio especifico.
- Vinculo de voluntarios a uma escala.
- Atualizacao dos voluntarios de uma escala.
- Dashboard exibindo proximas escalas.
- Filtro de escalas por ministerio.

### Tarefas e recursos

- Listagem de tarefas por ministerio.
- Criacao de tarefa por ministerio.
- Responsavel opcional para tarefa.
- Prioridade de tarefa.
- Listagem de recursos por ministerio.
- Criacao de recurso com titulo, link, categoria e observacoes.

### Backend e dominio

- Separacao em camadas de dominio, aplicacao, infraestrutura e interfaces.
- Entidades e value objects para regras de dominio.
- Repositorios com Prisma.
- Adapters HTTP para os fluxos principais.
- Handler padronizado para respostas da API.
- Testes unitarios para regras de dominio e entidades.

### Documentacao

- Documentacao geral em `docs/`.
- Documentacao separada para backend e frontend.
- Mapeamento de arquitetura, rotas, componentes, estado e fluxos.

## O que falta fazer

### Prioridade alta

- Criar um `.env.example` com todas as variaveis necessarias.
- Fechar o CRUD completo dos principais recursos:
  - editar e deletar ministerios;
  - editar e deletar escalas;
  - editar e deletar tarefas;
  - editar e deletar recursos;
  - editar dados de membros;
  - remover ou desativar membros.
- Trocar contadores fixos no painel administrativo por dados reais da API.
- Definir e aplicar regras de permissao no backend:
  - o que apenas pastor titular pode fazer;
  - o que lider de ministerio pode fazer;
  - o que membro com permissao administrativa pode fazer;
  - o que membro comum pode apenas visualizar.
- Validar o fluxo completo usando Docker Compose e Keycloak.

### Prioridade media

- Criar fluxo melhor para membro sem igreja:
  - convite por email;
  - codigo de convite;
  - solicitacao para entrar em uma igreja;
  - aprovacao pelo pastor ou administrador.
- Melhorar o modulo de ministerios especializados:
  - repertorio e musicas para ministerio de louvor;
  - aulas, materiais e faixas etarias para ministerio infantil.
- Criar testes de integracao para endpoints principais.
- Melhorar estados de carregamento e vazio no frontend.
- Padronizar mensagens de erro e sucesso.
- Revisar nomenclaturas internas, como `Crunch`, `Departament` e `Ministery`.

### Prioridade baixa

- Criar seed de desenvolvimento.
- Adicionar screenshots ou video curto de demonstracao.
- Melhorar o README do frontend, que ainda usa texto padrao do Nuxt.
- Criar pipeline de CI para build e testes.
- Adicionar lint/format como comandos padronizados.
- Revisar logs soltos de desenvolvimento.
- Preparar deploy em ambiente externo.

## Como rodar localmente

### 1. Configurar variaveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as variaveis usadas pelo Docker Compose.

Variaveis esperadas:

```env
NODE_ENV=
API_PORT=
WEB_PORT=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
KEYCLOAK_REALM=
KEYCLOAK_ADMIN_REALM=
KEYCLOAK_USER=
KEYCLOAK_PASSWORD=
KEYCLOAK_GRANT_TYPE=
KEYCLOAK_SECRET_KEY=
KEYCLOAK_CLIENT_ID=
KEYCLOAK_CLIENT_USER_ID=
KEYCLOAK_CLIENT_UUID=
NUXT_PUBLIC_URL_BACKEND=
```

Observacao: o projeto ainda precisa de um `.env.example` versionado para facilitar a configuracao por outras pessoas.

### 2. Subir ambiente com Docker

```bash
docker compose up --build
```

Servicos esperados:

- Frontend: `http://localhost:3000`
- API: porta definida em `API_PORT`
- Keycloak: `http://localhost:8080`
- PostgreSQL da aplicacao: porta definida em `DB_PORT`

### 3. Rodar API localmente fora do Docker

```bash
cd api
npm install
npm run prisma:generate
npm run dev
```

### 4. Rodar frontend localmente fora do Docker

```bash
cd web
npm install
npm run dev
```

## Testes

Para rodar os testes da API uma vez:

```bash
cd api
npx jest --runInBand
```

Estado atual verificado:

- 10 suites passaram.
- 79 testes passaram.

O script `npm test` da API atualmente roda em modo watch. Para CI, o ideal e adicionar um script separado, por exemplo:

```json
"test:ci": "jest --runInBand"
```

## Build

Para gerar o build de producao do frontend:

```bash
cd web
npm run build
```

Estado atual verificado:

- O build do Nuxt completa com sucesso.
- Existem warnings de minificacao CSS relacionados a camadas do Vuetify/Tailwind, mas o build final e gerado.

## Documentacao interna

- [Documentacao geral](docs/README.md)
- [Backend](docs/backend/README.md)
- [Frontend](docs/frontend/README.md)

## Roadmap sugerido

1. Criar `.env.example`.
2. Completar CRUD de ministerios, escalas, tarefas e recursos.
3. Substituir dados fixos do admin por dados reais.
4. Fechar regras de permissao no backend.
5. Implementar fluxo de convite ou vinculo de membro sem igreja.
6. Criar testes de integracao dos endpoints principais.
7. Adicionar seed e roteiro de demonstracao.
8. Preparar screenshots, video curto e deploy.

## Resumo para portfolio

Este projeto demonstra uma aplicacao fullstack em TypeScript com Nuxt, Fastify, Prisma, PostgreSQL, Keycloak e Docker. A arquitetura separa dominio, aplicacao, infraestrutura e interfaces, com testes cobrindo regras de negocio e uma integracao funcional entre frontend e backend para os principais fluxos de gestao de igreja.
