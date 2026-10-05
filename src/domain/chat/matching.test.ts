import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Answer } from "@/domain/chat/answer";
import { bestMatch, rank } from "@/domain/chat/matching";
import { normalise, tokenise } from "@/domain/chat/text";
import { PROFILE_ANSWERS } from "@/infrastructure/knowledge/profile-answers";

describe("normalise", () => {
  it("strips accents, case and punctuation", () => {
    assert.equal(normalise("¿Cuántos AÑOS?"), "cuantos anos");
  });
});

describe("tokenise", () => {
  it("drops stopwords and words shorter than three letters", () => {
    assert.deepEqual(tokenise("¿Qué experiencia tiene en Terraform?"), ["terraform"]);
  });

  it("returns nothing for a question made only of stopwords", () => {
    assert.deepEqual(tokenise("que tiene"), []);
  });
});

describe("rank", () => {
  const answers: Answer[] = [
    { topic: "backend", question: "", body: "", keywords: ["nestjs", "api"] },
    { topic: "frontend", question: "", body: "", keywords: ["angular", "api"] },
  ];

  it("weights a keyword by how many answers share it", () => {
    const [top] = rank(answers, "nestjs");
    assert.equal(top?.score, 1);

    const [shared] = rank(answers, "api");
    assert.equal(shared?.score, 0.5);
  });

  it("matches keywords written with accents against a plain question", () => {
    const accented: Answer[] = [
      { topic: "experience", question: "", body: "", keywords: ["años"] },
    ];
    assert.equal(rank(accented, "cuantos anos lleva").length, 1);
  });

  it("ignores answers with no overlap", () => {
    assert.deepEqual(rank(answers, "marte"), []);
  });
});

describe("bestMatch over the published profile", () => {
  const expected: [string, string | null][] = [
    ["¿Qué experiencia tiene en Terraform?", "infrastructure"],
    ["¿Ha trabajado con microfrontends?", "frontend"],
    ["¿Cómo está hecho este sitio?", "site"],
    ["cuantos años de experiencia tiene", "experience"],
    ["habla ingles?", "languages"],
    ["esta disponible para trabajo remoto", "availability"],
    ["que sabe de AWS y lambda", "cloud"],
    ["en que industria trabaja", "industry"],
    ["donde estudio", "education"],
    ["quien es alejandro avila", "identity"],
    ["sabe NestJS?", "backend"],
    ["que opina del clima en marte", null],
  ];

  for (const [question, topic] of expected) {
    it(`answers "${question}" with ${topic ?? "nothing"}`, () => {
      assert.equal(bestMatch(PROFILE_ANSWERS, question)?.answer.topic ?? null, topic);
    });
  }

  it("covers every suggestion the widget offers first", () => {
    const openings = [
      "¿Qué experiencia tiene en Terraform?",
      "¿Ha trabajado con microfrontends?",
      "¿Cómo está hecho este sitio?",
    ];
    for (const opening of openings) {
      assert.ok(bestMatch(PROFILE_ANSWERS, opening), `sin respuesta: ${opening}`);
    }
  });
});
