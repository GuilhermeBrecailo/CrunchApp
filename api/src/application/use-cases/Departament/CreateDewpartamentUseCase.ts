import { Department } from "../../../domain/entities/Departament";
import { IDepartmentRepository } from "../../../domain/repositories/IDepartamentRepositorya";

export class CreateDepartmentUseCase {
  constructor(private repository: IDepartmentRepository) {}

  async execute(department: Department): Promise<{ id: string }> {
    const result = await this.repository.createDepartment(department);
    return result;
  }
}
