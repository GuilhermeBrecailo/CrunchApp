import { Department } from "../../domain/entities/Departament"; // Ajuste o caminho se o arquivo se chamar Department.ts
import { IDepartamentRepository } from "../../domain/repositories/IDepartamentRepository";

export class DepartmentController implements IDepartamentRepository {
  constructor(private departmentRepository: IDepartamentRepository) {}

  async createDepartment(department: Department): Promise<{ id: string }> {
    const result = await this.departmentRepository.createDepartment(department);

    if (!result) {
      throw new Error("Erro ao criar departamento");
    }

    return result;
  }

  async deleteDepartment(id: string): Promise<void> {
    const result = await this.departmentRepository.deleteDepartment(id);

    return result;
  }

  async getDepartmentById(id: string): Promise<Department | null> {
    const result = await this.departmentRepository.getDepartmentById(id);

    if (!result) {
      throw new Error("Departamento não encontrado");
    }

    return result;
  }

  async getDepartmentsByCrunchId(crunchId: string): Promise<Department[]> {
    const results =
      await this.departmentRepository.getDepartmentsByCrunchId(crunchId);

    if (!results) {
      throw new Error("Erro ao buscar departamentos desta igreja");
    }

    return results;
  }

  async getAllDepartments(): Promise<Department[]> {
    return await this.departmentRepository.getAllDepartments();
  }

  async updateDepartment(department: Department): Promise<void> {
    const result = await this.departmentRepository.updateDepartment(department);

    return result;
  }
}
