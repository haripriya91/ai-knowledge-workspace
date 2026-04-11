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
  async createAsset(
    userId: string,
    dto: CreateAssetDto,
    file?: Express.Multer.File,
  ) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: dto.workspaceId },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // ✅ Correct access check
    const hasAccess = await this.prisma.workspaceUser.findFirst({
      where: {
        workspaceId: dto.workspaceId,
        userId: userId,
      },
    });

    if (!workspace.isPublic && !hasAccess) {
      throw new ForbiddenException('No access to workspace');
    }

    let fileName: string | null = null;
    let mimeType = '';
    let filePath: string | null = null;
    let type: 'pdf' | 'docx' | 'url' = 'url';

    if (file && typeof file === 'object') {
      const { originalname, mimetype, filename } = file;

      fileName = originalname ?? null;
      mimeType = mimetype ?? '';
      filePath = filename ?? null;

      type = mimeType.includes('pdf') ? 'pdf' : 'docx';
    }

    return this.prisma.asset.create({
      data: {
        name: dto.name || fileName || 'Untitled',
        type,
        url: dto.url || null,
        filePath,
        userId,
        workspaceId: dto.workspaceId,
        isPublic: workspace.isPublic,
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

  async getMyAssets(userId: string, workspaceId: string) {
    return this.prisma.asset.findMany({
      where: {
        userId: userId,
        workspaceId: workspaceId,
      },
    });
  }

  async getPublicAssets(workspaceId: string) {
    return this.prisma.asset.findMany({
      where: {
        isPublic: true,
        workspaceId: workspaceId,
      },
    });
  }
}
