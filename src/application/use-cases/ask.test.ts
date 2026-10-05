import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ask } from "@/application/use-cases/ask";
import type { AnswerProvider } from "@/application/ports/answer-provider.port";
import { MAX_QUESTION_LENGTH } from "@/domain/chat/message";

const spy = (): AnswerProvider & { asked: string[] } => {
  const asked: string[] = [];
  return {
    asked,
    async answer(question) {
      asked.push(question);
      return { body: "respuesta", topic: "identity", source: "knowledge-base", related: [] };
    },
  };
};

describe("ask", () => {
  it("passes a trimmed question to the provider", async () => {
    const provider = spy();
    await ask(provider, "  quien es alejandro  ");
    assert.deepEqual(provider.asked, ["quien es alejandro"]);
  });

  it("never reaches the provider when the question is too short", async () => {
    const provider = spy();
    const result = await ask(provider, "a");
    assert.deepEqual(provider.asked, []);
    assert.equal(result.source, "fallback");
  });

  it("never reaches the provider when the question is too long", async () => {
    const provider = spy();
    const result = await ask(provider, "a".repeat(MAX_QUESTION_LENGTH + 1));
    assert.deepEqual(provider.asked, []);
    assert.equal(result.source, "fallback");
  });
});
