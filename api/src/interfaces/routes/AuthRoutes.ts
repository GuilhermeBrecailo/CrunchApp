import { FastifyInstance } from "fastify";
import { AuthAdapters } from "../adapters/authAdapters";
import { controllerHandler } from "../controllers/Handler";

export async function AuthRoutes(app: FastifyInstance) {
  const adapters = new AuthAdapters();

  app.post(
    "/public/auth/login",
    controllerHandler(adapters.login.bind(adapters)),
  );

  app.get(
    "/public/auth/refresh-token",
    controllerHandler(adapters.refreshToken.bind(adapters)),
  );

  app.get(
    "/public/auth/logout",
    controllerHandler(adapters.logout.bind(adapters)),
  );
}
