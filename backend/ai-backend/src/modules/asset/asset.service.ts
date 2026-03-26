import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetService {
  constructor(private readonly prisma: PrismaService) {}
  async createAsset(
    userId: string,
    dto: { name: string; workspaceId: string },
  ) {
    return this.prisma.asset.create({
      data: {
        name: dto.name,
        userId,
        workspaceId: dto.workspaceId,
      },
    });
  }
}
