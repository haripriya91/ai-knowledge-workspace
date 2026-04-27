import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { S3Service } from '../../common/storage/s3.service';

@Injectable()
export class AssetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

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

    const hasAccess = await this.prisma.workspaceUser.findFirst({
      where: {
        workspaceId: dto.workspaceId,
        userId,
      },
    });

    if (!workspace.isPublic && !hasAccess) {
      throw new ForbiddenException('No access');
    }

    let fileKey: string | null = null;
    let type: 'pdf' | 'docx' | 'url' = 'url';

    if (file) {
      // ✅ validation
      if (!file.mimetype.includes('pdf') && !file.mimetype.includes('word')) {
        throw new BadRequestException('Only PDF/DOCX allowed');
      }

      fileKey = await this.s3Service.uploadFile(file);

      type = file.mimetype.includes('pdf') ? 'pdf' : 'docx';
    }

    return this.prisma.asset.create({
      data: {
        name: dto.name || file?.originalname || 'Untitled',
        type,
        url: dto.url || null,
        filePath: fileKey, // store key only
        userId,
        workspaceId: dto.workspaceId,
        isPublic: workspace.isPublic,
      },
    });
  }

  async getMyAssets(userId: string, workspaceId: string) {
    const assets = await this.prisma.asset.findMany({
      where: { userId, workspaceId },
    });

    return Promise.all(
      assets.map(async (asset) => ({
        ...asset,
        fileUrl: asset.filePath
          ? await this.s3Service.getSignedUrl(asset.filePath)
          : null,
      })),
    );
  }

  async getPublicAssets(workspaceId: string) {
    const assets = await this.prisma.asset.findMany({
      where: { isPublic: true, workspaceId },
    });

    return Promise.all(
      assets.map(async (asset) => ({
        ...asset,
        fileUrl: asset.filePath
          ? await this.s3Service.getSignedUrl(asset.filePath)
          : null,
      })),
    );
  }

  async deleteAsset(userId: string, assetId: string) {
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    if (asset.userId !== userId) {
      throw new ForbiddenException('Not allowed');
    }

    // delete from S3
    if (asset.filePath) {
      await this.s3Service.deleteFile(asset.filePath);
    }

    // delete from DB
    return this.prisma.asset.delete({
      where: { id: assetId },
    });
  }

  async replaceFile(
    userId: string,
    assetId: string,
    file: Express.Multer.File,
  ) {
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    if (asset.userId !== userId) {
      throw new ForbiddenException('Not allowed');
    }

    // delete old file
    if (asset.filePath) {
      await this.s3Service.deleteFile(asset.filePath);
    }

    // upload new file
    const newKey = await this.s3Service.uploadFile(file);

    return this.prisma.asset.update({
      where: { id: assetId },
      data: {
        filePath: newKey,
        name: file.originalname,
        type: file.mimetype.includes('pdf') ? 'pdf' : 'docx',
      },
    });
  }
}
