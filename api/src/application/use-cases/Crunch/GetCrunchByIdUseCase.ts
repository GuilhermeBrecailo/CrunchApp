import { ICrunchRepository } from "../../../domain/repositories/ICrunchRepository";
import { Crunch } from "../../../domain/entities/Crunch";

export class GetCrunchByIdUseCase {
  constructor(private repository: ICrunchRepository) {}

  async execute(id: string): Promise<Crunch | null> {
    return await this.repository.getCrunchById(id);
  }
}
