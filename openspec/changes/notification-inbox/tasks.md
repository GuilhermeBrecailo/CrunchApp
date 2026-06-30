## 1. Backend — Verificação

- [x] 1.1 Confirmar que `GET /api/notifications` retorna `{ notifications, unreadCount }` com todos os campos necessários (já implementado em `notificationAdapters.ts`)
- [x] 1.2 Confirmar que `PATCH /api/notifications/:id/read` e `PATCH /api/notifications/read-all` estão registrados em `NotificationRoutes.ts` (já implementado)

## 2. Frontend — Composable

- [x] 2.1 Criar `web/composables/useNotifications.ts` com `notifications`, `unreadCount`, `fetchNotifications()`, `markRead(id)`, `markAllRead()` usando `$customFetch` e `authHeaders` seguindo padrão do projeto

## 3. Frontend — Página de Inbox

- [x] 3.1 Criar `web/app/pages/notifications.vue` com lista de notificações em ordem decrescente, distinção visual entre lidas (opacidade reduzida) e não lidas (destaque com cor de accent)
- [x] 3.2 Ao clicar em notificação: chamar `markRead(id)` e navegar para `notification.url` se presente via `navigateTo`
- [x] 3.3 Botão "Marcar todas como lidas" visível apenas quando `unreadCount > 0`
- [x] 3.4 Empty state com mensagem "Nenhuma notificação ainda" quando lista vazia
- [x] 3.5 Exibir data relativa (ex: "há 2 horas") para cada notificação

## 4. Frontend — Badge no AppBar

- [x] 4.1 Em `web/app/components/layouts/appBar/index.vue`, importar e chamar `useNotifications` para obter `unreadCount`
- [x] 4.2 Adicionar ícone de sino com `v-badge` do Vuetify mostrando `unreadCount`, sem badge quando zero
- [x] 4.3 Ícone de sino navega para `/notifications` ao clicar

## 5. Frontend — Navegação

- [x] 5.1 Adicionar `/notifications` na navegação inferior (bottom nav) ou garantir que seja acessível pelo sino do AppBar
