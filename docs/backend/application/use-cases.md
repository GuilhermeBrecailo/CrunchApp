# Application: Use Cases

Os Casos de Uso (Use Cases) implementam as ações, tarefas ou fluxos que os usuários podem realizar no sistema, definindo o fluxo "passo-a-passo".

Eles coordenam as Entidades e os Repositórios do domínio. **Importante:** Regras puras de negócio relativas a uma única entidade NÃO devem estar aqui, e sim nas Entidades/Value Objects. Aqui fica o "fluxo do negócio".

*   **Responsabilidade:** Orquestração de entrada, processamento central da operação e persistência.
*   **Estrutura:** Divididos por módulos de domínio no projeto (ex: `Auth/`, `Crunch/`, `Departament/`, `User/`).
*   **Exemplos (na pasta `User/`):** 
    * `CreateUserUseCase.ts`: Chama e valida as entradas, instancia `User.create()`, pede para `IUserRepository` salvar.
    * `UpdateUserUseCase.ts`, `GetUserByIdUseCase.ts`.