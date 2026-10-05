import type { Answer } from "./answer";
import { normalise, tokenise } from "./text";

export type Match = {
  answer: Answer;
  score: number;
};

const MINIMUM_SCORE = 0.5;
const PREFIX_FLOOR = 4;

function keywordsOf(answer: Answer): Set<string> {
  return new Set(answer.keywords.map((keyword) => normalise(keyword)).filter(Boolean));
}

function documentFrequency(answers: Answer[]): Map<string, number> {
  const frequency = new Map<string, number>();

  for (const answer of answers) {
    for (const keyword of keywordsOf(answer)) {
      frequency.set(keyword, (frequency.get(keyword) ?? 0) + 1);
    }
  }

  return frequency;
}

function matches(keyword: string, tokens: string[]): boolean {
  return tokens.some(
    (token) =>
      token === keyword ||
      (token.length >= PREFIX_FLOOR && keyword.startsWith(token)) ||
      (keyword.length >= PREFIX_FLOOR && token.startsWith(keyword)),
  );
}

export function rank(answers: Answer[], question: string): Match[] {
  const tokens = tokenise(question);
  if (!tokens.length) return [];

  const frequency = documentFrequency(answers);

  return answers
    .map((answer) => {
      let score = 0;

      for (const keyword of keywordsOf(answer)) {
        if (matches(keyword, tokens)) score += 1 / (frequency.get(keyword) ?? 1);
      }

      return { answer, score };
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score);
}

export function bestMatch(answers: Answer[], question: string): Match | null {
  const [top] = rank(answers, question);
  return top && top.score >= MINIMUM_SCORE ? top : null;
}
