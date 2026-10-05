export type Topic =
  | "identity"
  | "experience"
  | "frontend"
  | "backend"
  | "infrastructure"
  | "cloud"
  | "industry"
  | "education"
  | "languages"
  | "availability"
  | "site";

export type Answer = {
  topic: Topic;
  question: string;
  body: string;
  keywords: string[];
};

export type AnswerSource = "knowledge-base" | "model" | "fallback";

export type AnswerResult = {
  body: string;
  topic: Topic | null;
  source: AnswerSource;
  related: string[];
};
