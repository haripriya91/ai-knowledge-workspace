import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException,
  Query,
} from '@nestjs/common';

import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { GetUser } from '../auth/get-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import type { AiResult } from '../ai/types/ai.type';
import { AiRequestDto } from './dto/ai-request.dto';
import { Sse, MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';

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

  @Sse('summary-stream')
  streamSummary(@Query('fileKey') fileKey: string): Observable<MessageEvent> {
    return new Observable<MessageEvent>((observer) => {
      const startStreaming = async () => {
        try {
          const content = await this.aiService.extractFromPdf(fileKey);

          await this.aiService.streamSummary(content, (chunk: string) => {
            observer.next({
              data: chunk,
            });
          });

          observer.complete();
        } catch (err) {
          observer.error(err);
        }
      };
      void startStreaming();
    });
  }

  @Sse('chat-stream')
  streamChat(
    @Query('fileKey') fileKey: string,
    @Query('message') message: string,
  ): Observable<MessageEvent> {
    return new Observable<MessageEvent>((observer) => {
      const startStreaming = async () => {
        try {
          const content = await this.aiService.extractFromPdf(fileKey);

          await this.aiService.streamChat(
            content,
            message,
            [],
            (chunk: string) => {
              observer.next({
                data: chunk,
              });
            },
          );

          observer.complete();
        } catch (err: unknown) {
          observer.error(err);
        }
      };

      void startStreaming();
    });
  }
}
