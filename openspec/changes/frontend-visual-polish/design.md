## Context

O AppQuadrangular é um PWA mobile-first construído com Nuxt 3 + Vuetify 3 + Tailwind CSS. O sistema de temas usa CSS custom properties em `theme.css` como fonte de verdade (`--app-color-accent`, `--app-color-background`, etc.), mas partes do código ainda usam valores inline (`#A855F7`, `#6d28d9`) ou classes Vuetify (`purple-darken-3`) para a mesma cor de accent — criando três representações da mesma decisão de design.

O AppBar (`web/app/components/layouts/appBar/index.vue`) exibe iniciais hardcoded `"GB"` no avatar do usuário. O composable `useAuth` já expõe `user.value.name`, então a correção é puramente de template. Não há state novo necessário.

## Goals / Non-Goals

**Goals:**
- Eliminar o avatar hardcoded — exibir iniciais calculadas a partir de `user.value.name`
- Adicionar gradiente sutil ao fundo do login sem alterar o layout ou estrutura do formulário
- Adicionar ícones Lucide aos 3 cards de stats na página de Escalas (visual only, sem lógica)
- Documentar o padrão de uso de `--app-color-accent` para novos componentes
- Adicionar botão CTA no empty state do NextScheduleCard

**Non-Goals:**
- Não refatorar todo o codebase para remover `purple-darken-3` — apenas documentar o padrão e corrigir os casos mais visíveis
- Não criar um design system formal ou Storybook
- Não alterar lógica de negócio, rotas ou APIs
- Não mexer em performance ou bundle size

## Decisions

### D1 — Iniciais do avatar: computed no template, sem componente separado

**Decisão:** Calcular as iniciais diretamente no `<script setup>` do AppBar com um `computed`, sem extrair para um componente `<UserAvatar>`.

**Rationale:** A lógica é trivial (split por espaço, pegar primeira letra de cada parte, max 2). Criar um componente novo para isso seria over-engineering para o tamanho atual do projeto. Se o avatar precisar de variantes (foto de perfil, fallback de cor), aí extrai.

**Alternativa descartada:** Componente `<UserAvatar>` reutilizável — descartado pois é usado em apenas um lugar agora.

### D2 — Gradiente do login: CSS scoped, sem tocar theme.css

**Decisão:** O gradiente é adicionado no `<style scoped>` de `login.vue`, sobrescrevendo o background da `.auth-page`. Não entra em `theme.css` pois é específico desta página.

**Rationale:** `theme.css` contém variáveis globais de tema (claro/escuro). Um gradiente de fundo de página de login não é um token de tema — é estilo de layout específico. Misturar os dois aumentaria acoplamento.

**Dark mode:** O gradiente usa `--app-color-accent` como referência de cor base para que o dark mode possa sobrescrever de forma coerente. No dark mode, o gradiente é simplificado para não criar contraste excessivo.

### D3 — Ícones nos stats: Lucide inline, sem wrapper

**Decisão:** Usar `<component :is="icon" />` com objetos de configuração (como já feito no QuickAccess), passando ícone + cor diretamente nos cards de stats.

**Rationale:** Padrão já estabelecido no projeto (`quickAccess/index.vue` usa a mesma abordagem). Consistência > originalidade.

### D4 — Padrão de cor accent: documentar, não refatorar tudo agora

**Decisão:** Criar a spec `ui-design-tokens` que documenta o padrão. Corrigir apenas os casos que tocamos nesta mudança. Refatoração ampla fica para um change futuro dedicado.

**Rationale:** Refatorar todos os `purple-darken-3` e `#A855F7` do codebase junto com outras mudanças aumenta o risco de regressão visual e torna o PR difícil de revisar. Melhor documentar o padrão correto agora e migrar incrementalmente.

### D5 — CTA no empty state: link para /scale

**Decisão:** O botão "Ver escalas" no empty state do NextScheduleCard navega para `/scale` usando `NuxtLink` (não `router.push`), pois é navegação declarativa sem lógica condicional.

## Risks / Trade-offs

- **Iniciais de nomes com caracteres especiais** (ç, ã, é): `split(" ")[0][0]` funciona corretamente com Unicode — sem risco.
- **Gradiente no dark mode**: O gradiente precisa ser testado no tema escuro para não criar fundo muito claro sobre dark. Mitigação: usar `opacity` baixa no gradiente ou fazer override no seletor `.app-theme-dark .auth-page`.
- **Refatoração parcial do accent color**: Deixar `purple-darken-3` em outros arquivos não tocados cria inconsistência temporária. Aceitável pois a spec documenta o estado alvo.

## Migration Plan

Sem migração de dados ou deploy especial. Todas as mudanças são CSS/template — hot reload funciona em dev. Em prod, basta rebuild normal do Nuxt.

Rollback: revert do commit. Nenhuma feature flag necessária.
