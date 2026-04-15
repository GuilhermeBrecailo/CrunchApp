import { Department } from "../../../domain/entities/Departament";
import { IDepartmentRepository } from "../../../domain/repositories/IDepartamentRepositorya";

export class GetAllDepartmentsUseCase {
  constructor(private repository: IDepartmentRepository) {}

  async execute(): Promise<Department[]> {
    const result = await this.repository.getAllDepartments();
    return result;
  }
}
