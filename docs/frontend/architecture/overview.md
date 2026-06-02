# Frontend: Arquitetura Geral

O frontend esta localizado em `web` e segue a estrutura padrao do Nuxt.

## Stack

- `Nuxt 4`: framework principal.
- `Vue 3`: camada de componentes.
- `Vuetify`: componentes visuais principais (`v-app`, `v-card`, `v-btn`, `v-dialog`, etc).
- `Tailwind CSS`: classes utilitarias, principalmente em telas de auth.
- `lucide-vue-next`: icones usados na navegacao e em botoes/cards.

## Configuracao

Arquivo principal:

- `web/nuxt.config.ts`

Configuracao atual:

- habilita DevTools;
- registra `@nuxtjs/tailwindcss`;
- registra `vuetify-nuxt-module`;
- expoe `runtimeConfig.public.URL_BACKEND` a partir de `NUXT_PUBLIC_URL_BACKEND`.

## Estrutura principal

- `web/app/app.vue`: envolve a aplicacao com `NuxtLayout` e `NuxtPage`.
- `web/app/layouts`: layouts da aplicacao.
- `web/app/pages`: rotas criadas automaticamente pelo Nuxt.
- `web/app/components`: componentes reutilizaveis.
- `web/composables`: funcoes reutilizaveis de estado e regras de UI/API.
- `web/types`: tipos globais do Nuxt.

## Estado atual

O front ja possui uma experiencia navegavel com integracao real em fluxos principais:

- autenticacao, refresh/logout e contexto do usuario;
- middleware global protegendo rotas privadas;
- onboarding de igreja;
- membros, ministerios, escalas e painel admin conectados a composables de API;
- base de PWA e notificacoes push.

Pontos ainda em aberto:

- CRUD completo para recursos principais;
- alguns estados de loading, vazio, erro e sucesso;
- repertorio de musicas em ministerios de louvor;
- recursos especializados por ministerio;
- permissoes mais granulares refletidas na UI.
