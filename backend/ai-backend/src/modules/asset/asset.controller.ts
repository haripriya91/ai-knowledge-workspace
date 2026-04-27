import {
  Controller,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  Body,
  Post,
  UseGuards,
  Delete,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { GetUser } from '../auth/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  createAsset(
    @GetUser() user: JwtPayload,
    @Body() dto: CreateAssetDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.assetService.createAsset(user.userId, dto, file);
  }

  @Get(':workspaceId')
  @UseGuards(JwtAuthGuard)
  getMyAssets(
    @GetUser() user: JwtPayload,
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.assetService.getMyAssets(user.userId, workspaceId);
  }

  @Get('publicAssets/:workspaceId')
  getPublicAssets(@Param('workspaceId') workspaceId: string) {
    return this.assetService.getPublicAssets(workspaceId);
  }

  @Delete(':assetId')
  @UseGuards(JwtAuthGuard)
  deleteAsset(@GetUser() user: JwtPayload, @Param('assetId') assetId: string) {
    return this.assetService.deleteAsset(user.userId, assetId);
  }

  @Patch(':assetId/file')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  replaceFile(
    @GetUser() user: JwtPayload,
    @Param('assetId') assetId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.assetService.replaceFile(user.userId, assetId, file);
  }
}
