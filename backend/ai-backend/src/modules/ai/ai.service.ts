// src/ai/ai.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
//import * as fs from 'fs';
//import * as path from 'path';
import { AiRequestDto } from './dto/ai-request.dto';
import { PROMPTS } from './prompts/prompts';
import { AiResult, FlashCard, QuizItem } from './types/ai.type'; // ← shared types
import { S3Service } from 'src/common/storage/s3.service';
import type {
  TextItem,
  TextMarkedContent,
} from 'pdfjs-dist/types/src/display/api';

@Injectable()
export class AiService {
  private client: Anthropic;
  private readonly MODEL = 'claude-haiku-4-5';
  private readonly MAX_TOKENS = 1024;

  constructor(private readonly s3Service: S3Service) {
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
    const content = await this.extractContent(filePath, url);

    if (!content) {
      throw new BadRequestException('No content found to process.');
    }

    switch (dto.action) {
      case 'summary':
        return this.getSummary(content);
      case 'qna':
        return this.getQnA(content, dto.question);
      case 'flashcards':
        return this.getFlashcards(content);
      case 'quiz':
        return this.getQuiz(content);
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
    if (filePath) {
      return this.extractFromPdf(filePath);
    }
    if (url) {
      return this.extractFromUrl(url);
    }
    return null;
  }

  private async extractFromPdf(fileKey: string): Promise<string> {
    // 👇 GET file from S3 using key
    const s3Object = await this.s3Service.getObject(fileKey);

    const data = new Uint8Array(s3Object.Body as Buffer);

    const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');

    const pdf = await getDocument({ data }).promise;

    const pageTexts: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const pageText = content.items
        .map((item: TextItem | TextMarkedContent) =>
          'str' in item ? item.str : '',
        )
        .join(' ');

      pageTexts.push(pageText);
    }

    return pageTexts.join('\n').trim();
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

  // ─── AI ACTIONS ────────────────────────────────────────────────

  async getSummary(content: string): Promise<AiResult> {
    const prompt = PROMPTS.SUMMARY(content);
    const result = await this.callClaude(prompt);
    return { type: 'summary', data: result };
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
}
