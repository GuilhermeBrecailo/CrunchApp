import { FastifyInstance } from "fastify";
import { controllerHandler } from "../controllers/Handler";
import { PrayerAdapters } from "../adapters/prayerAdapters";

export async function PrayerRoutes(app: FastifyInstance) {
  const adapters = new PrayerAdapters();

  app.get(
    "/api/church/prayer-requests",
    controllerHandler(adapters.listPrayerRequests.bind(adapters)),
  );

  app.post(
    "/api/church/prayer-requests",
    controllerHandler(adapters.createPrayerRequest.bind(adapters)),
  );

  app.patch(
    "/api/church/prayer-requests/:id/answered",
    controllerHandler(adapters.markAsAnswered.bind(adapters)),
  );
}
