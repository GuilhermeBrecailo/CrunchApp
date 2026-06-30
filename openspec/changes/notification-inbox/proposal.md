## Why

Notificações push chegam ao celular do membro mas não há onde revisá-las depois — quem não viu na hora perde o aviso para sempre. O model `AppNotification` já existe no banco com todos os campos necessários; falta a UI e os endpoints de leitura.

## What Changes

- Nova página `/notifications` listando todas as notificações do usuário em ordem decrescente, com distinção visual entre lidas e não lidas.
- Badge com contagem de não lidas no ícone de sino no AppBar.
- Ação de marcar notificação individual como lida ao clicar.
- Ação de marcar todas como lidas de uma vez.
- Ao clicar em uma notificação com `url`, navega para a página referenciada.

## Capabilities

### New Capabilities

- `notification-inbox`: Listagem, leitura e marcação de notificações recebidas pelo membro.

### Modified Capabilities

<!-- Nenhuma spec existente com mudança de requisitos -->

## Impact

- **Backend**: Verificar endpoints existentes em `NotificationRoutes.ts` e `notificationAdapters.ts`; adicionar `PATCH /api/church/notifications/:id/read` e `PATCH /api/church/notifications/read-all`; garantir que `GET /api/church/notifications` retorna `readAt` e campos necessários.
- **Frontend (web)**: Composable `useNotifications.ts`; página `pages/notifications.vue`; badge no `components/layouts/appBar/index.vue`; link de sino na navegação.
- **Banco de dados**: Sem migration — model `AppNotification` já existe.
