import { FastifyRequest } from "fastify";
import { User, UserDTO } from "../../domain/entities/User";
import { JwtDecoded } from "../../application/use-cases/Auth/JwtValidationUseCase";

import { UpdateUserService } from "../../application/Services/User/UpdateUserService";
import { CreateUserUseCase } from "../../application/use-cases/User/CreateUserUseCase";
import { DeleteUserUseCase } from "../../application/use-cases/User/DeleteUserUseCase";
import { GetUserByIdUseCase } from "../../application/use-cases/User/GetUserByIdUseCase";
import { GetAllUserUseCase } from "../../application/use-cases/User/GetAllUserUseCase";

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
    private getUserByIdUseCase: GetUserByIdUseCase,
    private getAllUserUseCase: GetAllUserUseCase,
    private updateUserService: UpdateUserService,
  ) {}

  async create(request: FastifyRequest): Promise<{ id: string }> {
    const { id } = (request as any).user as JwtDecoded;
    const { name, email, phone } = request.body as UserDTO;

    const userEntity = User.create({
      id,
      name,
      email,
      phone,
    });

    return await this.createUserUseCase.execute(userEntity);
  }

  async delete(request: FastifyRequest): Promise<{ success: boolean }> {
    const { id } = request.body as { id: string };

    await this.deleteUserUseCase.execute(id);

    return { success: true };
  }

  async get(request: FastifyRequest): Promise<User> {
    const { id } = request.body as { id: string };

    return await this.getUserByIdUseCase.execute(id);
  }

  async getAll(): Promise<User[]> {
    return await this.getAllUserUseCase.execute();
  }

  async update(request: FastifyRequest): Promise<void> {
    const { id, name, email, phone } = request.body as UserDTO;

    const payload = {
      id,
      name,
      email,
      phone,
    };

    await this.updateUserService.handle(payload);
  }
}
