import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';

@Injectable()
export class AssetService {
  constructor(private readonly prisma: PrismaService) {}
  async createAsset(userId: string, dto: CreateAssetDto) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: dto.workspaceId },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    if (workspace.isPublic && !dto.isPublic) {
      throw new ForbiddenException('Cannot modify public workspace');
    }

    return this.prisma.asset.create({
      data: {
        name: dto.name,
        type: dto.type,
        url: dto.type === 'url' ? dto.url : null,
        filePath: dto.type === 'pdf' ? dto.filePath : null,
        userId,
        workspaceId: dto.workspaceId,
        isPublic: dto.isPublic ?? false,
      },
    });
  }

  async createPublicAsset(dto: CreateAssetDto) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: dto.workspaceId },
    });

    if (!workspace || !workspace.isPublic) {
      throw new NotFoundException('Public workspace not found');
    }

    return this.prisma.asset.create({
      data: {
        name: dto.name,
        type: dto.type,
        url: dto.type === 'url' ? dto.url : null,
        workspaceId: dto.workspaceId,
        isPublic: true,
      },
    });
  }
}
