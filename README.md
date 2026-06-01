# AppQuadrangular

AppQuadrangular e um MVP fullstack para gestao de igrejas, ministerios, membros e escalas. O projeto nasceu para organizar a rotina interna de uma igreja: cadastro da igreja, criacao de ministerios, cadastro de membros, montagem de escalas, atribuicao de voluntarios, tarefas e recursos por ministerio.

O sistema esta em desenvolvimento, mas o fluxo principal ja esta integrado entre frontend, backend, banco de dados e autenticacao.

## Status atual

O core do produto ja funciona:

- autenticacao com Keycloak;
- cadastro de pastor titular;
- criacao da igreja;
- onboarding para pastor sem igreja;
- cadastro e listagem de membros;
- criacao e listagem de ministerios;
- criacao e listagem de escalas;
- vinculo de voluntarios nas escalas;
- tarefas e recursos por ministerio;
- perfil do usuario;
- painel administrativo da igreja;
- painel de administracao da plataforma;
- notificacoes push/PWA em base inicial.

Ainda faltam fechamentos importantes para considerar o produto pronto para uso real: CRUD completo, regras de permissao mais profundas, fluxo melhor de convite/vinculo de membros e testes de integracao ponta a ponta.

## Stack

### Frontend

- Nuxt 4
- Vue 3
- TypeScript
- Vuetify
- Tailwind CSS
- lucide-vue-next
- PWA/service worker
- Push Notifications

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
- PostgreSQL da aplicacao
- PostgreSQL separado para o Keycloak
- Keycloak em modo de desenvolvimento

## Estrutura do projeto

```text
.
├── api/                 # API Fastify, dominio, adapters, Prisma e testes
├── web/                 # Aplicacao Nuxt/Vue
├── docs/                # Documentacao tecnica por contexto
├── .env.example         # Exemplo das variaveis de ambiente
├── docker-compose.yml   # Ambiente local com web, api, db e keycloak
├── package.json         # Dependencias auxiliares da raiz
└── README.md            # Visao geral do projeto
```

## Contexto funcional

O sistema usa a igreja como unidade central. Um pastor titular cria sua conta, cria a igreja e passa a gerenciar membros, ministerios e escalas. Os membros cadastrados podem ser vinculados a ministerios, receber permissoes administrativas e participar de escalas.

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
- Inscricao de notificacao push

## O que ja esta feito

### Autenticacao e sessao

- Login integrado ao Keycloak.
- Refresh de sessao.
- Logout.
- Middleware global protegendo rotas privadas no frontend.
- Busca de contexto do usuario em `GET /api/me`.
- Redirecionamento baseado em usuario com ou sem igreja.
- Suporte a roles administrativas (`ADMIN` e `SUPER_ADMIN`) no painel da plataforma.

### Cadastro e onboarding

- Cadastro de pastor titular.
- Criacao da propria igreja pelo pastor.
- Onboarding para pastor sem igreja.
- Estado visual para membro sem igreja.
- Arquivo `.env.example` com variaveis esperadas para ambiente local.

### Igreja e membros

- Listagem de membros da igreja.
- Cadastro de membro ja vinculado a igreja.
- Atualizacao de permissao para membro gerenciar outros membros.
- Perfil do usuario autenticado.
- Atualizacao do proprio perfil.
- Datas de indisponibilidade do usuario.
- Vinculo do usuario com ministerio principal.

### Ministerios

- Listagem de ministerios da igreja.
- Criacao de ministerio.
- Detalhe de ministerio.
- Definicao de lider.
- Tipos de ministerio como louvor, criancas, recepcao, midia, intercessao e outros.
- Abas especificas no detalhe do ministerio para visao geral, escalas, tarefas, recursos e areas futuras.

### Escalas

- Listagem geral de escalas.
- Criacao de escala.
- Criacao de escala dentro de um ministerio especifico.
- Filtro de escalas por ministerio.
- Vinculo e atualizacao de voluntarios em uma escala.
- Dashboard exibindo proximas escalas.
- Deep link para destacar uma escala especifica.

### Tarefas e recursos

- Listagem de tarefas por ministerio.
- Criacao de tarefa por ministerio.
- Responsavel opcional para tarefa.
- Prioridade da tarefa.
- Listagem de recursos por ministerio.
- Criacao de recurso com titulo, link, categoria e observacoes.

### Administracao

- Painel administrativo da igreja para membros e ministerios.
- Painel administrativo da plataforma para usuarios administradores.
- Listagem de igrejas da plataforma.
- Listagem global de ministerios.
- Detalhe de uma igreja com usuarios, ministerios e historico pastoral.
- Totais agregados no painel de plataforma.

### Notificacoes e PWA

- Manifest web.
- Service worker.
- Modelo `PushSubscription` no Prisma.
- Endpoint para chave publica VAPID.
- Endpoint para registrar inscricao push.
- Endpoint para remover inscricao push.
- Composable `usePushNotifications` no frontend.

### Backend, dominio e testes

- Organizacao em camadas: dominio, aplicacao, infraestrutura e interfaces.
- Entidades e value objects para regras de dominio.
- Repositorios com Prisma.
- Adapters HTTP para os fluxos principais.
- Handler padronizado para respostas da API.
- Testes unitarios para regras de dominio e entidades.

## O que falta fazer

### Prioridade alta

- Fechar CRUD completo dos principais recursos:
  - editar e deletar ministerios;
  - editar e deletar escalas;
  - editar e deletar tarefas;
  - editar e deletar recursos;
  - editar dados de membros;
  - remover, arquivar ou desativar membros.
- Substituir contadores fixos que ainda existem no painel administrativo da igreja, como totais de escalas e musicas.
- Definir e aplicar permissoes mais granulares no backend:
  - pastor titular;
  - administrador da plataforma;
  - lider de ministerio;
  - membro com permissao administrativa;
  - membro comum.
- Validar o fluxo completo com Docker Compose e Keycloak:
  - subir ambiente;
  - configurar Keycloak;
  - cadastrar pastor;
  - criar igreja;
  - cadastrar membro;
  - criar ministerio;
  - criar escala;
  - adicionar voluntarios;
  - atualizar perfil;
  - testar logout/refresh.
- Criar testes de integracao para os endpoints principais.

### Prioridade media

- Criar fluxo melhor para membro sem igreja:
  - convite por email;
  - codigo de convite;
  - solicitacao para entrar em uma igreja;
  - aprovacao pelo pastor ou administrador.
- Evoluir modulos especializados:
  - repertorio e musicas para ministerio de louvor;
  - aulas, materiais e faixas etarias para ministerio infantil.
- Enviar notificacoes push em eventos reais do sistema, como nova escala ou alteracao de voluntarios.
- Criar seed de desenvolvimento.
- Melhorar estados de carregamento, vazio, erro e sucesso no frontend.
- Atualizar a documentacao em `docs/frontend`, que ainda possui trechos antigos dizendo que tudo esta mockado.
- Revisar nomenclaturas internas, como `Crunch`, `Departament` e `Ministery`.

### Prioridade baixa

- Melhorar o README especifico do frontend.
- Criar pipeline de CI para build e testes.
- Adicionar scripts padronizados para lint, format e teste CI.
- Remover logs soltos de desenvolvimento.
- Adicionar screenshots ou video curto de demonstracao.
- Preparar deploy em ambiente externo.

## Como rodar localmente

### 1. Configurar ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Depois ajuste os valores conforme seu ambiente local.

Variaveis principais:

```env
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
DATABASE_URL=
API_PORT=
WEB_PORT=
NODE_ENV=
NUXT_PUBLIC_URL_BACKEND=
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=
KEYCLOAK_CLIENT_UUID=
KEYCLOAK_USER=
KEYCLOAK_PASSWORD=
KEYCLOAK_GRANT_TYPE=
KEYCLOAK_SECRET_KEY=
KEYCLOAK_REALM=
KEYCLOAK_CLIENT_USER_ID=
KEYCLOAK_CLIENT_ID=
KEYCLOAK_ADMIN_REALM=
TENANT_ID=
```

Para gerar chaves VAPID:

```bash
cd api
npx web-push generate-vapid-keys
```

### 2. Subir com Docker Compose

```bash
docker compose up --build
```

Servicos esperados:

- Frontend: `http://localhost:3000`
- API: `http://localhost:8000` ou porta definida em `API_PORT`
- Keycloak: `http://localhost:8080`
- PostgreSQL da aplicacao: porta definida em `DB_PORT`

### 3. Rodar API fora do Docker

```bash
cd api
npm install
npm run prisma:generate
npm run dev
```

### 4. Rodar frontend fora do Docker

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

O script `npm test` da API roda em modo watch. Para CI, o ideal e manter um comando separado, por exemplo:

```json
"test:ci": "jest --runInBand"
```

## Build

Para gerar o build de producao do frontend:

```bash
cd web
npm run build
```

## Documentacao interna

- [Documentacao geral](docs/README.md)
- [Backend](docs/backend/README.md)
- [Frontend](docs/frontend/README.md)

Observacao: parte da documentacao do frontend esta desatualizada em relacao ao estado atual da integracao. O codigo ja possui mais fluxos conectados a API do que alguns documentos descrevem.

## Roadmap sugerido

1. Completar CRUD de ministerios, escalas, tarefas, recursos e membros.
2. Substituir dados fixos do painel administrativo da igreja por dados reais.
3. Fechar permissoes no backend.
4. Validar o fluxo completo com Docker Compose e Keycloak.
5. Criar testes de integracao.
6. Implementar convite ou solicitacao de vinculo para membros.
7. Enviar notificacoes push em eventos reais.
8. Evoluir musicas/repertorio e aulas/materiais por ministerio.
9. Atualizar documentacao interna.
10. Preparar screenshots, video curto e deploy.

## Resumo para portfolio

Este projeto demonstra uma aplicacao fullstack em TypeScript com Nuxt, Fastify, Prisma, PostgreSQL, Keycloak, Docker, PWA e notificacoes push. A arquitetura separa dominio, aplicacao, infraestrutura e interfaces, com testes cobrindo regras de negocio e uma integracao funcional entre frontend e backend para os principais fluxos de gestao de igreja.
