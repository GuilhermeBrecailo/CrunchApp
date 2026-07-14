## ADDED Requirements

### Requirement: Usuário pode possuir vínculos com múltiplas igrejas
O sistema SHALL permitir que um único usuário autenticado possua memberships ativos em mais de uma igreja.

#### Scenario: Usuário entra em uma segunda igreja por convite
- **GIVEN** um usuário já possui vínculo ativo com uma igreja
- **WHEN** ele usa um código de convite válido de outra igreja
- **THEN** o sistema cria um novo membership para essa segunda igreja
- **AND** mantém o vínculo anterior ativo

#### Scenario: Convite da mesma igreja
- **GIVEN** um usuário já possui membership ativo na igreja do convite
- **WHEN** ele usa o código de convite da mesma igreja
- **THEN** o sistema não cria vínculo duplicado
- **AND** informa que o usuário já participa daquela igreja

### Requirement: Usuário escolhe a igreja ativa
O sistema SHALL permitir que usuários com múltiplos memberships alternem a igreja ativa usada nas telas internas.

#### Scenario: Alternar igreja ativa
- **GIVEN** o usuário possui memberships ativos em duas igrejas
- **WHEN** ele seleciona uma igreja no app
- **THEN** dashboard, escalas, ministérios, admin e conteúdos passam a usar a igreja selecionada

#### Scenario: Usuário com uma única igreja
- **GIVEN** o usuário possui apenas um membership ativo
- **WHEN** ele acessa o app
- **THEN** essa igreja é usada automaticamente como igreja ativa
- **AND** o seletor de igreja pode ficar oculto

### Requirement: Permissões são avaliadas por igreja
O sistema SHALL avaliar role, cargo e permissões a partir do membership da igreja ativa.

#### Scenario: Role diferente por igreja
- **GIVEN** o usuário é admin em uma igreja e membro em outra
- **WHEN** ele alterna para a igreja onde é membro
- **THEN** ações administrativas ficam indisponíveis

#### Scenario: Admin em igreja ativa
- **GIVEN** o usuário possui role admin no membership da igreja ativa
- **WHEN** acessa telas administrativas dessa igreja
- **THEN** ações administrativas permitidas para admin ficam disponíveis

### Requirement: Backend valida isolamento por membership
O sistema SHALL validar que `X-Church-Id` pertence a um membership ativo do usuário antes de executar qualquer ação em `/api/church/*`.

#### Scenario: Header com igreja não vinculada
- **GIVEN** o usuário não possui membership na igreja informada em `X-Church-Id`
- **WHEN** ele chama um endpoint de `/api/church/*`
- **THEN** o backend rejeita a requisição
- **AND** nenhum dado da igreja solicitada é retornado

#### Scenario: Header ausente durante transição
- **GIVEN** o usuário possui uma igreja primária
- **WHEN** ele chama um endpoint migrado sem `X-Church-Id`
- **THEN** o backend usa a igreja primária como fallback

### Requirement: Dados legados permanecem compatíveis durante a migração
O sistema SHALL manter compatibilidade com usuários existentes enquanto os endpoints são migrados para membership.

#### Scenario: Usuário existente com `crunchId`
- **GIVEN** um usuário existente possui `User.crunchId`
- **WHEN** a migration de membership é aplicada
- **THEN** o sistema cria um membership primário com a mesma igreja
- **AND** preserva o comportamento atual para usuários de uma única igreja
