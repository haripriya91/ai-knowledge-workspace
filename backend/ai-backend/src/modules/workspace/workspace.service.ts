import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}
  async create(userId: string, dto: CreateWorkspaceDto) {
    const workspace = await this.prisma.workspace.create({
      data: {
        name: dto.name || 'Untitled Workspace',
        description: dto.description,
        category: dto.category,
        thumbnail: dto.thumbnail,
        isPublic: false,

        workspaceUsers: dto.isPublic
          ? undefined // ❗ public → no owner needed
          : {
              create: {
                userId,
                role: 'OWNER',
              },
            },
      },
    });

    return workspace;
  }

  async createPublic(dto: CreateWorkspaceDto) {
    return this.prisma.workspace.create({
      data: {
        name: dto.name || 'Untitled',
        description: dto.description,
        category: dto.category,
        thumbnail: dto.thumbnail,
        isPublic: true,
      },
    });
  }

  async getUserWorkspaces(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        workspaceUsers: {
          some: { userId },
        },
      },
      include: {
        assets: true,
      },
    });
  }

  async getPublicWorkspaces() {
    return this.prisma.workspace.findMany({
      where: {
        isPublic: true,
      },
      include: {
        assets: true,
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

  async getWorkspaceDetails(id: string, userId?: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
      include: {
        assets: true,
        workspaceUsers: userId
          ? {
              where: { userId },
              select: { userId: true },
            }
          : false,
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    if (workspace.isPublic) {
      return workspace;
    }

    const hasAccess = workspace.workspaceUsers?.length > 0;

    if (!userId || !hasAccess) {
      throw new UnauthorizedException('Access denied');
    }

    return workspace;
  }
}
