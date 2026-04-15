import { Department } from "../entities/Departament";

export interface IDepartamentRepository {
  createDepartment(department: Department): Promise<{ id: string }>;
  updateDepartment(department: Department): Promise<void>;
  deleteDepartment(id: string): Promise<void>;
  getAllDepartments(): Promise<Department[]>;
  getDepartmentById(id: string): Promise<Department | null>;
  getDepartmentsByCrunchId(crunchId: string): Promise<Department[]>;
}
