import { ICrunchRepository } from "../../domain/repositories/ICrunchRepository";
import { $prismaClient } from "../../../config/database";
import { DomainError } from "../../domain/value-objects/utils/DomainError";
import { Crunch } from "../../domain/entities/Crunch";
import { User } from "../../domain/entities/User";
import { Address } from "../../domain/value-objects/Address";
import { Document } from "../../domain/value-objects/Document";

import { Department } from "../../domain/entities/Departament";

export class CrunchRepository implements ICrunchRepository {
  public async createCrunch(crunch: Crunch): Promise<{ id: string }> {
    try {
      const crunchData = crunch as unknown as {
        name: string;
        id: string;
        slug: string;
        isActive: boolean;
        createdAt: Date;
      };

      if (!crunch.address) {
        throw new DomainError("Endereço do crunch é obrigatório");
      }

      const result = await $prismaClient.crunch.create({
        data: {
          id: crunchData.id,
          name: crunchData.name,
          city: crunch.address.getCity(),
          road: crunch.address.getRoad(),
          localZipCode: crunch.address.getLocalZipCode(),
          state: crunch.address.getState(),
          complement: crunch.address.getComplement(),
          number: crunch.address.getNumber(),
          logo: crunch.logo,
          userMainId: crunch.userMainId,
          document: crunch.document?.documento ?? "",
          isActive: crunchData.isActive,
        },
      });
      if (!result) {
        throw new DomainError("Falha ao tentar salvar um usuario");
      }

      return {
        id: result.id,
      };
    } catch (error) {
      console.log("Falha ao tentar criar um usuario", error);
      throw error;
    }
  }
  public async updateCrunch(crunch: Crunch): Promise<void> {
    try {
      const crunchData = crunch as unknown as {
        name: string;
        id: string;
        slug: string;
        isActive: boolean;
        createdAt: Date;
      };

      const result = await $prismaClient.crunch.update({
        where: {
          id: crunchData.id,
        },
        data: {
          name: crunchData.name,
          slug: crunchData.slug,
          isActive: crunchData.isActive,
        },
      });
      if (!result) {
        throw new DomainError("Algo deu errado ao tentar atualizar o usuario");
      }
    } catch (err) {
      console.log("Falha ao tentar atualizar o usuario: ", err);
      throw new DomainError("Falha ao tentar atualizar o usuario");
    }
  }
  public async deleteCrunch(id: string): Promise<void> {
    try {
      const result = await $prismaClient.crunch.delete({
        where: {
          id: id,
        },
      });
      if (!result) {
        throw new DomainError("Algo deu errado ao deletar o usuario");
      }
    } catch (err) {
      console.error("Falha ao deletar usuario", err);
      throw new DomainError("Falha ao deletar usuario");
    }
  }

  public async getCrunchById(id: string): Promise<Crunch> {
    try {
      const result = await $prismaClient.crunch.findUnique({
        where: {
          id: id,
        },
        include: {
          users: true,
          departments: true,
        },
      });
      if (!result) {
        throw new DomainError("Crunch não encontrado");
      }
      return result as unknown as Crunch;
    } catch (error) {
      console.error("Falha ao tentar buscar crunch", error);
      throw new DomainError("Falha ao tentar buscar crunch");
    }
  }
  public async getAllCrunchs() {
    try {
      const results = await $prismaClient.crunch.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          users: true,
          departments: true,
        },
      });

      return results.map((crunch) => {
        if (!crunch.id) {
          throw new DomainError("Crunch sem ID encontrado");
        }

        const users = crunch.users.map((user) =>
          User.restore({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone ?? "",
            createdAt: user.createdAt,
          }),
        );

        const address = Address.restore({
          city: crunch.city || "",
          road: crunch.road || "",
          number: crunch.number ?? "",
          localZipCode: crunch.localZipCode || "",
          state: crunch.state || "",
          complement: crunch.complement || undefined,
        });

        const document = new Document(crunch.document || "");

        const departments = crunch.departments.map(
          (dept) =>
            new Department({
              id: dept.id,
              name: dept.name,
              leaderId: dept.leaderId,
              isActive: dept.isActive,
              crunchId: dept.crunchId,
            }),
        );

        return Crunch.restore(
          {
            id: crunch.id,
            name: crunch.name,
            logo: crunch.logo ?? "",
            userMainId: crunch.userMainId ?? "",
            isActive: crunch.isActive,
            createdAt: crunch.createdAt,
          },
          users,
          address,
          document,
          departments,
        );
      });
    } catch (error) {
      throw new DomainError(
        "Erro ao buscar todos os crunchs: " + (error as Error).message,
      );
    }
  }
}
