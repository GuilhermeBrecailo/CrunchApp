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
- registra `vuetify-nuxt-module`.

Hoje o `nuxt.config.ts` ainda nao define `runtimeConfig.public.URL_BACKEND`, embora `useAuth.ts` tente usar esse valor para montar chamadas HTTP.

## Estrutura principal

- `web/app/app.vue`: envolve a aplicacao com `NuxtLayout` e `NuxtPage`.
- `web/app/layouts`: layouts da aplicacao.
- `web/app/pages`: rotas criadas automaticamente pelo Nuxt.
- `web/app/components`: componentes reutilizaveis.
- `web/composables`: funcoes reutilizaveis de estado e regras de UI/API.
- `web/types`: tipos globais do Nuxt.

## Estado atual

O front ja possui uma casca navegavel e consistente, mas ainda esta em fase de prototipo:

- dados de dashboard, ministerios, musicas, escalas e admin estao mockados;
- a camada de API ainda nao esta consolidada;
- formularios salvam com `console.log` ou `alert`;
- nao ha middleware de autenticacao protegendo rotas internas.
