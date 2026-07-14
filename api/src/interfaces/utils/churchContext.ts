import { FastifyRequest } from "fastify";
import { $prismaClient } from "../../../config/database";
import { DomainError } from "../../domain/value-objects/utils/DomainError";

export type ActiveChurchContext = {
  activeChurchId: string | null;
  role: string;
  canManageMembers: boolean;
  churchRole: {
    id: string;
    name: string;
    permissions: string[];
  } | null;
  permissions: string[];
  membershipId: string | null;
};

function getHeaderValue(request: FastifyRequest, name: string) {
  const value = request.headers[name.toLowerCase()];

  if (Array.isArray(value)) return value[0];
  return value;
}

export function getRequestedChurchId(request: FastifyRequest) {
  return (
    getHeaderValue(request, "x-church-id") ||
    getHeaderValue(request, "x-active-church-id") ||
    null
  );
}

export async function resolveActiveChurchContext(
  request: FastifyRequest,
  userId: string,
): Promise<ActiveChurchContext> {
  const requestedChurchId = getRequestedChurchId(request);
  const user = await $prismaClient.user.findUnique({
    where: { id: userId },
    include: {
      churchRole: { select: { id: true, name: true, permissions: true } },
      churchMemberships: {
        where: { isActive: true },
        orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
        include: {
          churchRole: { select: { id: true, name: true, permissions: true } },
          crunch: true,
        },
      },
    },
  });

  if (!user) {
    throw new DomainError("Usuário não encontrado");
  }

  const membership = requestedChurchId
    ? user.churchMemberships.find((item) => item.crunchId === requestedChurchId)
    : user.churchMemberships[0] ?? null;

  if (requestedChurchId && !membership) {
    throw new DomainError("Usuário não possui vínculo ativo com esta igreja");
  }

  if (membership) {
    const churchRole = membership.churchRole
      ? {
          id: membership.churchRole.id,
          name: membership.churchRole.name,
          permissions: membership.churchRole.permissions,
        }
      : null;

    return {
      activeChurchId: membership.crunchId,
      role: membership.role,
      canManageMembers: membership.canManageMembers,
      churchRole,
      permissions: churchRole?.permissions ?? [],
      membershipId: membership.id,
    };
  }

  if (user.crunchId) {
    const churchRole = user.churchRole
      ? {
          id: user.churchRole.id,
          name: user.churchRole.name,
          permissions: user.churchRole.permissions,
        }
      : null;

    return {
      activeChurchId: user.crunchId,
      role: user.role,
      canManageMembers: user.canManageMembers,
      churchRole,
      permissions: churchRole?.permissions ?? [],
      membershipId: null,
    };
  }

  return {
    activeChurchId: null,
    role: user.role,
    canManageMembers: user.canManageMembers,
    churchRole: null,
    permissions: [],
    membershipId: null,
  };
}
