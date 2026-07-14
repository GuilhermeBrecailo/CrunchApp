## Why

Hoje um usuário só pode estar vinculado a uma igreja por meio de `User.crunchId`. Isso impede que um membro ajude em duas igrejas, sirva em escalas diferentes ou tenha permissões distintas por igreja.

## What Changes

- Introduzir vínculo muitos-para-muitos entre usuário e igreja por meio de `ChurchMembership`.
- Manter a pessoa/login como um único `User`, mas mover vínculo, papel e cargo da igreja para o membership.
- Permitir que o usuário escolha uma igreja ativa no frontend.
- Validar todas as ações de `/api/church/*` contra a igreja ativa e o membership do usuário.
- Alterar convite/join para adicionar um novo vínculo de igreja em vez de bloquear usuários que já possuem igreja.

## Capabilities

### New Capabilities

- `multi-church-membership`: Usuário pode participar de múltiplas igrejas e alternar a igreja ativa no app.

### Modified Capabilities

- Contexto de autenticação passa a retornar `memberships` e `activeChurch`.
- Permissões de igreja passam a ser avaliadas por membership.
- Fluxo de convite passa a criar vínculo adicional quando o usuário já pertence a outra igreja.

## Impact

- **Backend**: Novo model Prisma `ChurchMembership`; migração dos dados atuais de `User.crunchId`; helpers/adapters para resolver igreja ativa; atualização de `/api/me`, join/invite, criação de igreja e endpoints `/api/church/*`.
- **Frontend (web)**: `useAuth` passa a guardar memberships e igreja ativa; `customFetch` envia contexto ativo; AppBar/perfil ganham seletor de igreja quando houver mais de um vínculo.
- **Banco de dados**: Migration adiciona `ChurchMembership`. Campos legados `User.crunchId`, `User.role` e `User.churchRoleId` devem ser mantidos temporariamente durante a transição.
