## ADDED Requirements

### Requirement: Membro pode ver histórico de notificações
O sistema SHALL exibir em `/notifications` a lista de notificações do usuário autenticado em ordem decrescente de `createdAt`, distinguindo visualmente notificações lidas (`readAt != null`) de não lidas.

#### Scenario: Listar notificações
- **WHEN** o membro acessa `/notifications`
- **THEN** o sistema exibe até 30 notificações com título, corpo, data e status lida/não lida

#### Scenario: Estado vazio
- **WHEN** o membro não tem nenhuma notificação
- **THEN** o sistema exibe empty state com mensagem "Nenhuma notificação ainda"

### Requirement: Notificação é marcada como lida ao clicar
O sistema SHALL marcar uma notificação como lida via `PATCH /api/notifications/:id/read` quando o membro clicar nela, e navegar para `notification.url` se presente.

#### Scenario: Clicar em notificação com URL
- **WHEN** o membro clica em uma notificação que tem `url`
- **THEN** o sistema marca como lida e navega para a URL

#### Scenario: Clicar em notificação sem URL
- **WHEN** o membro clica em uma notificação sem `url`
- **THEN** o sistema apenas marca como lida

### Requirement: Membro pode marcar todas as notificações como lidas
O sistema SHALL oferecer ação "Marcar todas como lidas" que chama `PATCH /api/notifications/read-all`, visível apenas quando há notificações não lidas.

#### Scenario: Marcar todas como lidas
- **WHEN** o membro clica em "Marcar todas como lidas"
- **THEN** todas as notificações ficam com `readAt` preenchido e o badge some

### Requirement: Badge de não lidas no AppBar
O sistema SHALL exibir um badge numérico sobre o ícone de sino no AppBar com a contagem de notificações não lidas (`unreadCount`). O badge não deve aparecer quando `unreadCount === 0`.

#### Scenario: Badge com não lidas
- **WHEN** o membro tem notificações não lidas
- **THEN** o AppBar exibe o sino com badge mostrando o número de não lidas

#### Scenario: Badge ausente sem não lidas
- **WHEN** todas as notificações estão lidas
- **THEN** o sino é exibido sem badge
