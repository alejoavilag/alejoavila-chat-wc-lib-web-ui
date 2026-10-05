import type { AnswerProvider } from "@/application/ports/answer-provider.port";
import type { Answer, AnswerResult } from "@/domain/chat/answer";
import { bestMatch, rank } from "@/domain/chat/matching";
import { PROFILE_ANSWERS } from "./profile-answers";

const UNKNOWN =
  "No tengo esa información en el perfil público. Puedes preguntarme por su experiencia en " +
  "frontend, backend, infraestructura o cloud, por el dominio en el que trabaja, o por cómo " +
  "está construido este sitio.";

function suggestions(answers: Answer[], question: string, exclude: string): string[] {
  const ranked = rank(answers, question)
    .map((match) => match.answer.question)
    .filter((candidate) => candidate !== exclude);

  if (ranked.length >= 2) return ranked.slice(0, 2);

  const fallback = answers.map((answer) => answer.question).filter((q) => q !== exclude);
  return [...new Set([...ranked, ...fallback])].slice(0, 2);
}

export function createLocalAnswerProvider(answers: Answer[] = PROFILE_ANSWERS): AnswerProvider {
  return {
    async answer(question: string): Promise<AnswerResult> {
      const match = bestMatch(answers, question);

      if (!match) {
        return {
          body: UNKNOWN,
          topic: null,
          source: "fallback",
          related: suggestions(answers, question, ""),
        };
      }

      return {
        body: match.answer.body,
        topic: match.answer.topic,
        source: "knowledge-base",
        related: suggestions(answers, question, match.answer.question),
      };
    },
  };
}
