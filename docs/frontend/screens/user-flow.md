# Frontend: Fluxo do Usuario

Este documento descreve o fluxo esperado da experiencia, considerando a estrutura atual do front.

## Fluxo publico

1. Usuario acessa `/login`.
2. Caso nao tenha conta, navega para `/register`.
3. Apos login/cadastro bem-sucedido, o fluxo esperado seria levar o usuario para `/`.

Estado atual:

- login e cadastro ainda nao fazem chamada real para API;
- nao existe redirecionamento automatico apos autenticar;
- nao ha guarda de rota para impedir acesso a telas internas sem login.

## Fluxo principal logado

1. Usuario entra no dashboard `/`.
2. Visualiza sua proxima escala.
3. Consulta atalhos rapidos.
4. Consulta proximos cultos/eventos.
5. Usa a bottom navigation para alternar entre Inicio, Escalas, Ministerios, Usuario e Admin.

## Fluxo de escalas

1. Usuario entra em `/scale`.
2. Filtra escalas por ministerio.
3. Visualiza cards de eventos.
4. Cada card mostra data, hora e voluntarios.

Estado atual:

- nao ha tela de detalhe de escala;
- botao de adicionar voluntario ainda nao executa acao;
- criacao de escala ainda nao esta conectada.

## Fluxo de ministerios

1. Usuario entra em `/ministery`.
2. Visualiza lista de ministerios.
3. Clica em um ministerio.
4. Vai para `/ministery/[id]`.
5. Alterna entre abas de Escalas, Musicas e Tarefas.
6. Abre modais para criar itens.

Estado atual:

- lista e detalhe usam mocks;
- modais ainda nao persistem dados;
- nomes dos componentes de modal precisam ser revisados para bater com a acao esperada.

## Fluxo de perfil

1. Usuario entra em `/user`.
2. Atualiza ministerio, funcao, indisponibilidades, sugestao e telefone.
3. Clica em salvar.

Estado atual:

- o salvar apenas exibe `alert`;
- nao ha integracao com endpoint de usuario;
- dados do usuario nao vem de auth/session.

## Fluxo administrativo

1. Usuario entra em `/admin`.
2. Consulta estatisticas da igreja.
3. Visualiza membros pendentes/aprovados.
4. Consulta ministerios.

Estado atual:

- tela nao valida permissao de admin;
- estatisticas sao fixas;
- acoes administrativas ainda nao estao conectadas.
