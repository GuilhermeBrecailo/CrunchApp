import { $prismaClient } from "../../../config/database";
import { DomainError } from "../../domain/value-objects/utils/DomainError";
import { Department } from "../../domain/entities/Departament"; // Mantenha o seu caminho
import { IDepartamentRepository } from "../../domain/repositories/IDepartamentRepository";

export class DepartmentRepository implements IDepartamentRepository {
  public async createDepartment(
    department: Department,
  ): Promise<{ id: string }> {
    try {
      const result = await $prismaClient.department.create({
        data: {
          id: department.id,
          name: department.name,
          leaderId: department.leaderId,
          isActive: department.isActive,
          crunchId: department.crunchId,
        },
      });

      if (!result) {
        throw new DomainError("Falha ao tentar salvar o departamento");
      }

      return { id: result.id };
    } catch (error) {
      console.error("Falha ao tentar criar um departamento", error);
      throw error;
    }
  }

  public async updateDepartment(department: Department): Promise<void> {
    try {
      const result = await $prismaClient.department.update({
        where: {
          id: department.id,
        },
        data: {
          name: department.name,
          leaderId: department.leaderId,
          isActive: department.isActive,
          crunchId: department.crunchId,
        },
      });

      if (!result) {
        throw new DomainError(
          "Algo deu errado ao tentar atualizar o departamento",
        );
      }
    } catch (error) {
      console.error("Falha ao tentar atualizar o departamento: ", error);
      throw new DomainError("Falha ao tentar atualizar o departamento");
    }
  }

  public async deleteDepartment(id: string): Promise<void> {
    try {
      const result = await $prismaClient.department.delete({
        where: { id: id },
      });

      if (!result) {
        throw new DomainError("Algo deu errado ao deletar o departamento");
      }
    } catch (error) {
      console.error("Falha ao deletar departamento", error);
      throw new DomainError("Falha ao deletar departamento");
    }
  }

  public async getDepartmentById(id: string): Promise<Department | null> {
    try {
      const result = await $prismaClient.department.findUnique({
        where: { id: id },
      });

      if (!result) {
        return null;
      }

      return new Department({
        id: result.id,
        name: result.name,
        leaderId: result.leaderId,
        isActive: result.isActive,
        crunchId: result.crunchId,
      });
    } catch (error) {
      console.error("Falha ao tentar buscar departamento por ID", error);
      throw new DomainError("Falha ao tentar buscar departamento");
    }
  }

  public async getDepartmentsByCrunchId(
    crunchId: string,
  ): Promise<Department[]> {
    try {
      const results = await $prismaClient.department.findMany({
        where: { crunchId: crunchId },
        orderBy: { name: "asc" },
      });

      return results.map(
        (result) =>
          new Department({
            id: result.id,
            name: result.name,
            leaderId: result.leaderId,
            isActive: result.isActive,
            crunchId: result.crunchId,
          }),
      );
    } catch (error) {
      console.error("Falha ao buscar departamentos da igreja", error);
      throw new DomainError("Falha ao buscar departamentos da igreja");
    }
  }

  public async getAllDepartments(): Promise<Department[]> {
    try {
      const results = await $prismaClient.department.findMany({
        orderBy: { name: "asc" },
      });

      return results.map(
        (result) =>
          new Department({
            id: result.id,
            name: result.name,
            leaderId: result.leaderId,
            isActive: result.isActive,
            crunchId: result.crunchId,
          }),
      );
    } catch (error) {
      console.error("Falha ao buscar todos os departamentos", error);
      throw new DomainError("Erro ao listar departamentos");
    }
  }
}
