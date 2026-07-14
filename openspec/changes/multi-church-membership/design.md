## Context

O sistema usa `Crunch` como igreja/tenant e guarda o vínculo atual diretamente em `User.crunchId`. Papéis (`User.role`) e cargo (`User.churchRoleId`) também estão no usuário, então hoje eles são globais. Muitos adapters filtram dados por `user.crunchId!`, o que pressupõe uma única igreja ativa.

## Goals / Non-Goals

**Goals:**
- Permitir que um usuário participe de mais de uma igreja.
- Permitir papéis e cargos diferentes por igreja.
- Garantir isolamento de dados por igreja ativa.
- Manter compatibilidade incremental com os campos legados até migrar todos os endpoints.

**Non-Goals:**
- Unificar usuários duplicados já cadastrados com emails diferentes.
- Remover imediatamente `User.crunchId`, `User.role` e `User.churchRoleId`.
- Criar hierarquia entre igrejas.
- Compartilhar ministérios, escalas ou permissões automaticamente entre igrejas.

## Decisions

### 1. `ChurchMembership` como fonte de verdade do vínculo

Criar model dedicado com `userId`, `crunchId`, `role`, `churchRoleId`, `canManageMembers`, `isPrimary`, `isActive` e timestamps. A constraint `@@unique([userId, crunchId])` impede vínculo duplicado.

Campos legados em `User` continuam temporariamente para compatibilidade e rollback seguro.

### 2. Igreja ativa explícita por request

O frontend envia `X-Church-Id` nas chamadas autenticadas de `/api/church/*`. O backend nunca confia apenas no header: ele deve validar se o usuário autenticado possui `ChurchMembership` ativa para aquela igreja.

Quando o header não for enviado, o backend pode usar a igreja primária do usuário como fallback durante a fase de migração.

### 3. Roles e permissões por membership

Permissões administrativas devem usar `membership.role` e `membership.churchRole`, não `user.role`. Isso permite que uma pessoa seja membro em uma igreja e líder/admin em outra.

### 4. `/api/me` retorna memberships

`GET /api/me` passa a retornar:

- dados básicos do usuário;
- `memberships[]` com igreja, role, cargo e indicador de primária;
- `activeChurch` derivada do contexto escolhido ou da primária;
- campos legados preservados enquanto o frontend antigo ainda depender deles.

### 5. Convite cria vínculo adicional

Entrar por código de convite não deve falhar quando o usuário já pertence a outra igreja. Se o usuário ainda não possui membership naquela igreja, o sistema cria vínculo `MEMBER`. Se já possui, retorna o vínculo existente.

## Risks / Trade-offs

- [Risco de vazamento entre tenants] → Resolver contexto ativo em helper central e validar membership antes de qualquer query por igreja.
- [Mudança ampla em adapters] → Fazer em fases, mantendo fallback para `User.crunchId` até todos os endpoints críticos usarem contexto ativo.
- [Permissões inconsistentes durante migração] → Sincronizar membership inicial a partir dos campos legados e atualizar `/api/me` primeiro.
- [Frontend chamando sem contexto] → `customFetch` deve anexar `X-Church-Id` automaticamente quando houver igreja ativa.

## Migration Plan

1. Criar `ChurchMembership` e relações Prisma.
2. Popular memberships a partir de usuários com `crunchId`.
3. Atualizar criação de igreja para criar membership primária do pastor.
4. Atualizar `/api/me` para retornar memberships e activeChurch.
5. Atualizar `join` para criar vínculo adicional.
6. Adicionar helper backend para resolver `activeChurchId` + membership.
7. Migrar adapters `/api/church/*` gradualmente do `user.crunchId` para contexto ativo.
8. Atualizar frontend para selecionar e persistir igreja ativa.
9. Só depois remover campos legados de `User`, em uma change futura.
