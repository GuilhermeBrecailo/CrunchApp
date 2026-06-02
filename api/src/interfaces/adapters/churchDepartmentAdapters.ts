import { FastifyRequest } from "fastify/types/request";
import crypto from "node:crypto";
import { Prisma } from "@prisma/client";
import { $prismaClient } from "../../../config/database";
import { DomainError } from "../../domain/value-objects/utils/DomainError";
import { pushNotificationService } from "../../infrastructure/notifications/PushNotificationService";

type CurrentUser = Prisma.UserGetPayload<{
  include: {
    crunch: true;
  };
}>;

type DepartmentWithStats = {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  leaderId: string;
  leader: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    members: number;
    schedules: number;
    tasks: number;
  };
  mediaItems: {
    category: string;
  }[];
};

function getAuthUserId(request: FastifyRequest) {
  const authHeader = request.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    throw new DomainError("Token não fornecido");
  }

  const [, payload] = token.split(".");

  if (!payload) {
    throw new DomainError("Token inválido");
  }

  const decoded = JSON.parse(Buffer.from(payload, "base64url").toString());

  if (!decoded?.sub) {
    throw new DomainError("Token sem usuário");
  }

  return decoded.sub as string;
}

export class ChurchDepartmentAdapters {
  private scheduleSelect = {
    id: true,
    date: true,
    description: true,
    departmentId: true,
    department: {
      select: {
        id: true,
        name: true,
        type: true,
        leaderId: true,
      },
    },
    assignments: {
      select: {
        id: true,
        role: true,
        userId: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    },
  };

  private taskSelect = {
    id: true,
    title: true,
    description: true,
    status: true,
    priority: true,
    dueDate: true,
    createdAt: true,
    assigneeId: true,
    assignee: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  };

  private resourceSelect = {
    id: true,
    title: true,
    url: true,
    category: true,
    metadata: true,
    departmentId: true,
  };

  private songSelect = {
    ...this.resourceSelect,
  };

  private departmentSelect = {
    id: true,
    name: true,
    type: true,
    isActive: true,
    leaderId: true,
    leader: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    _count: {
      select: {
        members: true,
        schedules: true,
        tasks: true,
      },
    },
    mediaItems: {
      select: {
        category: true,
      },
    },
  };

  private mapDepartment(department: DepartmentWithStats) {
    const songsCount = department.mediaItems.filter(
      (item) => item.category === "MUSIC",
    ).length;

    return {
      id: department.id,
      name: department.name,
      type: department.type,
      isActive: department.isActive,
      leaderId: department.leaderId,
      leader: department.leader,
      membersCount: department._count.members,
      schedulesCount: department._count.schedules,
      tasksCount: department._count.tasks,
      resourcesCount: department.mediaItems.length - songsCount,
      songsCount,
    };
  }

  private async getCurrentUser(request: FastifyRequest): Promise<CurrentUser> {
    const userId = getAuthUserId(request);
    const user = await $prismaClient.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        crunch: true,
      },
    });

    if (!user) {
      throw new DomainError("Usuário não encontrado");
    }

    if (!user.crunchId || !user.crunch) {
      throw new DomainError("Usuário não possui igreja vinculada");
    }

    return user;
  }

  private isTitularPastor(user: CurrentUser) {
    return user.role === "PASTOR" && user.crunch?.userMainId === user.id;
  }

  private async assertCanManageDepartment(user: CurrentUser, departmentId: string) {
    const department = await this.getDepartmentFromCurrentChurch(
      departmentId,
      user.crunchId!,
    );

    if (!this.isTitularPastor(user) && department.leaderId !== user.id) {
      throw new DomainError("Usuario nao possui permissao para gerenciar este ministerio");
    }

    return department;
  }

  private async getDepartmentFromCurrentChurch(
    departmentId: string,
    crunchId: string,
  ) {
    const department = await $prismaClient.department.findFirst({
      where: {
        id: departmentId,
        crunchId,
      },
      select: this.departmentSelect,
    });

    if (!department) {
      throw new DomainError("Ministério não encontrado nesta igreja");
    }

    return this.mapDepartment(department);
  }

  private async getScheduleFromCurrentChurch(scheduleId: string, crunchId: string) {
    const schedule = await $prismaClient.schedule.findFirst({
      where: {
        id: scheduleId,
        department: {
          crunchId,
        },
      },
      select: this.scheduleSelect,
    });

    if (!schedule) {
      throw new DomainError("Escala não encontrada nesta igreja");
    }

    return schedule;
  }

  private async getTaskFromCurrentChurch(
    taskId: string,
    departmentId: string,
    crunchId: string,
  ) {
    const task = await $prismaClient.departmentTask.findFirst({
      where: {
        id: taskId,
        departmentId,
        department: {
          crunchId,
        },
      },
      select: this.taskSelect,
    });

    if (!task) {
      throw new DomainError("Tarefa nao encontrada neste ministerio");
    }

    return task;
  }

  private async getResourceFromCurrentChurch(
    resourceId: string,
    departmentId: string,
    crunchId: string,
  ) {
    const resource = await $prismaClient.mediaItem.findFirst({
      where: {
        id: resourceId,
        departmentId,
        department: {
          crunchId,
        },
      },
      select: this.resourceSelect,
    });

    if (!resource) {
      throw new DomainError("Recurso nao encontrado neste ministerio");
    }

    return resource;
  }

  async getChurchDepartments(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);

    const departments = await $prismaClient.department.findMany({
      where: {
        crunchId: user.crunchId!,
      },
      orderBy: {
        name: "asc",
      },
      select: this.departmentSelect,
    });

    return departments.map((department) => this.mapDepartment(department));
  }

  async createChurchDepartment(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    const body = request.body as {
      name?: string;
      leaderId?: string;
      type?: string;
    };

    if (!this.isTitularPastor(user)) {
      throw new DomainError("Apenas o pastor titular pode cadastrar ministérios");
    }

    if (!body.name?.trim()) {
      throw new DomainError("Nome do ministério é obrigatório");
    }

    if (!body.leaderId) {
      throw new DomainError("Líder do ministério é obrigatório");
    }

    const leader = await $prismaClient.user.findUnique({
      where: {
        id: body.leaderId,
      },
    });

    if (!leader || leader.crunchId !== user.crunchId) {
      throw new DomainError("Líder não encontrado nesta igreja");
    }

    const department = await $prismaClient.department.create({
      data: {
        id: crypto.randomUUID(),
        name: body.name.trim(),
        type: body.type || "OTHER",
        leaderId: leader.id,
        crunchId: user.crunchId!,
        isActive: true,
      },
      select: this.departmentSelect,
    });

    return this.mapDepartment(department);
  }

  async getChurchDepartmentById(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    const { id } = request.params as { id?: string };

    if (!id) {
      throw new DomainError("Ministério não informado");
    }

    return await this.getDepartmentFromCurrentChurch(id, user.crunchId!);
  }

  async updateChurchDepartment(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    const { id } = request.params as { id?: string };
    const body = request.body as {
      name?: string;
      leaderId?: string;
      type?: string;
      isActive?: boolean;
    };

    if (!id) {
      throw new DomainError("Ministerio nao informado");
    }

    if (!this.isTitularPastor(user)) {
      throw new DomainError("Apenas o pastor titular pode editar ministerios");
    }

    await this.getDepartmentFromCurrentChurch(id, user.crunchId!);

    if (body.leaderId) {
      const leader = await $prismaClient.user.findFirst({
        where: {
          id: body.leaderId,
          crunchId: user.crunchId!,
        },
      });

      if (!leader) {
        throw new DomainError("Lider nao encontrado nesta igreja");
      }
    }

    const data: Prisma.DepartmentUpdateInput = {};

    if (body.name !== undefined) {
      if (!body.name.trim()) {
        throw new DomainError("Nome do ministerio e obrigatorio");
      }

      data.name = body.name.trim();
    }

    if (body.type !== undefined) {
      data.type = body.type.trim() || "OTHER";
    }

    if (body.isActive !== undefined) {
      data.isActive = body.isActive;
    }

    if (body.leaderId !== undefined) {
      data.leader = {
        connect: {
          id: body.leaderId,
        },
      };
    }

    const department = await $prismaClient.department.update({
      where: {
        id,
      },
      data,
      select: this.departmentSelect,
    });

    return this.mapDepartment(department);
  }

  async deleteChurchDepartment(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    const { id } = request.params as { id?: string };

    if (!id) {
      throw new DomainError("Ministerio nao informado");
    }

    if (!this.isTitularPastor(user)) {
      throw new DomainError("Apenas o pastor titular pode remover ministerios");
    }

    await this.getDepartmentFromCurrentChurch(id, user.crunchId!);

    await $prismaClient.department.delete({
      where: {
        id,
      },
    });

    return { success: true };
  }

  async getChurchDepartmentTasks(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    const { id } = request.params as { id?: string };

    if (!id) {
      throw new DomainError("Ministério não informado");
    }

    await this.getDepartmentFromCurrentChurch(id, user.crunchId!);

    return await $prismaClient.departmentTask.findMany({
      where: {
        departmentId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        ...this.taskSelect,
      },
    });
  }

  async createChurchDepartmentTask(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    const { id } = request.params as { id?: string };
    const body = request.body as {
      title?: string;
      description?: string;
      priority?: string;
      dueDate?: string;
      assigneeId?: string;
    };

    if (!id) {
      throw new DomainError("Ministério não informado");
    }

    if (!body.title?.trim()) {
      throw new DomainError("Título da tarefa é obrigatório");
    }

    await this.assertCanManageDepartment(user, id);

    if (body.assigneeId) {
      const assignee = await $prismaClient.user.findUnique({
        where: {
          id: body.assigneeId,
        },
      });

      if (!assignee || assignee.crunchId !== user.crunchId) {
        throw new DomainError("Responsável não encontrado nesta igreja");
      }
    }

    return await $prismaClient.departmentTask.create({
      data: {
        id: crypto.randomUUID(),
        title: body.title.trim(),
        description: body.description?.trim() || null,
        priority: body.priority || "MEDIUM",
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        departmentId: id,
        assigneeId: body.assigneeId || null,
      },
      select: {
        ...this.taskSelect,
      },
    });
  }

  async updateChurchDepartmentTask(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    const { departmentId, taskId } = request.params as {
      departmentId?: string;
      taskId?: string;
    };
    const body = request.body as {
      title?: string;
      description?: string | null;
      status?: string;
      priority?: string;
      dueDate?: string | null;
      assigneeId?: string | null;
    };

    if (!departmentId || !taskId) {
      throw new DomainError("Tarefa nao informada");
    }

    await this.assertCanManageDepartment(user, departmentId);
    await this.getTaskFromCurrentChurch(taskId, departmentId, user.crunchId!);

    if (body.assigneeId) {
      const assignee = await $prismaClient.user.findFirst({
        where: {
          id: body.assigneeId,
          crunchId: user.crunchId!,
        },
      });

      if (!assignee) {
        throw new DomainError("Responsavel nao encontrado nesta igreja");
      }
    }

    const data: Prisma.DepartmentTaskUpdateInput = {};

    if (body.title !== undefined) {
      if (!body.title.trim()) {
        throw new DomainError("Titulo da tarefa e obrigatorio");
      }

      data.title = body.title.trim();
    }

    if (body.description !== undefined) {
      data.description = body.description?.trim() || null;
    }

    if (body.status !== undefined) {
      data.status = body.status.trim() || "OPEN";
    }

    if (body.priority !== undefined) {
      data.priority = body.priority.trim() || "MEDIUM";
    }

    if (body.dueDate !== undefined) {
      data.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    }

    if (body.assigneeId !== undefined) {
      data.assignee = body.assigneeId
        ? {
            connect: {
              id: body.assigneeId,
            },
          }
        : {
            disconnect: true,
          };
    }

    return await $prismaClient.departmentTask.update({
      where: {
        id: taskId,
      },
      data,
      select: this.taskSelect,
    });
  }

  async deleteChurchDepartmentTask(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    const { departmentId, taskId } = request.params as {
      departmentId?: string;
      taskId?: string;
    };

    if (!departmentId || !taskId) {
      throw new DomainError("Tarefa nao informada");
    }

    await this.assertCanManageDepartment(user, departmentId);
    await this.getTaskFromCurrentChurch(taskId, departmentId, user.crunchId!);

    await $prismaClient.departmentTask.delete({
      where: {
        id: taskId,
      },
    });

    return { success: true };
  }

  async getChurchDepartmentSchedules(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    const { id } = request.params as { id?: string };

    if (!id) {
      throw new DomainError("Ministério não informado");
    }

    await this.getDepartmentFromCurrentChurch(id, user.crunchId!);

    return await $prismaClient.schedule.findMany({
      where: {
        departmentId: id,
      },
      orderBy: {
        date: "asc",
      },
      select: this.scheduleSelect,
    });
  }

  async getChurchSchedules(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);

    return await $prismaClient.schedule.findMany({
      where: {
        department: {
          crunchId: user.crunchId!,
        },
      },
      orderBy: {
        date: "asc",
      },
      select: this.scheduleSelect,
    });
  }

  async createChurchDepartmentSchedule(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    const { id } = request.params as { id?: string };

    if (!id) {
      throw new DomainError("Ministério não informado");
    }

    return await this.createSchedule(id, user.crunchId!, request.body);
  }

  async createChurchSchedule(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    const body = request.body as { departmentId?: string };

    if (!body.departmentId) {
      throw new DomainError("Ministério da escala é obrigatório");
    }

    return await this.createSchedule(body.departmentId, user.crunchId!, body);
  }

  private async createSchedule(
    departmentId: string,
    crunchId: string,
    rawBody: unknown,
  ) {
    const body = rawBody as {
      title?: string;
      description?: string;
      date?: string;
      time?: string;
    };

    if (!body.title?.trim()) {
      throw new DomainError("Título da escala é obrigatório");
    }

    if (!body.date) {
      throw new DomainError("Data da escala é obrigatória");
    }

    await this.getDepartmentFromCurrentChurch(departmentId, crunchId);

    const scheduleDate = new Date(
      `${body.date}T${body.time || "00:00"}:00.000`,
    );

    if (Number.isNaN(scheduleDate.getTime())) {
      throw new DomainError("Data da escala inválida");
    }

    return await $prismaClient.schedule.create({
      data: {
        id: crypto.randomUUID(),
        date: scheduleDate,
        description: body.title.trim(),
        departmentId,
      },
      select: this.scheduleSelect,
    });
  }

  async updateChurchSchedule(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    const { id } = request.params as { id?: string };
    const body = request.body as {
      title?: string;
      description?: string;
      date?: string;
      time?: string;
      departmentId?: string;
    };

    if (!id) {
      throw new DomainError("Escala nao informada");
    }

    const schedule = await this.getScheduleFromCurrentChurch(id, user.crunchId!);
    const targetDepartmentId = body.departmentId || schedule.departmentId;

    await this.assertCanManageDepartment(user, schedule.departmentId);

    if (targetDepartmentId !== schedule.departmentId) {
      await this.assertCanManageDepartment(user, targetDepartmentId);
    }

    const data: Prisma.ScheduleUpdateInput = {};

    if (body.title !== undefined || body.description !== undefined) {
      const description = body.title ?? body.description;

      if (!description?.trim()) {
        throw new DomainError("Titulo da escala e obrigatorio");
      }

      data.description = description.trim();
    }

    if (body.date !== undefined || body.time !== undefined) {
      const currentDate = schedule.date;
      const datePart = body.date ?? currentDate.toISOString().slice(0, 10);
      const timePart =
        body.time ??
        currentDate.toISOString().slice(11, 16);
      const scheduleDate = new Date(`${datePart}T${timePart}:00.000`);

      if (Number.isNaN(scheduleDate.getTime())) {
        throw new DomainError("Data da escala invalida");
      }

      data.date = scheduleDate;
    }

    if (body.departmentId !== undefined) {
      data.department = {
        connect: {
          id: body.departmentId,
        },
      };
    }

    return await $prismaClient.schedule.update({
      where: {
        id,
      },
      data,
      select: this.scheduleSelect,
    });
  }

  async deleteChurchSchedule(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    const { id } = request.params as { id?: string };

    if (!id) {
      throw new DomainError("Escala nao informada");
    }

    const schedule = await this.getScheduleFromCurrentChurch(id, user.crunchId!);
    await this.assertCanManageDepartment(user, schedule.departmentId);

    await $prismaClient.schedule.delete({
      where: {
        id,
      },
    });

    return { success: true };
  }

  async updateChurchScheduleAssignments(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    const { id } = request.params as { id?: string };
    const body = request.body as {
      assignments?: {
        userId?: string;
        role?: string;
      }[];
    };

    if (!id) {
      throw new DomainError("Escala não informada");
    }

    const assignments = body.assignments ?? [];

    if (!Array.isArray(assignments)) {
      throw new DomainError("Voluntários inválidos");
    }

    const schedule = await this.getScheduleFromCurrentChurch(id, user.crunchId!);
    await this.assertCanManageDepartment(user, schedule.departmentId);

    const normalizedAssignments = assignments
      .map((assignment) => ({
        userId: assignment.userId?.trim(),
        role: assignment.role?.trim() || "Voluntário",
      }))
      .filter((assignment): assignment is { userId: string; role: string } =>
        Boolean(assignment.userId),
      );

    const uniqueUserIds = [...new Set(normalizedAssignments.map((item) => item.userId))];

    if (uniqueUserIds.length !== normalizedAssignments.length) {
      throw new DomainError("Não é possível repetir o mesmo voluntário na escala");
    }

    if (uniqueUserIds.length > 0) {
      const users = await $prismaClient.user.findMany({
        where: {
          id: {
            in: uniqueUserIds,
          },
          crunchId: user.crunchId!,
        },
        select: {
          id: true,
        },
      });

      if (users.length !== uniqueUserIds.length) {
        throw new DomainError("Um ou mais voluntários não pertencem a esta igreja");
      }
    }

    const previousAssignments = await $prismaClient.scheduleAssignment.findMany({
      where: {
        scheduleId: id,
      },
      select: {
        userId: true,
      },
    });
    const previousUserIds = new Set(
      previousAssignments.map((assignment) => assignment.userId),
    );
    const newlyAssignedUserIds = uniqueUserIds.filter(
      (userId) => !previousUserIds.has(userId),
    );

    await $prismaClient.$transaction([
      $prismaClient.scheduleAssignment.deleteMany({
        where: {
          scheduleId: id,
        },
      }),
      ...normalizedAssignments.map((assignment) =>
        $prismaClient.scheduleAssignment.create({
          data: {
            id: crypto.randomUUID(),
            scheduleId: id,
            userId: assignment.userId,
            role: assignment.role,
          },
        }),
      ),
    ]);

    const updatedSchedule = await this.getScheduleFromCurrentChurch(id, user.crunchId!);

    await pushNotificationService.sendToUsers(newlyAssignedUserIds, {
      title: "Voce foi escalado",
      body: `${updatedSchedule.department.name} - ${updatedSchedule.description}`,
      url: `/user`,
      type: "schedule-assigned",
      scheduleId: updatedSchedule.id,
    });

    return updatedSchedule;
  }

  async getChurchDepartmentResources(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    const { id } = request.params as { id?: string };

    if (!id) {
      throw new DomainError("Ministério não informado");
    }

    await this.getDepartmentFromCurrentChurch(id, user.crunchId!);

    return await $prismaClient.mediaItem.findMany({
      where: {
        departmentId: id,
        NOT: {
          category: "MUSIC",
        },
      },
      orderBy: {
        title: "asc",
      },
      select: {
        ...this.resourceSelect,
      },
    });
  }

  async getChurchDepartmentSongs(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    const { id } = request.params as { id?: string };

    if (!id) {
      throw new DomainError("Ministerio nao informado");
    }

    await this.getDepartmentFromCurrentChurch(id, user.crunchId!);

    return await $prismaClient.mediaItem.findMany({
      where: {
        departmentId: id,
        category: "MUSIC",
      },
      orderBy: {
        title: "asc",
      },
      select: this.songSelect,
    });
  }

  async createChurchDepartmentSong(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    const { id } = request.params as { id?: string };
    const body = request.body as {
      title?: string;
      artist?: string;
      key?: string;
      bpm?: string | number | null;
      songCategory?: string;
      url?: string;
      notes?: string;
    };

    if (!id) {
      throw new DomainError("Ministerio nao informado");
    }

    if (!body.title?.trim()) {
      throw new DomainError("Titulo da musica e obrigatorio");
    }

    await this.assertCanManageDepartment(user, id);

    const metadata = {
      artist: body.artist?.trim() || "",
      key: body.key?.trim() || "",
      bpm: body.bpm === undefined || body.bpm === null ? "" : String(body.bpm).trim(),
      songCategory: body.songCategory?.trim() || "Louvor",
      notes: body.notes?.trim() || "",
    };

    return await $prismaClient.mediaItem.create({
      data: {
        id: crypto.randomUUID(),
        title: body.title.trim(),
        url: body.url?.trim() || "",
        category: "MUSIC",
        metadata,
        departmentId: id,
      },
      select: this.songSelect,
    });
  }

  async updateChurchDepartmentSong(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    const { departmentId, songId } = request.params as {
      departmentId?: string;
      songId?: string;
    };
    const body = request.body as {
      title?: string;
      artist?: string;
      key?: string;
      bpm?: string | number | null;
      songCategory?: string;
      url?: string | null;
      notes?: string | null;
    };

    if (!departmentId || !songId) {
      throw new DomainError("Musica nao informada");
    }

    await this.assertCanManageDepartment(user, departmentId);
    const song = await this.getResourceFromCurrentChurch(
      songId,
      departmentId,
      user.crunchId!,
    );

    if (song.category !== "MUSIC") {
      throw new DomainError("Musica nao encontrada");
    }

    const currentMetadata =
      song.metadata && typeof song.metadata === "object" && !Array.isArray(song.metadata)
        ? (song.metadata as Record<string, unknown>)
        : {};

    const metadata = {
      ...currentMetadata,
      ...(body.artist !== undefined ? { artist: body.artist.trim() } : {}),
      ...(body.key !== undefined ? { key: body.key.trim() } : {}),
      ...(body.bpm !== undefined
        ? { bpm: body.bpm === null ? "" : String(body.bpm).trim() }
        : {}),
      ...(body.songCategory !== undefined
        ? { songCategory: body.songCategory.trim() || "Louvor" }
        : {}),
      ...(body.notes !== undefined ? { notes: body.notes?.trim() || "" } : {}),
    };

    const data: Prisma.MediaItemUpdateInput = {
      metadata,
    };

    if (body.title !== undefined) {
      if (!body.title.trim()) {
        throw new DomainError("Titulo da musica e obrigatorio");
      }

      data.title = body.title.trim();
    }

    if (body.url !== undefined) {
      data.url = body.url?.trim() || "";
    }

    return await $prismaClient.mediaItem.update({
      where: {
        id: songId,
      },
      data,
      select: this.songSelect,
    });
  }

  async deleteChurchDepartmentSong(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    const { departmentId, songId } = request.params as {
      departmentId?: string;
      songId?: string;
    };

    if (!departmentId || !songId) {
      throw new DomainError("Musica nao informada");
    }

    await this.assertCanManageDepartment(user, departmentId);
    const song = await this.getResourceFromCurrentChurch(
      songId,
      departmentId,
      user.crunchId!,
    );

    if (song.category !== "MUSIC") {
      throw new DomainError("Musica nao encontrada");
    }

    await $prismaClient.mediaItem.delete({
      where: {
        id: songId,
      },
    });

    return { success: true };
  }

  async createChurchDepartmentResource(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    const { id } = request.params as { id?: string };
    const body = request.body as {
      title?: string;
      url?: string;
      category?: string;
      notes?: string;
    };

    if (!id) {
      throw new DomainError("Ministério não informado");
    }

    if (!body.title?.trim()) {
      throw new DomainError("Título do recurso é obrigatório");
    }

    if (!body.url?.trim()) {
      throw new DomainError("Link do recurso é obrigatório");
    }

    await this.assertCanManageDepartment(user, id);

    return await $prismaClient.mediaItem.create({
      data: {
        id: crypto.randomUUID(),
        title: body.title.trim(),
        url: body.url.trim(),
        category: body.category?.trim() || "Geral",
        metadata: body.notes?.trim() ? { notes: body.notes.trim() } : undefined,
        departmentId: id,
      },
      select: this.resourceSelect,
    });
  }

  async updateChurchDepartmentResource(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    const { departmentId, resourceId } = request.params as {
      departmentId?: string;
      resourceId?: string;
    };
    const body = request.body as {
      title?: string;
      url?: string;
      category?: string;
      notes?: string | null;
    };

    if (!departmentId || !resourceId) {
      throw new DomainError("Recurso nao informado");
    }

    await this.assertCanManageDepartment(user, departmentId);
    await this.getResourceFromCurrentChurch(resourceId, departmentId, user.crunchId!);

    const data: Prisma.MediaItemUpdateInput = {};

    if (body.title !== undefined) {
      if (!body.title.trim()) {
        throw new DomainError("Titulo do recurso e obrigatorio");
      }

      data.title = body.title.trim();
    }

    if (body.url !== undefined) {
      if (!body.url.trim()) {
        throw new DomainError("Link do recurso e obrigatorio");
      }

      data.url = body.url.trim();
    }

    if (body.category !== undefined) {
      data.category = body.category.trim() || "Geral";
    }

    if (body.notes !== undefined) {
      data.metadata = body.notes?.trim() ? { notes: body.notes.trim() } : Prisma.JsonNull;
    }

    return await $prismaClient.mediaItem.update({
      where: {
        id: resourceId,
      },
      data,
      select: this.resourceSelect,
    });
  }

  async deleteChurchDepartmentResource(request: FastifyRequest) {
    const user = await this.getCurrentUser(request);
    const { departmentId, resourceId } = request.params as {
      departmentId?: string;
      resourceId?: string;
    };

    if (!departmentId || !resourceId) {
      throw new DomainError("Recurso nao informado");
    }

    await this.assertCanManageDepartment(user, departmentId);
    await this.getResourceFromCurrentChurch(resourceId, departmentId, user.crunchId!);

    await $prismaClient.mediaItem.delete({
      where: {
        id: resourceId,
      },
    });

    return { success: true };
  }
}
