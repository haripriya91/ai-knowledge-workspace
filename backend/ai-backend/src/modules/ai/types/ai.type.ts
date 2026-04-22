// src/ai/types/ai.types.ts

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

export interface ChatHistory {
  role: string;
  text: string;
}
