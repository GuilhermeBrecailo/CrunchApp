import { IDepartmentRepository } from "../../../domain/repositories/IDepartament";

export class DeleteDepartmentUseCase {
  constructor(private repository: IDepartmentRepository) {}

  async execute(id: string): Promise<void> {
    const result = await this.repository.deleteDepartment(id);
    return result;
  }
}
