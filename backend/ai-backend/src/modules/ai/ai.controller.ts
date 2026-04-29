import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';

import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { GetUser } from '../auth/get-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import type { AiResult } from '../ai/types/ai.type';
import { AiRequestDto } from './dto/ai-request.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('process')
  @UseGuards(JwtAuthGuard)
  async processAi(
    @GetUser() user: JwtPayload,
    @Body() dto: AiRequestDto,
  ): Promise<AiResult> {
    if (!dto.action || !dto.workspaceId) {
      throw new BadRequestException('Missing required fields');
    }

    return this.aiService.processAiRequest(dto, dto.filePath, dto.url);
  }
}
