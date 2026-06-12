## ADDED Requirements

### Requirement: Cor de accent unificada via CSS variable

O frontend SHALL usar `--app-color-accent` (definido em `theme.css`) como única fonte de verdade para a cor de accent (roxo/índigo) em componentes customizados. Valores inline como `#A855F7` ou `#6d28d9` NÃO devem ser introduzidos em novos componentes.

Para componentes Vuetify que exigem um prop `color` string (e.g., `v-btn color="..."`, `v-chip color="..."`), o padrão aceito é usar `color="purple-darken-3"` como fallback semântico, pois o Vuetify não resolve CSS variables nesses props.

#### Scenario: Novo componente com cor de accent em CSS customizado

- **WHEN** um desenvolvedor cria um novo componente com background ou color de accent em `<style scoped>`
- **THEN** o valor SHALL ser `var(--app-color-accent)` e não um hex inline

#### Scenario: Componente Vuetify com prop color

- **WHEN** um componente Vuetify recebe `color` como prop string
- **THEN** o valor DEVE ser `purple-darken-3` (padrão semântico Vuetify) ou `primary` se o tema Vuetify estiver configurado
- **THEN** o desenvolvedor NÃO deve criar uma nova variante de cor hex inline

#### Scenario: Dark mode com accent color

- **WHEN** o tema escuro está ativo (classe `.app-theme-dark` no html)
- **THEN** todos os elementos que usam `var(--app-color-accent)` SHALL exibir `#a7c7ff` (valor definido no seletor `.app-theme-dark` em `theme.css`) automaticamente sem override adicional

### Requirement: Gradiente de fundo em páginas públicas

Páginas públicas (login, register, forgot-password) SHALL ter um fundo com gradiente sutil que utilize a paleta de accent do app, conferindo identidade visual sem prejudicar legibilidade.

#### Scenario: Fundo do login no tema claro

- **WHEN** o usuário acessa `/login` com tema claro
- **THEN** o fundo SHALL exibir um gradiente de `#f0f4ff` para `#faf5ff` (diagonal de cima-esquerda para baixo-direita)
- **THEN** o card de formulário SHALL permanecer com fundo branco sólido para contraste

#### Scenario: Fundo do login no tema escuro

- **WHEN** o usuário acessa `/login` com tema escuro ativo
- **THEN** o fundo SHALL usar o valor de `--app-color-background` sem o gradiente claro sobreposto
