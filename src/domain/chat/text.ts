const STOPWORDS = new Set([
  "que", "como", "cual", "cuales", "cuanto", "cuantos", "donde", "quien", "para",
  "por", "con", "del", "los", "las", "una", "uno", "sus", "este", "esta", "esto",
  "tiene", "tienes", "sabe", "sabes", "hace", "haces", "esta", "estas", "the",
  "and", "for", "with", "does", "has", "have", "what", "which", "who", "how",
  "experiencia", "experience", "cuentame", "dime", "puede", "puedes", "pueden",
  "trabaja", "trabajado", "conoce", "maneja", "sobre", "algo", "tambien",
]);

export function normalise(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenise(text: string): string[] {
  return normalise(text)
    .split(" ")
    .filter((word) => word.length >= 3 && !STOPWORDS.has(word));
}
