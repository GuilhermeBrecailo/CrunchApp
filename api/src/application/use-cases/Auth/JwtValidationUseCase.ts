import jwt, { JwtHeader, JwtPayload } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { DomainToken } from "../../../domain/value-objects/utils/DomainToken";

interface DecodedHeader {
  header: JwtHeader & { iss?: string };
  payload: JwtPayload & { iss?: string };
}

export interface JwtDecoded extends JwtPayload {
  iss: string;
  tenant_id?: string;
  is_admin?: boolean;
  sub: string;
  aud: string | string[];
  exp: number;
  iat: number;
  contractor: string;
  azp?: string;
  scope?: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: Record<string, { roles: string[] }>;
}

export class JwtValidationUseCase {
  private cache: Record<string, ReturnType<typeof jwksClient>> = {};
  private allowedAlgorithms: string[] = ["RS256"];
  private demoIssuer = "appquadrangular-demo";
  private demoAudience = "appquadrangular";

  constructor() {}

  public async execute(token: string): Promise<JwtDecoded> {
    if (!token) throw new DomainToken("Token inválido");

    const { header, payload } = this.decodeToken(token);
    if (this.isDemoToken(header, payload)) {
      return this.verifyDemoToken(token);
    }

    const client = this.getJwksClient(payload.iss!);
    const publicKey = await this.getPublicKey(client, header.kid!);

    try {
      const tokenDecode = jwt.verify(token, publicKey, {
        algorithms: this.allowedAlgorithms as jwt.Algorithm[],
      }) as JwtDecoded;

      return tokenDecode;
    } catch (err: unknown) {
      const { name } = err as unknown as { name: string };
      if (name === "TokenExpiredError") throw new DomainToken("Token expirado");
      throw new DomainToken("Token inválido");
    }
  }

  private decodeToken(token: string): DecodedHeader {
    const decoded = jwt.decode(token, { complete: true }) as DecodedHeader;

    if (!decoded || !decoded.payload.iss) {
      throw new DomainToken("Token inválido");
    }

    if (this.isDemoToken(decoded.header, decoded.payload)) {
      return decoded;
    }

    if (decoded.header.alg !== "RS256" || !decoded.header.kid) {
      throw new DomainToken("Token inválido");
    }

    return decoded;
  }

  private isDemoLoginEnabled() {
    return (
      process.env.DEMO_LOGIN_ENABLED === "true" ||
      process.env.NODE_ENV !== "production"
    );
  }

  private getDemoJwtSecret() {
    return (
      process.env.DEMO_JWT_SECRET ||
      process.env.KEYCLOAK_SECRET_KEY ||
      "appquadrangular-demo-local-secret"
    );
  }

  private isDemoToken(header: JwtHeader, payload: JwtPayload & { iss?: string }) {
    return (
      this.isDemoLoginEnabled() &&
      header.alg === "HS256" &&
      payload.iss === this.demoIssuer
    );
  }

  private verifyDemoToken(token: string): JwtDecoded {
    try {
      return jwt.verify(token, this.getDemoJwtSecret(), {
        algorithms: ["HS256"],
        issuer: this.demoIssuer,
        audience: this.demoAudience,
      }) as JwtDecoded;
    } catch {
      throw new DomainToken("Token inválido");
    }
  }

  private getJwksClient(issuer: string) {
    if (!this.cache[issuer]) {
      const jwksBaseUrl = this.getJwksBaseUrl(issuer);

      this.cache[issuer] = jwksClient({
        jwksUri: `${jwksBaseUrl}/protocol/openid-connect/certs`,
        cache: true,
        cacheMaxEntries: 5,
        cacheMaxAge: 3600_000, // 1h
      });
    }
    return this.cache[issuer];
  }

  private getJwksBaseUrl(issuer: string) {
    const keycloakBaseUrl = process.env.KEYCLOAK_ENDPOINT_BASE;

    if (!keycloakBaseUrl) return issuer;

    try {
      const issuerUrl = new URL(issuer);

      if (!["localhost", "127.0.0.1"].includes(issuerUrl.hostname)) {
        return issuer;
      }

      const internalUrl = new URL(keycloakBaseUrl);
      internalUrl.pathname = issuerUrl.pathname;
      internalUrl.search = "";
      internalUrl.hash = "";

      return internalUrl.toString().replace(/\/$/, "");
    } catch {
      return issuer;
    }
  }

  private async getPublicKey(
    client: ReturnType<typeof jwksClient>,
    kid: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      client.getSigningKey(kid, (err, key) => {
        if (err || !key) return reject(err || new DomainToken("key_not_found"));
        resolve(key.getPublicKey());
      });
    });
  }
}
