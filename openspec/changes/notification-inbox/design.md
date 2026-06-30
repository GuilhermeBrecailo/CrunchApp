## Context

O backend de notificações está completamente implementado: `GET /api/notifications` retorna `{ notifications, unreadCount }`, `PATCH /api/notifications/:id/read` e `PATCH /api/notifications/read-all` já existem em `NotificationAdapters`. Nenhuma alteração de backend é necessária. A implementação é 100% frontend.

## Goals / Non-Goals

**Goals:**
- Página `/notifications` com lista de notificações lidas/não lidas
- Badge de não lidas no sino do AppBar
- Marcar como lida ao clicar (individual e todas)
- Navegação para URL da notificação quando presente

**Non-Goals:**
- Paginação além dos 30 itens já retornados pelo backend
- Filtros por tipo de notificação
- Deletar notificações

## Decisions

**Composable `useNotifications.ts`**: segue o padrão do projeto. Expõe `notifications`, `unreadCount`, `fetchNotifications`, `markRead`, `markAllRead`.

**Badge no AppBar**: usa `v-badge` do Vuetify sobre o ícone de sino. Atualiza ao montar o AppBar e após marcar como lida.

**Navegação ao clicar**: se `notification.url` existe, usa `navigateTo(url)` do Nuxt; caso contrário apenas marca como lida.

**Polling**: sem polling automático — o badge é atualizado na montagem da página e quando o usuário abre o inbox. Push notifications já cuidam do aviso em tempo real.

## Risks / Trade-offs

- [Badge desatualizado entre sessões] → Aceitável: o badge é carregado ao montar o AppBar e reflete o estado real do banco.
- [Limit de 30 notificações] → Suficiente para o volume atual; paginação pode ser adicionada depois.
