import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}
  async create(userId: string, name: string) {
    const workspace = await this.prisma.workspace.create({
      data: {
        name,
        isPublic: false,
        workspaceUsers: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },
    });

    return workspace;
  }

  async getUserWorkspaces(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        workspaceUsers: {
          some: {
            userId,
          },
        },
      },
    });
  }

  async joinWorkspace(userId: string, workspaceId: string) {
    return this.prisma.workspaceUser.create({
      data: {
        userId,
        workspaceId,
        role: 'MEMBER',
      },
    });
  }
}
