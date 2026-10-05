import type { AnswerProvider } from "@/application/ports/answer-provider.port";
import type { AnswerResult } from "@/domain/chat/answer";
import { isAskable, MAX_QUESTION_LENGTH } from "@/domain/chat/message";

const TOO_SHORT =
  "Escribe un poco más para que pueda entenderte. Por ejemplo: ¿qué experiencia tiene en Terraform?";

const TOO_LONG = `La pregunta supera los ${MAX_QUESTION_LENGTH} caracteres. Hazla más corta y vuelve a intentar.`;

export async function ask(
  provider: AnswerProvider,
  question: string,
): Promise<AnswerResult> {
  const trimmed = question.trim();

  if (!isAskable(trimmed)) {
    return {
      body: trimmed.length > MAX_QUESTION_LENGTH ? TOO_LONG : TOO_SHORT,
      topic: null,
      source: "fallback",
      related: [],
    };
  }

  return provider.answer(trimmed);
}
