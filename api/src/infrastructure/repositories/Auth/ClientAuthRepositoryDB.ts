import { Prisma } from "@prisma/client";
import { $prismaClient } from "../../../../config/database";
import { User } from "../../../domain/entities/User";
import { IClientDbRepository } from "../../../domain/repositories/Auth/IClientDbRepository";
import { DomainError } from "../../../domain/value-objects/utils/DomainError";

type ClientAuthData = {
  groupId: string;
  scopeId: string;
  clientId: string;
  secret: string;
};

type UserPersistence = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  crunchId: string | null;
  createdAt: Date;
};

export class ClientAuthRepositoryDB implements IClientDbRepository {
  async saveUser(user: User, auth?: ClientAuthData): Promise<void> {
    try {
      await $prismaClient.$transaction(async (tx) => {
        const createData: Prisma.UserCreateInput = {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        };

        if (user.crunchId) {
          createData.crunch = { connect: { id: user.crunchId } };
        }

        if (user.role) {
          createData.role = user.role;
        }

        await tx.user.create({
          data: createData,
        });

        if (auth) {
          await tx.userAuth.create({
            data: {
              groupId: auth.groupId,
              scopeId: auth.scopeId,
              clientId: auth.clientId,
              secret: auth.secret,
              UserId: user.id,
            },
          });
        }
      });
    } catch (error) {
      throw new DomainError(
        "Erro ao salvar usuario: " + (error as Error).message,
      );
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await $prismaClient.user.findUnique({
        where: { email },
      });

      return result ? this.restoreUser(result) : null;
    } catch (error) {
      throw new DomainError(
        "Erro ao buscar usuario por email: " + (error as Error).message,
      );
    }
  }

  async getAllUser(): Promise<User[]> {
    try {
      const results = await $prismaClient.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      return results.map((user) => this.restoreUser(user));
    } catch (error) {
      throw new DomainError(
        "Erro ao buscar usuarios: " + (error as Error).message,
      );
    }
  }

  async updateAuthUser(user: User): Promise<void> {
    try {
      const updateData: Prisma.UserUpdateInput = {
        name: user.name,
        email: user.email,
        phone: user.phone,
      };

      if (user.crunchId) {
        updateData.crunch = { connect: { id: user.crunchId } };
      }

      if (user.role) {
        updateData.role = user.role;
      }

      await $prismaClient.user.update({
        where: {
          id: user.id,
        },
        data: updateData,
      });
    } catch (error) {
      throw new DomainError(
        "Erro ao atualizar usuario autenticado: " + (error as Error).message,
      );
    }
  }

  async managerUser(data: User): Promise<{ id: string }> {
    await this.saveUser(data);

    return {
      id: data.id,
    };
  }

  private restoreUser(user: UserPersistence): User {
    return User.restore({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      crunchId: user.crunchId ?? undefined,
      role: user.role,
      createdAt: user.createdAt,
    });
  }
}
