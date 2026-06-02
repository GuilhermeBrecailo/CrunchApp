# Frontend: Layouts e Navegacao

O app usa dois layouts principais.

## Layout padrao

Arquivo:

- `web/app/layouts/default.vue`

Responsabilidade:

- envolver a aplicacao com `v-app`;
- renderizar `LayoutsMain`;
- limitar o conteudo em um `v-container` com `max-width="1200"`;
- renderizar a pagina atual com `NuxtPage`.

`LayoutsMain` fica em:

- `web/app/components/layouts/main.vue`

Ele monta a estrutura do app logado:

- `LayoutsAppBar`;
- `v-main`;
- conteudo da pagina;
- `LayoutsBottomNavigation`.

## App bar

Arquivo:

- `web/app/components/layouts/appBar/index.vue`

Mostra:

- avatar do usuario;
- saudacao;
- nome da igreja;
- botao de notificacoes com badge.

Os dados de usuario e igreja devem vir do contexto autenticado carregado pela aplicacao.

## Bottom navigation

Arquivo:

- `web/app/components/layouts/bottomNavigation/index.vue`

Rotas principais:

- `/`: Inicio.
- `/scale`: Escalas.
- `/ministery`: Ministerios.
- `/user`: Usuario.
- `/admin`: Admin.

O menu usa icones do `lucide-vue-next` e marca como ativo o caminho atual. Para ministerios e usuario, a logica tambem cobre subrotas com `startsWith`.

## Layout sem bottom navigation

Arquivo:

- `web/app/layouts/notAppBottom.vue`

Usado em:

- `web/app/pages/login.vue`;
- `web/app/pages/register.vue`;
- `web/app/pages/forgot-password.vue`.

Responsabilidade:

- renderizar telas de autenticacao sem app bar e sem menu inferior.

Esse layout e adequado para telas publicas, onboarding ou recuperacao de senha.
