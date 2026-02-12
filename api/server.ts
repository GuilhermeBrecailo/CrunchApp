// src/server.ts
import Fastify from "fastify";
import cors from "@fastify/cors";

const app = Fastify({
  logger: true, // Loga tudo que acontece, ótimo para debug
});

// Registrar plugins
app.register(cors, {
  origin: true, // Em prod, troque pelo domínio do seu front
});

// Registrar rotas (Aqui conectamos com a camada de Application/Domain)
// app.register(escalaRoutes, { prefix: "/escalas" });

const start = async () => {
  try {
    await app.listen({ port: 3333 });
    console.log("🔥 Servidor rodando na porta 3333");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
