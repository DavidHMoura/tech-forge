export type QuestionType = 'profile' | 'technical_base' | 'specialty';

export interface Option {
  text: string;
  weight?: Record<string, number>;
  correct?: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: Option[];
}

export interface UserStats {
  logic: number;
  resilience: number;
  infraBase: number;
  hoursPerDay: number;
}