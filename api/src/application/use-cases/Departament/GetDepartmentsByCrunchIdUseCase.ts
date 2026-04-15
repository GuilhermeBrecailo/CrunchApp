import { Department } from "../../../domain/entities/Departament";
import { IDepartmentRepository } from "../../../domain/repositories/IDepartamentRepositorya";

export class GetDepartmentsByCrunchIdUseCase {
  constructor(private repository: IDepartmentRepository) {}

  async execute(crunchId: string): Promise<Department[]> {
    const result = await this.repository.getDepartmentsByCrunchId(crunchId);
    return result;
  }
}
