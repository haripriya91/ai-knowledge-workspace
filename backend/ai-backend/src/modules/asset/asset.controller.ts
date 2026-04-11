import {
  Controller,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Body, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  createAsset(
    @GetUser() user: JwtPayload,
    @Body() dto: CreateAssetDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.assetService.createAsset(user.userId, dto, file);
  }

  @Post('assetsPublic')
  createAssetPublic(@Body() dto: CreateAssetDto) {
    return this.assetService.createPublicAsset(dto);
  }

  @Get('publicAssets/:workspaceId')
  getPublicAssets(@Param('workspaceId') workspaceId: string) {
    return this.assetService.getPublicAssets(workspaceId);
  }

  @Get(':workspaceId')
  @UseGuards(JwtAuthGuard)
  getMyAssets(
    @GetUser() user: JwtPayload,
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.assetService.getMyAssets(user.userId, workspaceId);
  }
}
