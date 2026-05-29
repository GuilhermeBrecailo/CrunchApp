import KcAdminClient from "@keycloak/keycloak-admin-client";

const keycloakBaseUrl = process.env.KEYCLOAK_BASE_URL || "http://localhost:8080";
const keycloakRealm = process.env.KEYCLOAK_REALM || "app";
const keycloakAdminRealm = process.env.KEYCLOAK_ADMIN_REALM || "master";
const keycloakGrantType = process.env.KEYCLOAK_GRANT_TYPE || "password";

export const kcAdminClient = new KcAdminClient({
  baseUrl: keycloakBaseUrl,
  realmName: keycloakAdminRealm,
});

export async function authenticateKeycloakAdmin() {
  kcAdminClient.setConfig({
    realmName: keycloakAdminRealm,
  });

  if (keycloakGrantType === "client_credentials") {
    await kcAdminClient.auth({
      grantType: "client_credentials",
      clientId: "admin-cli",
      clientSecret: process.env.KEYCLOAK_SECRET_KEY,
    });
  } else {
    await kcAdminClient.auth({
      grantType: "password",
      clientId: "admin-cli",
      username: process.env.KEYCLOAK_USER || "admin",
      password: process.env.KEYCLOAK_PASSWORD || "admin",
    });
  }

  kcAdminClient.setConfig({
    realmName: keycloakRealm,
  });
}
