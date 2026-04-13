import { Crunch } from "../../domain/entities/Crunch";

import { ICrunchRepository } from "../../domain/repositories/ICrunchRepository";

export class CrunchController implements ICrunchRepository {
  constructor(private CrunchRepository: ICrunchRepository) {}

  async createCrunch(crunch: Crunch): Promise<{ id: string }> {
    const result = await this.CrunchRepository.createCrunch(crunch);

    if (!result) {
      throw new Error("Erro ao criar garantia");
    }

    return result;
  }

  async deleteCrunch(id: string): Promise<void> {
    const result = await this.CrunchRepository.deleteCrunch(id);

    return result;
  }

  async getCrunchById(id: string): Promise<Crunch | null> {
    const result = await this.CrunchRepository.getCrunchById(id);

    if (!result) {
      throw new Error("Garantia não encontrada");
    }

    return result;
  }

  async getAllCrunchs(): Promise<Crunch[]> {
    return await this.CrunchRepository.getAllCrunchs();
  }

  async updateCrunch(crunch: Crunch): Promise<void> {
    const result = await this.CrunchRepository.updateCrunch(crunch);

    return result;
  }
}
