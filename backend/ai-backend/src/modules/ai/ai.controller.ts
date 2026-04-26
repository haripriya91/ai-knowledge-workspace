// src/ai/ai.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { GetUser } from '../auth/get-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { AiService } from './ai.service';
import { AiRequestDto } from './dto/ai-request.dto';
import { AiResult } from '../ai/types/ai.type';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('process')
  @UseGuards(JwtAuthGuard)
  async processAi(
    @GetUser() user: JwtPayload,
    @Body() body: Record<string, string>,
  ): Promise<AiResult> {
    const dto: AiRequestDto = {
      action: body['action'] as AiRequestDto['action'],
      workspaceId: body['workspaceId'],
      question: body['question'],
      url: body['url'],
      history: body['history']
        ? (JSON.parse(body['history']) as { role: string; text: string }[])
        : [],
    };

    const filePath = body['filePath'];
    const url = body['url'];

    return this.aiService.processAiRequest(dto, filePath, url);
  }
}
