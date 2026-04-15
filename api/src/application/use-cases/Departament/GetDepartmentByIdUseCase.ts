import { Department } from "../../../domain/entities/Departament";
import { IDepartmentRepository } from "../../../domain/repositories/IDepartamentRepositorya";

export class GetDepartmentByIdUseCase {
  constructor(private repository: IDepartmentRepository) {}

  async execute(id: string): Promise<Department | null> {
    return await this.repository.getDepartmentById(id);
  }
}
