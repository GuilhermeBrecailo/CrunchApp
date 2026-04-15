import { Department } from "../entities/Departament"; // Ajuste o caminho se necessário

export interface IDepartmentRepository {
  createDepartment(department: Department): Promise<{ id: string }>;
  updateDepartment(department: Department): Promise<void>;
  deleteDepartment(id: string): Promise<void>;
  getDepartmentById(id: string): Promise<Department | null>;

  getDepartmentsByCrunchId(crunchId: string): Promise<Department[]>;

  getAllDepartments(): Promise<Department[]>;
}
