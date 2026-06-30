import { FastifyInstance } from "fastify";
import { controllerHandler } from "../controllers/Handler";
import { ChurchInviteAdapters } from "../adapters/churchInviteAdapters";

export async function ChurchInviteRoutes(app: FastifyInstance) {
  const adapters = new ChurchInviteAdapters();

  app.get(
    "/api/church/invite-code",
    controllerHandler(adapters.getInviteCode.bind(adapters)),
  );

  app.post(
    "/api/church/invite-code/regenerate",
    controllerHandler(adapters.regenerateInviteCode.bind(adapters)),
  );

  app.post(
    "/api/church/join",
    controllerHandler(adapters.joinByCode.bind(adapters)),
  );
}
