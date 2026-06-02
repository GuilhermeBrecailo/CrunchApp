# Frontend: Paginas e Rotas

As rotas sao geradas automaticamente pelo Nuxt a partir da pasta `web/app/pages`.

## `/`

Arquivo:

- `web/app/pages/index.vue`

Tela inicial do usuario logado. Renderiza:

- `DashboardNextScheduleCard`;
- `DashboardQuickAccess`;
- `DashboardUpcomingEvents`.

Os dados do dashboard devem refletir usuario, igreja e proximas escalas quando houver contexto autenticado.

## `/login`

Arquivo:

- `web/app/pages/login.vue`

Tela publica de login. Usa o layout `notAppBottom`.

Estado atual:

- campos de email e senha;
- alternancia de visibilidade da senha;
- `handleLogin` autentica e carrega `/api/me`;
- link para `/register` orientado a pastor titular;
- link para `/forgot-password`.

## `/register`

Arquivo:

- `web/app/pages/register.vue`

Tela publica de cadastro. Usa o layout `notAppBottom`.

Estado atual:

- campos de nome, email, telefone, senha e confirmacao;
- cadastro publico cria sempre `Pastor titular`;
- validacao simples de igualdade entre senhas;
- `handleRegister` chama a API e volta para `/login`;
- membros devem ser criados pela area administrativa da igreja.

## `/forgot-password`

Arquivo:

- `web/app/pages/forgot-password.vue`

Tela publica para recuperacao de senha. Ainda depende do fluxo definitivo no backend/Keycloak.

## `/onboarding/church`

Arquivo:

- `web/app/pages/onboarding/church.vue`

Fluxo usado quando o pastor autenticado ainda nao possui igreja vinculada.

## `/scale`

Arquivo:

- `web/app/pages/scale.vue`

Tela de escalas gerais.

Mostra:

- titulo da pagina;
- botao `Novo`;
- filtros por ministerio;
- secoes de escalas;
- cards com evento, horario e voluntarios.

Estado atual:

- lista e cria escalas usando composables de API;
- permite filtro por ministerio;
- permite editar, excluir e atribuir voluntarios conforme permissao do usuario.

## `/ministery`

Arquivo:

- `web/app/pages/ministery/index.vue`

Lista ministerios e permite navegar para o detalhe.

Estado atual:

- lista e cria ministerios usando composables de API;
- clique em um item navega para `/ministery/{id}`;
- edicao e exclusao ficam disponiveis na administracao para pastor titular.

## `/ministery/[id]`

Arquivo:

- `web/app/pages/ministery/[id].vue`

Detalhe de um ministerio.

Mostra:

- botao de voltar;
- nome e lider do ministerio;
- abas de escalas, musicas, tarefas e recursos;
- modais de criacao conforme a aba.

Estado atual:

- detalhe do ministerio, escalas, tarefas e recursos usam integracao com API;
- pastor titular ou lider do ministerio pode criar, editar e excluir escalas, tarefas e recursos;
- musicas/repertorio usam `MediaItem` com categoria interna de musica;

## `/user`

Arquivo:

- `web/app/pages/user.vue`

Tela de perfil do usuario.

Mostra:

- dados basicos do usuario;
- ministerio principal;
- funcao;
- indisponibilidades;
- sugestao;
- telefone;
- botao salvar.

Estado atual:

- carrega dados do usuario autenticado;
- permite atualizar perfil, telefone, ministerio principal, funcao, indisponibilidades e sugestao;
- ainda precisa de refinamento de validacoes e estados de feedback.

## `/admin`

Arquivo:

- `web/app/pages/admin.vue`

Tela administrativa da igreja e, quando aplicavel, da plataforma.

Mostra:

- cards de estatisticas;
- area de membros;
- lista de ministerios;
- areas administrativas globais para perfis autorizados.

Estado atual:

- consome dados administrativos de igreja e plataforma;
- ainda existem contadores e acoes que precisam ser ligados a dados reais;
- fluxo de convite ou solicitacao de membro ainda precisa ser implementado.
