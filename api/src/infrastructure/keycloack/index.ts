import KcAdminClient from "@keycloak/keycloak-admin-client";

// Cria a instância do cliente
export const kcAdminClient = new KcAdminClient({
  baseUrl: "http://localhost:8080",
  realmName: "app", // O nome do Realm que você criou lá no painel
});

// Função auxiliar para garantir que a API está autenticada antes de fazer ações
export async function authenticateKeycloakAdmin() {
  await kcAdminClient.auth({
    grantType: "client_credentials", // Mudou o tipo de permissão
    clientId: "admin-cli",
    clientSecret: process.env.KEYCLOAK_SECRET_KEY, // A chave que você copiou!
  });

  kcAdminClient.setConfig({
    realmName: "app",
  });
}
