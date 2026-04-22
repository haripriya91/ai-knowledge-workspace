// src/ai/ai.controller.ts
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AiService } from './ai.service';
import { AiRequestDto } from './dto/ai-request.dto';
import { AiResult } from './types/ai.type'; // ← import shared type so return type is nameable

// @UseGuards(JwtAuthGuard)  // ← uncomment when auth module is ready

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('process')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  async processAi(
    @Body() dto: AiRequestDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<AiResult> {
    // ← explicit return type — fixes "cannot be named" error ✅
    const filePath = file?.path;
    const url = dto.url;

    return this.aiService.processAiRequest(dto, filePath, url);
  }
}
