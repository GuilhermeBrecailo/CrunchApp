## Why

O AppChurch tem uma base visual sólida, mas acumulou inconsistências que degradam a percepção de qualidade: um avatar hardcoded que exibe iniciais erradas para todos os usuários, ausência de ícones em cards informativos, paleta roxa fragmentada em três formas diferentes no código, e empty states sem direcionamento. Essas falhas são visíveis no uso diário e prejudicam a confiança no produto.

## What Changes

- **Avatar dinâmico no AppBar**: As iniciais "GB" hardcoded são substituídas por iniciais computadas a partir do nome do usuário logado.
- **Gradiente no fundo do login**: O fundo chapado `#f8fafc` recebe um gradiente sutil indigo/purple para dar identidade visual à tela de entrada.
- **Ícones nos cards de stats (Escalas)**: Os cards "Pendentes", "Não viram" e "Trocas" recebem ícones Lucide para comunicar significado visualmente.
- **Unificação da cor roxa**: Todos os usos inline de `#A855F7`, `#6d28d9` e `purple-darken-3` como accent são migrados para `--app-color-accent` (onde aplicável com CSS) ou consolidados em uma única constante de design.
- **CTA no empty state do Dashboard**: O card "Nenhuma escala cadastrada" ganha um botão de ação que direciona o usuário para a página de escalas.

## Capabilities

### New Capabilities

- `ui-design-tokens`: Padrão de uso de design tokens (CSS variables) para cores de accent no frontend — define como e onde usar `--app-color-accent` vs classes Vuetify.
- `dynamic-avatar`: Componente/lógica de geração de iniciais dinâmicas a partir do nome do usuário.

### Modified Capabilities

Nenhuma capability existente com spec formal é alterada.

## Impact

- [web/app/components/layouts/appBar/index.vue](../../../../web/app/components/layouts/appBar/index.vue): geração de iniciais dinâmicas
- [web/app/pages/login.vue](../../../../web/app/pages/login.vue): background da `.auth-page`
- [web/app/pages/scale.vue](../../../../web/app/pages/scale.vue): ícones nos `.leader-summary-card`
- [web/app/assets/css/theme.css](../../../../web/app/assets/css/theme.css): nenhuma mudança direta, mas é a fonte de verdade das variáveis
- [web/app/components/Dashboard/NextScheduleCard/index.vue](../../../../web/app/components/Dashboard/NextScheduleCard/index.vue): CTA no empty state
