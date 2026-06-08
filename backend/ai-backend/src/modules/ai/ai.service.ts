// src/ai/ai.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
//import * as fs from 'fs';
//import * as path from 'path';
import { AiRequestDto } from './dto/ai-request.dto';
import { PROMPTS } from './prompts/prompts';
import { AiResult, FlashCard, QuizItem } from './types/ai.type'; // ← shared types
import { S3Service } from 'src/common/storage/s3.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import type {
  TextItem,
  TextMarkedContent,
} from 'pdfjs-dist/types/src/display/api';

@Injectable()
export class AiService {
  private client: Anthropic;
  private readonly MODEL = 'claude-haiku-4-5';
  private readonly MAX_TOKENS = 1500;

  constructor(
    private readonly s3Service: S3Service,
    private readonly prisma: PrismaService,
  ) {
    console.log('API KEY loaded:', !!process.env.CLAUDE_API_KEY);
    this.client = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });
  }

  // ─── MAIN ENTRY POINT ──────────────────────────────────────────
  async processAiRequest(
    dto: AiRequestDto,
    filePath?: string,
    url?: string,
  ): Promise<AiResult> {
    const asset = await this.prisma.asset.findFirst({
      where: {
        OR: [{ filePath }, { url }],
      },
    });

    const content = await this.extractContent(filePath, url);

    if (!content) {
      throw new BadRequestException('No content found');
    }

    switch (dto.action) {
      case 'summary': {
        if (asset?.summaryCache) {
          return {
            type: 'summary',
            data: asset.summaryCache,
          };
        }
        const result = await this.getSummary(content);
        if (asset?.id) {
          await this.prisma.asset.update({
            where: { id: asset.id },
            data: {
              summaryCache: result.data as string,
            },
          });
        }
        return result;
      }
      case 'flashcards': {
        if (asset?.flashcardCache) {
          return {
            type: 'flashcards',
            data: asset.flashcardCache as unknown as FlashCard[],
          };
        }
        const result = await this.getFlashcards(content);

        if (asset?.id && Array.isArray(result.data)) {
          await this.prisma.asset.update({
            where: { id: asset.id },
            data: {
              flashcardCache: this.safeJson(result.data),
            },
          });
        }

        return result;
      }
      case 'quiz': {
        if (asset?.quizCache) {
          return {
            type: 'quiz',
            data: asset.quizCache as unknown as QuizItem[],
          };
        }

        const result = await this.getQuiz(content);

        if (asset?.id && Array.isArray(result.data)) {
          await this.prisma.asset.update({
            where: { id: asset.id },
            data: {
              quizCache: this.safeJson(result.data),
            },
          });
        }
        return result;
      }
      case 'qna':
        return this.getQnA(content, dto.question);

      case 'chat':
        return this.getChat(content, dto.question ?? '', dto.history ?? []);

      default:
        throw new BadRequestException('Unknown AI action.');
    }
  }

  // ─── CONTENT EXTRACTION ────────────────────────────────────────

  private async extractContent(
    filePath?: string,
    url?: string,
  ): Promise<string | null> {
    if (filePath) return this.extractFromPdf(filePath);
    if (url) return this.extractFromUrl(url);
    return null;
  }

  async extractFromPdf(fileKey: string): Promise<string> {
    const s3Object = await this.s3Service.getObject(fileKey);
    const data = new Uint8Array(s3Object.Body as Buffer);

    const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const pdf = await getDocument({ data }).promise;

    const pagePromises = Array.from({ length: pdf.numPages }, async (_, i) => {
      const page = await pdf.getPage(i + 1);
      const content = await page.getTextContent();

      return content.items
        .map((item: TextItem | TextMarkedContent) =>
          'str' in item ? item.str : '',
        )
        .join(' ');
    });

    const pages = await Promise.all(pagePromises);
    return pages.join('\n').trim();
  }

  private async extractFromUrl(url: string): Promise<string> {
    const response = await fetch(url);
    const html = await response.text();
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // ─── CLAUDE API CALL ───────────────────────────────────────────

  private async callClaude(prompt: string): Promise<string> {
    const message = await this.client.messages.create({
      model: this.MODEL,
      max_tokens: this.MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    });

    const block = message.content[0];
    if (block.type === 'text') {
      return block.text;
    }
    return '';
  }
  // ─── CLAUDE API STREAM CALL ───────────────────────────────────────────

  /*private async streamClaude(
    prompt: string,
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    const stream = this.client.messages.stream({
      model: this.MODEL,
      max_tokens: this.MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        onChunk(event.delta.text);
      }
    }
  }*/

  private async streamClaude(
    prompt: string,
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    const stream = this.client.messages.stream({
      model: this.MODEL,
      max_tokens: this.MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        onChunk(event.delta.text);
      }
    }
  }
  // ─── AI ACTIONS ────────────────────────────────────────────────

  async getSummary(content: string): Promise<AiResult> {
    const prompt = PROMPTS.SUMMARY(content);
    const result = await this.callClaude(prompt);
    return { type: 'summary', data: result };
  }

  /*streamSummary(content: string): Observable<string> {
    return new Observable((observer) => {
      const prompt = PROMPTS.SUMMARY(content);

      this.streamClaude(prompt, (chunk) => {
        observer.next(chunk);
      })
        .then(() => observer.complete())
        .catch((err) => observer.error(err));
    });
  }*/

  async streamSummary(
    content: string,
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    const prompt = PROMPTS.SUMMARY(content);
    await this.streamClaude(prompt, onChunk);
  }

  async getQnA(content: string, question?: string): Promise<AiResult> {
    if (!question) {
      throw new BadRequestException('Question is required for Q&A.');
    }
    const prompt = PROMPTS.QNA(content, question);
    const result = await this.callClaude(prompt);
    return { type: 'qna', question, data: result };
  }

  async getFlashcards(content: string): Promise<AiResult> {
    const prompt = PROMPTS.FLASHCARDS(content);
    const raw = await this.callClaude(prompt);
    try {
      const cards = JSON.parse(raw) as FlashCard[];
      return { type: 'flashcards', data: cards };
    } catch {
      return { type: 'flashcards', data: raw };
    }
  }

  async getQuiz(content: string): Promise<AiResult> {
    const prompt = PROMPTS.QUIZ(content);
    const raw = await this.callClaude(prompt);
    try {
      const quiz = JSON.parse(raw) as QuizItem[];
      return { type: 'quiz', data: quiz };
    } catch {
      return { type: 'quiz', data: raw };
    }
  }

  async getChat(
    content: string,
    message: string,
    history: { role: string; text: string }[],
  ): Promise<AiResult> {
    if (!message) {
      throw new BadRequestException('Message is required for chat.');
    }
    const prompt = PROMPTS.CHAT(content, message, history);
    const result = await this.callClaude(prompt);
    return { type: 'chat', data: result };
  }

  async streamChat(
    content: string,
    message: string,
    history: { role: string; text: string }[],
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    if (!message) {
      throw new BadRequestException('Message is required for chat.');
    }

    const prompt = PROMPTS.CHAT(content, message, history);

    await this.streamClaude(prompt, onChunk);
  }

  private safeJson(data: FlashCard[] | QuizItem[]): Prisma.InputJsonValue {
    return data as unknown as Prisma.InputJsonValue;
  }
}
