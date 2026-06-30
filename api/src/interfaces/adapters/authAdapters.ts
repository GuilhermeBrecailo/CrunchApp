import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { $prismaClient } from "../../../config/database";
import { DomainError } from "../../domain/value-objects/utils/DomainError";
import { DomainToken } from "../../domain/value-objects/utils/DomainToken";

const refreshCookieName = "refresh_token";
const demoIssuer = "appquadrangular-demo";
const demoAudience = "appquadrangular";
const demoEmail = "demo@appquadrangular.com";
const demoPassword = "demo1234";
const keycloakBaseUrl =
  process.env.KEYCLOAK_ENDPOINT_BASE ||
  process.env.KEYCLOAK_BASE_URL ||
  "http://localhost:8080";
const keycloakRealm = process.env.KEYCLOAK_REALM || "clientA";
const keycloakClientId = process.env.KEYCLOAK_CLIENT_USER_ID || keycloakRealm;

interface AuthToken {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  scope: string;
}

function readCookie(request: FastifyRequest, name: string) {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const cookie = cookies.find((item) => item.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
}

function refreshCookie(value: string, maxAge: number) {
  return `${refreshCookieName}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

function isDemoLoginEnabled() {
  return (
    process.env.DEMO_LOGIN_ENABLED === "true" ||
    process.env.NODE_ENV !== "production"
  );
}

function getDemoJwtSecret() {
  return (
    process.env.DEMO_JWT_SECRET ||
    process.env.KEYCLOAK_SECRET_KEY ||
    "appquadrangular-demo-local-secret"
  );
}

async function createDemoToken(email: string, password: string) {
  if (!isDemoLoginEnabled()) return null;

  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail !== demoEmail || password !== demoPassword) return null;

  const user = await $prismaClient.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      crunchId: true,
      isDemoUser: true,
    },
  });

  if (!user?.isDemoUser || !user.crunchId) return null;

  const payload = {
    sub: user.id,
    email: user.email,
    preferred_username: user.email,
    name: user.name,
    role: user.role,
    tenant_id: user.crunchId,
    is_admin: false,
  };

  const access_token = jwt.sign(payload, getDemoJwtSecret(), {
    algorithm: "HS256",
    issuer: demoIssuer,
    audience: demoAudience,
    expiresIn: "2h",
  });

  const refresh_token = jwt.sign(
    { sub: user.id, email: user.email, type: "demo_refresh" },
    getDemoJwtSecret(),
    {
      algorithm: "HS256",
      issuer: demoIssuer,
      audience: demoAudience,
      expiresIn: "7d",
    },
  );

  return {
    access_token,
    expires_in: 7200,
    refresh_expires_in: 604800,
    refresh_token,
    token_type: "Bearer",
    scope: "demo",
  } satisfies AuthToken;
}

async function refreshDemoToken(refreshToken: string) {
  if (!isDemoLoginEnabled()) return null;

  try {
    const decoded = jwt.verify(refreshToken, getDemoJwtSecret(), {
      algorithms: ["HS256"],
      issuer: demoIssuer,
      audience: demoAudience,
    }) as jwt.JwtPayload;

    if (decoded.type !== "demo_refresh" || !decoded.email) return null;

    return await createDemoToken(String(decoded.email), demoPassword);
  } catch {
    return null;
  }
}

async function requestKeycloakToken(params: URLSearchParams) {
  const response = await fetch(
    `${keycloakBaseUrl}/realms/${keycloakRealm}/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.access_token) {
    throw new DomainError("Verifique os dados e tente novamente");
  }

  return data as AuthToken;
}

export class AuthAdapters {
  async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as {
      email?: string;
      password?: string;
    };

    if (!email?.trim() || !password) {
      throw new DomainError("Email e senha são obrigatórios");
    }

    const demoToken = await createDemoToken(email, password);
    if (demoToken) {
      reply.header(
        "Set-Cookie",
        refreshCookie(demoToken.refresh_token, demoToken.refresh_expires_in),
      );

      return demoToken;
    }

    const params = new URLSearchParams();
    params.append("client_id", keycloakClientId);
    params.append("grant_type", "password");
    params.append("username", email.trim().toLowerCase());
    params.append("password", password);

    const token = await requestKeycloakToken(params);

    reply.header(
      "Set-Cookie",
      refreshCookie(token.refresh_token, token.refresh_expires_in),
    );

    return token;
  }

  async refreshToken(request: FastifyRequest, reply: FastifyReply) {
    const refreshToken = readCookie(request, refreshCookieName);

    if (!refreshToken) {
      throw new DomainToken("Refresh token não encontrado");
    }

    const demoToken = await refreshDemoToken(refreshToken);
    if (demoToken) {
      reply.header(
        "Set-Cookie",
        refreshCookie(demoToken.refresh_token, demoToken.refresh_expires_in),
      );

      return demoToken;
    }

    const params = new URLSearchParams();
    params.append("client_id", keycloakClientId);
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refreshToken);

    const token = await requestKeycloakToken(params).catch(() => {
      throw new DomainToken("Falha ao fazer Refresh token");
    });

    reply.header(
      "Set-Cookie",
      refreshCookie(token.refresh_token, token.refresh_expires_in),
    );

    return token;
  }

  async logout(_request: FastifyRequest, reply: FastifyReply) {
    reply.header(
      "Set-Cookie",
      `${refreshCookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    );

    return { success: true };
  }
}
