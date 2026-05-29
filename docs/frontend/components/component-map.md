# Frontend: Mapa de Componentes

Os componentes ficam em `web/app/components`.

## Layouts

### `layouts/main.vue`

Monta a casca da aplicacao logada:

- app bar;
- area principal;
- bottom navigation.

### `layouts/appBar/index.vue`

Cabecalho superior com usuario, igreja e notificacoes.

### `layouts/bottomNavigation/index.vue`

Menu inferior com as rotas principais.

## Dashboard

### `Dashboard/NextScheduleCard/index.vue`

Card de destaque com a proxima escala do usuario.

Estado atual:

- conteudo fixo;
- visual em gradiente roxo.

### `Dashboard/quickAccess/index.vue`

Atalhos horizontais para areas do app.

Estado atual:

- rotas configuradas como `/escalas`, `/musicas`, `/membros`, `/devocionais`;
- essas rotas ainda nao existem no projeto atual.

### `Dashboard/UpcomingEvents/index.vue`

Lista de proximos cultos/eventos.

Estado atual:

- eventos mockados;
- link `Ver todos` nao navega.

## Escalas

### `Scale/ScheduleSection.vue`

Agrupa cards de escala por categoria/ministerio.

### `Scale/ScheduleCard.vue`

Mostra um evento de escala com:

- titulo;
- data;
- horario;
- voluntarios;
- acao de adicionar voluntario.

Estado atual:

- acao de adicionar voluntario ainda nao executa fluxo real.

## Ministerios

### `Ministery/ListItem.vue`

Item clicavel usado na lista de ministerios.

### `Ministery/MusicCard/index.vue`

Card de musica com titulo, artista, tom, BPM e categoria.

### `Ministery/NewScaleModal.vue`

Modal para criar culto/evento de escala.

### `Ministery/NewMusicModal.vue`

Modal para criar musica.

### `Ministery/NewReferenceModal.vue`

Modal para criar tarefa/referencia.

Observacao:

- em `/ministery/[id]`, os nomes dos dialogs e componentes parecem estar cruzados. Vale revisar antes de integrar com a API.

## Admin

### `Admin/StatCard.vue`

Card generico para estatisticas.

### `Admin/MinisteryCard.vue`

Card usado para mostrar ministerios na tela de admin.

## Utils

### `utils/title.vue`

Wrapper simples para titulo de secao com slot de conteudo.
