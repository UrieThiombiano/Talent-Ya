import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { authRequired } from "../middleware/auth.js";
import { callClaude } from "../services/claude.js";

const router = Router();

const startSchema = z.object({
  poste: z.string().min(2).max(150),
  sectorName: z.string().min(1),
});

router.post("/start", authRequired, async (req, res, next) => {
  try {
    const parsed = startSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const { poste, sectorName } = parsed.data;

    const result = await callClaude(
      `Tu joues un recruteur exigeant pour le poste "${poste}" dans le secteur ${sectorName}, sur le marché africain. Pose ta première question d'entretien (concrète, professionnelle, en français, 2 phrases max). Pas de salutations longues. JSON : {"q":"<ta question>"}`,
      true
    );

    res.json({ question: result.q });
  } catch (e) { next(e); }
});

const messageSchema = z.object({
  poste: z.string().min(2).max(150),
  history: z.array(z.object({
    role: z.enum(["user", "ai"]),
    text: z.string().max(2000),
  })).max(20),
});

router.post("/message", authRequired, async (req, res, next) => {
  try {
    const parsed = messageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const { poste, history } = parsed.data;

    const histo = history
      .map(m => `${m.role === "ai" ? "Recruteur" : "Candidat"}: ${m.text}`)
      .join("\n");

    const result = await callClaude(
      `Tu joues un recruteur exigeant pour "${poste}". Voici l'échange jusqu'ici :\n${histo}\n\nRéagis brièvement (1 phrase max, optionnel) puis pose la question suivante (creuse, concrète, adaptée au contexte africain). JSON : {"q":"<ta réplique complète>"}`,
      true
    );

    res.json({ question: result.q });
  } catch (e) { next(e); }
});

const finalizeSchema = z.object({
  poste: z.string().min(2).max(150),
  sector: z.string().min(1),
  history: z.array(z.object({
    role: z.enum(["user", "ai"]),
    text: z.string().max(2000),
  })).min(2).max(20),
});

router.post("/finalize", authRequired, async (req, res, next) => {
  try {
    const parsed = finalizeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const { poste, sector, history } = parsed.data;

    const histo = history
      .map(m => `${m.role === "ai" ? "Recruteur" : "Candidat"}: ${m.text}`)
      .join("\n");

    const verdict = await callClaude(
      `Tu es recruteur africain expérimenté. Voici l'entretien pour le poste "${poste}" :\n${histo}\n\nDonne ton verdict honnête. JSON :
{"score":<0-100>, "decision":"retenu|en_attente|rejete", "feedback":"<3 phrases franches sur la performance>","points_forts":["<2 points>"],"a_travailler":["<2 points>"]}`,
      true
    );

    await prisma.simulation.create({
      data: {
        userId: req.userId,
        poste,
        sector,
        score: verdict.score,
        decision: verdict.decision,
        feedbackJson: verdict,
      },
    });

    res.json({ verdict });
  } catch (e) { next(e); }
});

export default router;
