## ADDED Requirements

### Requirement: Iniciais do avatar geradas a partir do nome do usuário

O AppBar SHALL exibir as iniciais do usuário logado no avatar, calculadas dinamicamente a partir de `user.value.name`. As iniciais hardcoded NÃO devem existir.

Regra de geração:
- Separar o nome por espaços, filtrar partes vazias
- Pegar a primeira letra de cada parte (maiúscula)
- Limitar a 2 letras (primeira e última parte com nome)
- Fallback: `"U"` (de Usuário) se o nome estiver vazio ou indisponível

#### Scenario: Usuário com nome completo

- **WHEN** `user.value.name` é `"Guilherme Brecailo"`
- **THEN** o avatar SHALL exibir `"GB"`

#### Scenario: Usuário com nome simples

- **WHEN** `user.value.name` é `"Maria"`
- **THEN** o avatar SHALL exibir `"M"`

#### Scenario: Usuário com nome composto de 3+ partes

- **WHEN** `user.value.name` é `"Ana Paula Silva"`
- **THEN** o avatar SHALL exibir `"AS"` (primeira + última parte)

#### Scenario: Usuário sem nome definido

- **WHEN** `user.value.name` é `null`, `undefined` ou string vazia
- **THEN** o avatar SHALL exibir `"U"` como fallback

### Requirement: Empty state do NextScheduleCard com CTA

Quando não há escala cadastrada, o NextScheduleCard SHALL exibir um botão de ação que direciona o usuário para a página de escalas, evitando dead ends na navegação.

#### Scenario: Usuário sem escalas no dashboard

- **WHEN** `schedule` prop é `null` ou `undefined`
- **THEN** o card SHALL exibir a mensagem "Nenhuma escala cadastrada"
- **THEN** o card SHALL exibir um botão "Ver escalas" que navega para `/scale`

#### Scenario: Usuário com escala cadastrada

- **WHEN** `schedule` prop contém dados válidos
- **THEN** o card NÃO SHALL exibir o botão CTA
- **THEN** o card SHALL exibir normalmente os dados da próxima escala

### Requirement: Cards de stats com ícones visuais

Os cards de resumo do líder na página de Escalas (Pendentes, Não viram, Trocas) SHALL exibir um ícone Lucide associado ao seu significado, melhorando a escaneabilidade visual.

#### Scenario: Card "Pendentes" exibindo ícone

- **WHEN** o usuário acessa a página de Escalas com permissão de líder
- **THEN** o card "Pendentes" SHALL exibir o ícone `Clock` (Lucide) acima do número

#### Scenario: Card "Não viram" exibindo ícone

- **WHEN** o usuário acessa a página de Escalas com permissão de líder
- **THEN** o card "Não viram" SHALL exibir o ícone `EyeOff` (Lucide) acima do número

#### Scenario: Card "Trocas" exibindo ícone

- **WHEN** o usuário acessa a página de Escalas com permissão de líder
- **THEN** o card "Trocas" SHALL exibir o ícone `Repeat2` (Lucide) acima do número
