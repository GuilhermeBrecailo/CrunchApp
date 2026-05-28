# Índice: Documentação do Backend

Esta documentação foi totalmente dividida pelas áreas vitais da API (`domain`, `application`, `infrastructure`, `interfaces`). O intuito é explicar especificamente a lógica e o preenchimento de cada pedaço independentemente.

Navegue pelos diretórios de contexto abaixo:

## 1. Domain (Regras de Domínio Puras)
Onde reside as lógicas núcleo do negócio.
- [Entidades (`entities`)](domain/entities.md)
- [Objetos de Valor (`value-objects`)](domain/value-objects.md)
- [Repositórios (`repositories`)](domain/repositories.md)

## 2. Application (Aplicação de Lógica)
Onde acontece a orquestração do comportamento geral.
- [Casos de Uso (`use-cases`)](application/use-cases.md)
- [Serviços Externos (`Services`)](application/services.md)

## 3. Infrastructure (Comunicação Técnica)
As interfaces concretas lidando com bibliotecas diretas (Prisma, Keycloak).
- [Banco de Dados (`database`)](infrastructure/database.md)
- [Persistência Local (`repositories`)](infrastructure/repositories.md)
- [Identidade Terceirizada (`identity`)](infrastructure/identity.md)

## 4. Interfaces (Apresentação Web)
Servidores Http recebendo respostas em pontas visíveis pelo Frontend.
- [Controladores (`controllers`)](interfaces/controllers.md)
- [Rotas HTTP (`routes`)](interfaces/routes.md)
- [Plugins/Adpatadores (`plugins-adapters`)](interfaces/plugins-adapters.md)