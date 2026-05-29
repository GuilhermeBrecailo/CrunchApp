import { fastify } from "fastify";
import cors from "@fastify/cors";
import { AuthRoutes } from "./src/interfaces/routes/AuthRoutes.ts";
import { UserRoutes } from "./src/interfaces/routes/UserRoutes.ts";
import { CrunchRoutes } from "./src/interfaces/routes/CrunchRoutes.ts";

const server = fastify({
  trustProxy: true,
});

await server.register(cors, {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

server.get("/status", async () => {
  return { success: true };
});

await server.register(AuthRoutes, { prefix: "/" });
await server.register(UserRoutes, { prefix: "/" });
await server.register(CrunchRoutes, { prefix: "/" });

await server.listen({ port: 8000, host: "0.0.0.0" });

console.log("🚀 Server running on http://localhost:8000");
