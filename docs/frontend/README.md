# Indice: Documentacao do Frontend

Esta documentacao descreve como o front-end do AppQuadrangular esta organizado e como o usuario navega pela aplicacao.

O front fica na pasta `web` e usa Nuxt 4, Vue 3, Vuetify, Tailwind CSS e icones do `lucide-vue-next`.

## 1. Arquitetura

Estrutura geral do projeto Nuxt, layouts, configuracao e convencoes visuais.

- [Arquitetura geral](architecture/overview.md)
- [Layouts e navegacao](architecture/layouts-navigation.md)

## 2. Telas

Fluxos principais acessados pelo usuario.

- [Paginas e rotas](screens/pages-routes.md)
- [Fluxo do usuario](screens/user-flow.md)

## 3. Componentes

Componentes reutilizaveis que montam dashboard, ministerios, escalas e administracao.

- [Mapa de componentes](components/component-map.md)

## 4. Estado e API

Estado compartilhado, autenticacao e pontos que ainda precisam ser conectados ao backend.

- [Estado, auth e integracao com API](state/api-auth.md)
- [Padrao de composables](state/composables.md)

## Observacoes atuais

- Grande parte do front ainda usa dados mockados em arrays locais.
- As telas de login e cadastro ainda nao chamam a API de verdade.
- Existem rotas usadas em atalhos que ainda nao possuem paginas correspondentes.
- Alguns textos aparecem com encoding quebrado, por exemplo `MinistÃ©rios`.
