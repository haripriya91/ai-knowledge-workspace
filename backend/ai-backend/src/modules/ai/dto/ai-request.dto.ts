export type AiAction = 'summary' | 'qna' | 'chat' | 'flashcards' | 'quiz';

export class AiRequestDto {
  action!: AiAction;
  workspaceId!: string;
  filePath?: string; // S3 URL
  url?: string;
  question?: string;
  history?: { role: string; text: string }[];
}
