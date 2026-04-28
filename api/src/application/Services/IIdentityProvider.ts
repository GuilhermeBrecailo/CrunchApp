export interface IIdentityProvider {
  createUser(email: string, name: string, password?: string): Promise<string>;
  deleteUser(externalId: string): Promise<void>;
}
