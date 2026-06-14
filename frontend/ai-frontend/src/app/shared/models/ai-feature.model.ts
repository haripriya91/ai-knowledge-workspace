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

  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };

  answer: 'A' | 'B' | 'C' | 'D';

  hint: string;

  explanation: string;
}

export interface AiResult {
  type: string;
  data: string | FlashCard[] | QuizItem[];
  question?: string;
}