import { IIdentityProvider } from "../../application/Services/IIdentityProvider";
import { authenticateKeycloakAdmin, kcAdminClient } from "../keycloack";

// infrastructure/identity/KeycloakProvider.ts
export class KeycloakProvider implements IIdentityProvider {
  async createUser(
    email: string,
    name: string,
    password?: string,
  ): Promise<string> {
    await authenticateKeycloakAdmin();

    const [firstName, ...lastNameParts] = name.trim().split(/\s+/);

    const user = await kcAdminClient.users.create({
      username: email,
      email,
      firstName: firstName || name,
      lastName: lastNameParts.join(" ") || "Usuario",
      enabled: true,
      emailVerified: true,
      requiredActions: [],
      credentials: [
        {
          type: "password",
          value: password,
          temporary: false, // Pastor já define a senha final dele no cadastro
        },
      ],
    });

    return user.id!;
  }

  async deleteUser(externalId: string): Promise<void> {
    await authenticateKeycloakAdmin();
    await kcAdminClient.users.del({ id: externalId });
  }
}
