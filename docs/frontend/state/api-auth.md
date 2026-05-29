# Frontend: Estado, Auth e Integracao com API

O front ainda nao possui uma camada de API completamente conectada ao backend.

## Composable de autenticacao

Arquivo:

- `web/composables/useAuth.ts`

Responsabilidade esperada:

- guardar `access_token`;
- guardar dados do usuario;
- expor funcoes de `register`, `login` e `logout`.

Estado atual:

- usa `useState` para `access_token` e `user`;
- tenta usar `$customFetch`;
- monta URLs com `config.public.URL_BACKEND`;
- importa `jwtDecode`, mas ainda nao usa esse import;
- chama endpoints que nao batem com as rotas atuais do backend.

## Tipos de API

Arquivos:

- `web/composables/useTypes.ts`;
- `web/types/nuxt.d.ts`.

`ApiResponse` define uma resposta padrao com:

- `data`;
- `error`;
- `status`.

`nuxt.d.ts` declara `$customFetch` no Nuxt app e nas propriedades dos componentes Vue.

## Pontos pendentes

### Plugin do `$customFetch`

Existe tipagem para `$customFetch`, mas nao foi encontrado plugin em `web/plugins` registrando esse helper.

Antes de usar `useAuth` em producao, sera necessario criar um plugin, por exemplo:

- `web/plugins/customFetch.ts`.

### Runtime config

`useAuth.ts` usa:

- `config.public.URL_BACKEND`.

Mas `web/nuxt.config.ts` ainda nao define esse valor.

### Endpoints desalinhados

O composable chama:

- `/auth/register`;
- `/auth/login`;
- `/public/auth/logout`.

As rotas registradas no backend atualmente incluem:

- `/api/pastor/signup`;
- `/api/user/create`;
- `/api/user/getAll`;
- `/api/user/getById`;
- `/api/user/update`;
- `/api/user/delete`;
- `/api/crunch/create`;
- `/api/crunch/getAll`;
- `/api/crunch/getById`;
- `/api/crunch/update`;
- `/api/crunch/delete`.

E necessario decidir se o backend vai ganhar rotas de auth separadas ou se o front deve chamar as rotas existentes.

## Integracao recomendada

1. Definir `URL_BACKEND` no `nuxt.config.ts`.
2. Criar plugin `$customFetch`.
3. Ajustar `useAuth.ts` para os endpoints reais.
4. Criar middleware para proteger rotas internas.
5. Trocar mocks de paginas por chamadas reais.
6. Centralizar tipos de entidades usadas pelo front.

Para o padrao completo de criacao de composables, veja:

- [Padrao de composables](composables.md)
