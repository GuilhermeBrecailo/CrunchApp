import { FastifyRequest } from "fastify";
import crypto from "node:crypto";
import { $prismaClient } from "../../../config/database";
import { DomainError } from "../../domain/value-objects/utils/DomainError";

function getAuthPayload(request: FastifyRequest) {
  const token = request.headers.authorization?.replace("Bearer ", "");
  if (!token) throw new DomainError("Token não fornecido");
  const [, payload] = token.split(".");
  if (!payload) throw new DomainError("Token inválido");
  return JSON.parse(Buffer.from(payload, "base64url").toString()) as { sub?: string };
}

function generateCode(): string {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

export class ChurchInviteAdapters {
  private isManager(user: { role: string }) {
    return ["PASTOR", "ADMIN", "SUPER_ADMIN"].includes(user.role);
  }

  private assertManager(user: { role: string }) {
    if (!this.isManager(user)) throw new DomainError("Apenas pastores ou admins podem gerenciar convites");
  }

  private async generateUniqueCode() {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const inviteCode = generateCode();
      const existing = await $prismaClient.crunch.findUnique({ where: { inviteCode } });
      if (!existing) return inviteCode;
    }

    throw new DomainError("Não foi possível gerar um código único. Tente novamente.");
  }

  private async getCurrentUser(request: FastifyRequest) {
    const payload = getAuthPayload(request);
    if (!payload.sub) throw new DomainError("Token sem usuário");
    const user = await $prismaClient.user.findUnique({
      where: { id: payload.sub },
      include: { crunch: true },
    });
    if (!user) throw new DomainError("Usuário não encontrado");
    return user;
  }

  async getInviteCode(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    this.assertManager(user);
    if (!user.crunchId || !user.crunch) throw new DomainError("Usuário não possui igreja vinculada");

    if (user.crunch.inviteCode) {
      return { inviteCode: user.crunch.inviteCode };
    }

    const inviteCode = await this.generateUniqueCode();
    await $prismaClient.crunch.update({
      where: { id: user.crunchId },
      data: { inviteCode },
    });

    return { inviteCode };
  }

  async regenerateInviteCode(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    if (!user.crunchId) throw new DomainError("Usuário não possui igreja vinculada");

    this.assertManager(user);

    const inviteCode = await this.generateUniqueCode();
    await $prismaClient.crunch.update({
      where: { id: user.crunchId },
      data: { inviteCode },
    });

    return { inviteCode };
  }

  async joinByCode(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    if (user.crunchId) throw new DomainError("Você já está vinculado a uma igreja");

    const body = request.body as { inviteCode?: string };
    if (!body.inviteCode?.trim()) throw new DomainError("Código de convite é obrigatório");

    const church = await $prismaClient.crunch.findFirst({
      where: {
        inviteCode: body.inviteCode.trim().toUpperCase(),
        isActive: true,
      },
    });

    if (!church) throw new DomainError("Código de convite inválido ou expirado");

    await $prismaClient.user.update({
      where: { id: user.id },
      data: { crunchId: church.id },
    });

    return { success: true, churchName: church.name };
  }
}
