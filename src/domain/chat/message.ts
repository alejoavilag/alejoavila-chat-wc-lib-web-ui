import type { AnswerSource } from "./answer";

export type Author = "visitor" | "assistant";

export type Message = {
  id: string;
  author: Author;
  body: string;
  source?: AnswerSource;
};

export const MAX_QUESTION_LENGTH = 300;

export function isAskable(question: string): boolean {
  const trimmed = question.trim();
  return trimmed.length >= 3 && trimmed.length <= MAX_QUESTION_LENGTH;
}
