// src/app/shared/models/ai.models.ts

export type AiAction = 'summary' | 'qna' | 'flashcards' | 'quiz' | 'chat';

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface AiRequest {
  action: AiAction;
  workspaceId: string;
  question?: string;
  url?: string;
  history?: ChatMessage[];
}

export interface FlashCard {
  question: string;
  answer: string;
}

export interface QuizItem {
  question: string;
  options: string[];
  answer: string;
}

export interface AiResult {
  type: string;
  data: string | FlashCard[] | QuizItem[];
  question?: string;
}