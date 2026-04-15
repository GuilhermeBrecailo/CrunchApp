import { Department } from "../../../domain/entities/Departament";
import { IDepartmentRepository } from "../../../domain/repositories/IDepartament";

export class UpdateDepartmentUseCase {
  constructor(private repository: IDepartmentRepository) {}

  async execute(department: Department): Promise<void> {
    const result = await this.repository.updateDepartment(department);
    return result;
  }
}
