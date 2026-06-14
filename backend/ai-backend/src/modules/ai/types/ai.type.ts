// src/ai/types/ai.types.ts

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

export interface ChatHistory {
  role: string;
  text: string;
}
