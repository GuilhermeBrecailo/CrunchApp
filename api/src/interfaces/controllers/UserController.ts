import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { User, userSchema } from "../../domain/entities/User";
import { JwtDecoded } from "../../application/use-cases/Auth/JwtValidationUseCase";
import { DomainError } from "../../domain/value-objects/utils/DomainError";
import {
  authenticateKeycloakAdmin,
  kcAdminClient,
} from "../../infrastructure/keycloack";

// ==========================================
// SCHEMAS DE VALIDAÇÃO (Derivados do Domínio)
// ==========================================

// Para CRIAR: omitimos os IDs e Data, e adicionamos a senha que o Keycloak exige
const createUserRequestSchema = userSchema
  .omit({ id: true, createdAt: true, crunchId: true })
  .extend({ password: z.string().min(6, "Senha muito curta") });

// Para ATUALIZAR: exigimos o 'id', omitimos o resto que não deve ser alterado aqui
const updateUserRequestSchema = userSchema.omit({
  createdAt: true,
  crunchId: true,
});

// Validar ID na URL
const idParamSchema = z.object({
  id: z.string().min(1, "ID na URL é obrigatório"),
});

export class UserController {
  // POST /api/user
  async create(request: FastifyRequest, reply: FastifyReply) {
    const props = createUserRequestSchema.parse(request.body);
    const { tenant_id } = request.user as JwtDecoded;

    // Extrai o UseCase do container do Fastify (padrão igual ao seu AuthController)
    const { createUserUseCase } = request.server.app.user;

    // ==========================================
    // INTEGRAÇÃO COM KEYCLOAK
    // ==========================================
    await authenticateKeycloakAdmin();

    const existingUsers = await kcAdminClient.users.find({
      email: props.email,
    });
    if (existingUsers.length > 0) {
      throw new DomainError("Este email já está cadastrado no sistema.");
    }

    const keycloakUser = await kcAdminClient.users.create({
      username: props.email,
      email: props.email,
      firstName: props.name,
      enabled: true,
      credentials: [
        {
          type: "password",
          value: props.password,
          temporary: true,
        },
      ],
    });

    let keycloakId = keycloakUser.id;

    if (!keycloakId) {
      const userCreated = await kcAdminClient.users.find({
        email: props.email,
      });
      keycloakId = userCreated[0].id ?? "";
    }

    // ==========================================
    // CRIAÇÃO DA ENTIDADE E SALVAMENTO
    // ==========================================
    const userEntity = User.create({
      id: keycloakId,
      name: props.name,
      email: props.email,
      phone: props.phone,
      crunchId: tenant_id,
      role: props.role ?? "MEMBER",
    });

    const result = await createUserUseCase.execute(userEntity);
    return reply.status(201).send(result);
  }

  // DELETE /api/user/:id
  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = idParamSchema.parse(request.params);
    const { deleteUserUseCase } = request.server.app.user;

    await deleteUserUseCase.execute(id);
    return reply
      .status(200)
      .send({ success: true, message: "Usuário deletado com sucesso" });
  }

  // GET /api/user/:id
  async get(request: FastifyRequest, reply: FastifyReply) {
    const { id } = idParamSchema.parse(request.params);
    const { getUserByIdUseCase } = request.server.app.user;

    const user = await getUserByIdUseCase.execute(id);
    return reply.status(200).send(user);
  }

  // GET /api/user
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const { getAllUserUseCase } = request.server.app.user;

    // const { tenant_id } = request.user as JwtDecoded;
    const users = await getAllUserUseCase.execute();
    return reply.status(200).send(users);
  }

  // PUT /api/user
  async update(request: FastifyRequest, reply: FastifyReply) {
    const payload = updateUserRequestSchema.parse(request.body);
    const { updateUserService } = request.server.app.user;

    await updateUserService.handle(payload);
    return reply
      .status(200)
      .send({ success: true, message: "Usuário atualizado" });
  }
}
