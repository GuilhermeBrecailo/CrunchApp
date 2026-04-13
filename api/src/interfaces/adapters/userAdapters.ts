import { UpdateUserService } from "../../application/Services/User/UpdateUserService";
import { CreateUserUseCase } from "../../application/use-cases/User/CreateUserUseCase";
import { DeleteUserUseCase } from "../../application/use-cases/User/DeleteUserUseCase";
import { GetAllUserUseCase } from "../../application/use-cases/User/GetAllUserUseCase";
import { GetUserByIdUseCase } from "../../application/use-cases/User/GetUserByIdUseCase";
import { UpdateUserUseCase } from "../../application/use-cases/User/UpdateUserUseCase";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { FastifyRequest } from "fastify/types/request";
import crypto from "node:crypto";
import { User, UserDTO } from "../../domain/entities/User";
import { JwtDecoded } from "../../application/use-cases/Auth/JwtValidationUseCase";

const userRepository = new UserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const getAllUserUseCase = new GetAllUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);

const updateUserService = new UpdateUserService(
  getUserByIdUseCase,
  updateUserUseCase,
);

export class UserAdapters {
  async createUser(request: FastifyRequest): Promise<{ id: string }> {
    const bodyData = request.body as Omit<UserDTO, "id" | "created_at">;

    const novoId = crypto.randomUUID();

    const props = {
      ...bodyData,
      id: novoId,
    };

    const userEntity = User.create(props);

    return await createUserUseCase.execute(userEntity);
  }

  async deleteUser(request: FastifyRequest): Promise<void> {
    const { id } = request.body as { id: string };

    if (!id) {
      throw new Error("O ID do usuário não foi enviado no corpo da requisição");
    }

    await deleteUserUseCase.execute(id);
  }

  async getAllUsers(): Promise<User[]> {
    const users = await getAllUserUseCase.execute();

    if (!users) {
      throw new Error("Nenhum usuário encontrado");
    }

    return users;
  }

  async getUserById(request: FastifyRequest): Promise<User> {
    const { id } = request.body as { id: string };

    if (!id) {
      throw new Error("O ID do usuário não foi enviado no corpo da requisição");
    }

    const user = await getUserByIdUseCase.execute(id);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user;
  }

  async updateUser(request: FastifyRequest): Promise<void> {
    const props = request.body as UserDTO;

    if (!props.id) {
      throw new Error("O ID do usuário é obrigatório para atualização.");
    }

    await updateUserService.handle(props);
  }
}
