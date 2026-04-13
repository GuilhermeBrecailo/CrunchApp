import { Crunch } from "../../../domain/entities/Crunch";
import { ICrunchRepository } from "../../../domain/repositories/ICrunchRepository";

export class UpdateCrunchUseCase {
  constructor(private repository: ICrunchRepository) {}

  async execute(crunch: Crunch): Promise<void> {
    const result = await this.repository.updateCrunch(crunch);
    return result;
  }
}
