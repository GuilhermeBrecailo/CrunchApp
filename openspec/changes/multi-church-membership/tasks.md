## 1. Backend — Schema e Migration

- [x] 1.1 Adicionar model `ChurchMembership` ao schema Prisma com relações para `User`, `Crunch` e `ChurchRole`
- [x] 1.2 Adicionar relações `memberships` em `User`, `Crunch` e `ChurchRole`
- [x] 1.3 Criar migration para a nova tabela
- [x] 1.4 Criar script/migration de backfill: para cada `User.crunchId`, criar membership com `role`, `churchRoleId`, `canManageMembers` e `isPrimary: true`
- [x] 1.5 Manter campos legados `User.crunchId`, `User.role` e `User.churchRoleId` durante a fase de transição

## 2. Backend — Contexto Ativo e Segurança

- [x] 2.1 Criar helper para resolver igreja ativa a partir de `X-Church-Id` ou membership primária
- [x] 2.2 O helper deve validar que o usuário possui `ChurchMembership` ativa naquela igreja
- [x] 2.3 O helper deve retornar `activeChurchId`, `membership.role`, `membership.churchRole` e permissões efetivas
- [x] 2.4 Substituir checagens administrativas baseadas em `user.role` por membership nos endpoints migrados

## 3. Backend — Auth, Me, Igreja e Convite

- [x] 3.1 Atualizar `GET /api/me` para retornar `memberships[]` e `activeChurch`
- [x] 3.2 Atualizar criação de igreja para criar membership primária do pastor titular
- [x] 3.3 Atualizar join por convite para criar membership adicional quando o usuário já possui outra igreja
- [x] 3.4 Garantir que usuário já vinculado à igreja do convite não cria duplicidade

## 4. Backend — Endpoints de Igreja

- [x] 4.1 Migrar endpoints de membros/admin para usar igreja ativa validada
- [x] 4.2 Migrar endpoints de ministérios e escalas para usar igreja ativa validada
- [ ] 4.3 Migrar endpoints de conteúdo da igreja, notificações, relatórios, cargos e configurações para usar igreja ativa validada
- [ ] 4.4 Revisar queries que usam `user.crunchId!` e substituir por `activeChurchId`

## 5. Frontend — Estado e API

- [x] 5.1 Atualizar `AuthUser` em `useAuth.ts` com `memberships[]`, `activeChurchId` e `activeChurch`
- [x] 5.2 Persistir a igreja ativa em cookie/localStorage por usuário
- [x] 5.3 Atualizar `customFetch` para enviar `X-Church-Id` em chamadas autenticadas quando existir igreja ativa
- [x] 5.4 Atualizar middleware para considerar usuário com pelo menos um membership como `hasChurch`

## 6. Frontend — Seleção de Igreja

- [x] 6.1 Adicionar seletor de igreja no AppBar ou perfil quando houver mais de um membership ativo
- [x] 6.2 Ao trocar igreja, atualizar contexto ativo, recarregar `/api/me` e limpar estados dependentes de igreja
- [x] 6.3 Exibir role/cargo conforme a igreja ativa
- [ ] 6.4 Garantir que dashboard, escalas, ministérios, admin e perfil reflitam a igreja ativa

## 7. Testes e Validação

- [ ] 7.1 Testar usuário com uma única igreja para garantir compatibilidade
- [ ] 7.2 Testar usuário com duas igrejas alternando contexto
- [ ] 7.3 Testar que membro de uma igreja não acessa dados de outra via `X-Church-Id`
- [ ] 7.4 Testar roles diferentes por igreja
- [ ] 7.5 Rodar validações backend/frontend aplicáveis
