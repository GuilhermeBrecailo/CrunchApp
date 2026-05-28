# Domain: Repositories (Interfaces)

Define os contratos (interfaces) de como o sistema deve persistir e recuperar os dados do domínio. 

Isso cria a famosa "inversão de dependência": a camada de domínio dita *o que* precisa ser salvo e buscado, mas ignora completamente *como* isso será feito ou em qual banco de dados (MySQL, Mongo, Prisma, etc).

*   **Responsabilidade:** Ser um contrato estabelecido para manipular Entidades do banco de dados abstratamente.
*   **Exemplos no projeto:** `IUserRepository.ts`, `IDepartamentRepository.ts`, `ICrunchRepository.ts`.