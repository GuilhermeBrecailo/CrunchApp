import { UpdateCrunchService } from "../../application/Services/User/UpdateCrunchService";
import { CreateCrunchUseCase } from "../../application/use-cases/Crunch/CreateCrunchUseCase";
import { DeleteCrunchUseCase } from "../../application/use-cases/Crunch/DeleteCrunchUseCase";
import { GetAllCrunchUseCase } from "../../application/use-cases/Crunch/GetAllCrunchUseCase";
import { GetCrunchByIdUseCase } from "../../application/use-cases/Crunch/GetCrunchByIdUseCase";
import { UpdateCrunchUseCase } from "../../application/use-cases/Crunch/UpdateCrunchUseCase";
import { CrunchRepository } from "../../infrastructure/repositories/CrunchRepository";
import { FastifyRequest } from "fastify/types/request";

// Adicione os imports da sua Entidade e DTO referentes ao Crunch
import { Crunch, CrunchDTO } from "../../domain/entities/Crunch";
import { JwtDecoded } from "../../application/use-cases/Auth/JwtValidationUseCase";

const crunchRepository = new CrunchRepository();
const createCrunchUseCase = new CreateCrunchUseCase(crunchRepository);
const deleteCrunchUseCase = new DeleteCrunchUseCase(crunchRepository);
const getCrunchByIdUseCase = new GetCrunchByIdUseCase(crunchRepository);
const getAllCrunchUseCase = new GetAllCrunchUseCase(crunchRepository);
const updateCrunchUseCase = new UpdateCrunchUseCase(crunchRepository);

const updateCrunchService = new UpdateCrunchService(
  getCrunchByIdUseCase,
  updateCrunchUseCase,
);

export class CrunchAdapters {
  async createCrunch(request: FastifyRequest): Promise<{ id: string }> {
    const bodyData = request.body as Omit<CrunchDTO, "id" | "created_at">;

    const novoId = crypto.randomUUID();
    const props = {
      ...bodyData,
      id: novoId,
    };
    const crunchEntity = Crunch.create(props);

    return await createCrunchUseCase.execute(crunchEntity);
  }

  async deleteCrunch(request: FastifyRequest): Promise<void> {
    const { id } = request.body as { id: string };

    if (!id) {
      throw new Error(
        "O ID da Igreja (Crunch) não foi enviado no corpo da requisição",
      );
    }

    await deleteCrunchUseCase.execute(id);
  }

  async getAllCrunchs(): Promise<Crunch[]> {
    const crunchs = await getAllCrunchUseCase.execute();

    if (!crunchs) {
      throw new Error("Nenhum registro encontrado");
    }

    return crunchs;
  }

  async getCrunchById(request: FastifyRequest): Promise<Crunch | null> {
    const { id } = request.body as { id: string };

    if (!id) {
      throw new Error("O ID não foi enviado no corpo da requisição");
    }

    const crunch = await getCrunchByIdUseCase.execute(id);

    if (!crunch) {
      throw new Error("Registro não encontrado");
    }

    return crunch;
  }

  async updateCrunch(request: FastifyRequest): Promise<void> {
    const props = request.body as CrunchDTO;

    if (!props.id) {
      throw new Error("O ID é obrigatório para realizar a atualização.");
    }

    await updateCrunchService.handle(props);
  }
}
