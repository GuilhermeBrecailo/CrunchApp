import { GetDepartmentByIdUseCase } from "../../use-cases/Departament/GetDepartmentByIdUseCase";
import { UpdateDepartmentUseCase } from "../../use-cases/Departament/UpdateDepartmentUseCase";

// Interface para as propriedades do Departamento
interface UpdateDepartmentProps {
  id: string;
  crunchId: string;
  name: string;
  leaderId: string;
  isActive: boolean;
}

export class UpdateDepartmentService {
  constructor(
    private getDepartmentByIdUseCase: GetDepartmentByIdUseCase,
    private updateDepartmentUseCase: UpdateDepartmentUseCase,
  ) {}

  async handle(props: UpdateDepartmentProps) {
    const department = await this.getDepartmentByIdUseCase.execute(props.id);

    if (!department || !department.id) {
      throw new Error(
        "Não existe nenhum Departamento (Ministério) com este ID",
      );
    }

    // 2. Atualiza os dados básicos
    department.name = props.name;
    department.leaderId = props.leaderId;
    department.crunchId = props.crunchId;
    department.isActive = props.isActive;

    await this.updateDepartmentUseCase.execute(department);
  }
}
