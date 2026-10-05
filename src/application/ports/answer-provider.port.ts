import type { AnswerResult } from "@/domain/chat/answer";

export interface AnswerProvider {
  answer(question: string): Promise<AnswerResult>;
}
