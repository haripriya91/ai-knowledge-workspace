// src/ai/dto/ai-request.dto.ts
import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';

export type AiAction = 'summary' | 'qna' | 'flashcards' | 'quiz' | 'chat';

export class AiRequestDto {
  @IsEnum(['summary', 'qna', 'flashcards', 'quiz', 'chat'])
  action!: AiAction; // ← added ! (definite assignment assertion)

  @IsString()
  workspaceId!: string; // ← added !

  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsString()
  url?: string; // ← moved URL here from controller (fixes the `any` cast problem)

  @IsOptional()
  @IsArray()
  history?: { role: string; text: string }[];
}
