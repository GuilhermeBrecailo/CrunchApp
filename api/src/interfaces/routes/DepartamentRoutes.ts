import { FastifyInstance } from "fastify";
import { controllerHandler } from "../controllers/Handler";
import { DepartmentAdapters } from "../adapters/departamentAdapters";

export async function DepartmentRoutes(app: FastifyInstance) {
  const adapters = new DepartmentAdapters();

  app.post(
    "/api/department/create",
    controllerHandler(adapters.createDepartment.bind(adapters)),
  );

  app.post(
    "/api/department/delete",
    controllerHandler(adapters.deleteDepartment.bind(adapters)),
  );

  app.post(
    "/api/department/getById",
    controllerHandler(adapters.getDepartmentById.bind(adapters)),
  );

  app.post(
    "/api/department/getByCrunchId",
    controllerHandler(adapters.getDepartmentsByCrunchId.bind(adapters)),
  );

  app.get(
    "/api/department/getAll",
    controllerHandler(adapters.getAllDepartments.bind(adapters)),
  );

  app.post(
    "/api/department/update",
    controllerHandler(adapters.updateDepartment.bind(adapters)),
  );
}
