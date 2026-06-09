export type AiAction = 'summary' | 'qna' | 'chat' | 'flashcards' | 'quiz';

export class AiRequestDto {
  action!: AiAction;

  workspaceId!: string;

  assetId!: string;

  question?: string;

  history?: { role: string; text: string }[];
}
