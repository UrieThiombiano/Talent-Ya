import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn("⚠️  ANTHROPIC_API_KEY non définie — les appels IA échoueront");
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYS_JSON = "Tu es un expert RH et coach en recrutement spécialisé sur le marché africain (Afrique de l'Ouest, Centrale, Est). Tu connais les codes culturels, les attentes des recruteurs locaux et internationaux opérant en Afrique, les bailleurs de fonds, les ONG, les multinationales et le tissu PME. Réponds UNIQUEMENT en JSON valide, sans texte avant ou après, sans backticks markdown.";

const SYS_TEXT = "Tu es un expert RH et coach en recrutement spécialisé sur le marché africain. Réponds en français, de manière concrète, actionnable, en tenant compte des réalités locales (Burkina Faso, Sénégal, Côte d'Ivoire, Mali, Cameroun, Kenya, etc.).";

export async function callClaude(prompt, jsonMode = true, maxTokens = 1500) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: maxTokens,
    system: jsonMode ? SYS_JSON : SYS_TEXT,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content
    .filter(b => b.type === "text")
    .map(b => b.text)
    .join("");

  if (jsonMode) {
    const clean = text.replace(/```json|```/g, "").trim();
    try {
      return JSON.parse(clean);
    } catch (e) {
      console.error("Parse JSON échoué :", clean);
      throw new Error("Réponse IA invalide");
    }
  }
  return text;
}
