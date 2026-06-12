## 1. Avatar Dinâmico no AppBar

- [ ] 1.1 Em `web/app/components/layouts/appBar/index.vue`, criar computed `userInitials` que extrai as iniciais do `user.value.name` (primeira + última parte, max 2 letras, fallback `"U"`)
- [ ] 1.2 Substituir o texto hardcoded `"GB"` no template pelo `{{ userInitials }}`

## 2. Gradiente no Fundo do Login

- [ ] 2.1 Em `web/app/pages/login.vue`, atualizar o background da `.auth-page` no `<style scoped>` de `#f8fafc` sólido para `linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)`
- [ ] 2.2 Adicionar override no dark mode: dentro do seletor `:global(.app-theme-dark) .auth-page`, usar `background: var(--app-color-background)` para não sobrepor o gradiente claro no tema escuro

## 3. Ícones nos Cards de Stats (Escalas)

- [ ] 3.1 Em `web/app/pages/scale.vue`, importar os ícones `Clock`, `EyeOff` e `Repeat2` do `lucide-vue-next` (adicionar ao import existente de lucide)
- [ ] 3.2 Atualizar o template dos `.leader-summary-card` para incluir o ícone Lucide acima do número: `Clock` em "Pendentes", `EyeOff` em "Não viram", `Repeat2` em "Trocas"
- [ ] 3.3 Estilizar os ícones nos cards com cor `#A855F7` (accent) e tamanho `20px`

## 4. CTA no Empty State do NextScheduleCard

- [ ] 4.1 Em `web/app/components/Dashboard/NextScheduleCard/index.vue`, adicionar um `<NuxtLink to="/scale">` com botão Vuetify (`v-btn`) dentro do card de empty state ("Nenhuma escala cadastrada")
- [ ] 4.2 Estilizar o botão com `color="purple-darken-3"`, `variant="tonal"`, `size="small"` e label "Ver escalas"

## 5. Documentação do Padrão de Design Tokens (próximos passos)

- [ ] 5.1 Ao criar novos componentes com cor de accent em CSS customizado, usar sempre `var(--app-color-accent)` em vez de hex inline — conforme spec `ui-design-tokens`
- [ ] 5.2 Em um change futuro dedicado, varrer o codebase e migrar os usos de `#A855F7` e `#6d28d9` em `<style scoped>` para `var(--app-color-accent)` onde não há restrição de props Vuetify
