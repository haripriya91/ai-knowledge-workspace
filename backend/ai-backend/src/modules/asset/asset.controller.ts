import { Controller } from '@nestjs/common';
import { Body, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import * as jwtPayloadInterface from '../auth/interfaces/jwt-payload.interface';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';

@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}
  @Post('assets')
  @UseGuards(JwtAuthGuard)
  createAsset(
    @GetUser() user: jwtPayloadInterface.JwtPayload,
    @Body() dto: CreateAssetDto,
  ) {
    return this.assetService.createAsset(user.userId, dto);
  }

  @Post('assetsPublic')
  createAssetPublic(@Body() dto: CreateAssetDto) {
    return this.assetService.createPublicAsset(dto);
  }
}
