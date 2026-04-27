import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { authRequired } from "../middleware/auth.js";
import { callClaude } from "../services/claude.js";

const router = Router();

const analysisSchema = z.object({
  cv: z.string().min(20).max(15000),
  letter: z.string().max(8000).optional().default(""),
  offer: z.string().max(10000).optional().default(""),
  offerUrl: z.string().url().optional().or(z.literal("")).default(""),
  sector: z.string().min(1),
  sectorName: z.string().min(1),
  country: z.string().min(1).max(100),
});

router.post("/run", authRequired, async (req, res, next) => {
  try {
    const parsed = analysisSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const { cv, letter, offer, offerUrl, sectorName, country } = parsed.data;

    if (!offer.trim() && !offerUrl.trim()) {
      return res.status(400).json({ error: "L'offre est requise (texte ou URL)" });
    }

    const offerText = offer.trim() || `Offre disponible à l'URL : ${offerUrl}`;

    const prompt = `Analyse cette candidature pour le marché africain (pays cible : ${country}, secteur : ${sectorName}).

=== CV ===
${cv.substring(0, 3500)}

=== LETTRE DE MOTIVATION ===
${letter.trim() ? letter.substring(0, 2000) : "(non fournie)"}

=== OFFRE D'EMPLOI ===
${offerText.substring(0, 2500)}

Renvoie STRICTEMENT ce JSON (aucun texte autour) :
{
  "score_global": <0-100>,
  "score_visuel": <0-100>,
  "score_mots_cles": <0-100>,
  "score_pertinence": <0-100>,
  "score_localisation": <0-100>,
  "verdict": "<une phrase tranchée, 15 mots max>",
  "forces": ["<3 forces concrètes, 1 ligne chacune>"],
  "faiblesses": ["<3 faiblesses concrètes>"],
  "mots_cles_offre": ["<8 mots-clés clés extraits de l'offre>"],
  "mots_cles_manquants": ["<5 mots-clés présents dans l'offre mais absents du CV>"],
  "ameliorations_visuelles": ["<3 conseils mise en forme adaptés au contexte africain>"],
  "ameliorations_contenu": ["<4 réécritures concrètes : avant/après très courts>"],
  "conseils_culturels": ["<2 conseils sur les codes du recruteur ${country}/secteur>"],
  "phrases_a_ajouter": ["<2 phrases prêtes à insérer dans le CV>"],
  "lettre_intro_amelioree": "<si lettre fournie, propose une accroche de 2-3 lignes améliorée ; sinon propose une accroche de lettre adaptée à l'offre>"
}`;

    const result = await callClaude(prompt, true);

    const saved = await prisma.analysis.create({
      data: {
        userId: req.userId,
        sector: parsed.data.sector,
        country,
        scoreGlobal: result.score_global,
        verdict: result.verdict,
        resultJson: result,
      },
    });

    res.json({ id: saved.id, result });
  } catch (e) { next(e); }
});

router.get("/list", authRequired, async (req, res, next) => {
  try {
    const items = await prisma.analysis.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true, sector: true, country: true, scoreGlobal: true,
        verdict: true, createdAt: true,
      },
    });
    res.json({ items });
  } catch (e) { next(e); }
});

router.get("/:id", authRequired, async (req, res, next) => {
  try {
    const analysis = await prisma.analysis.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!analysis) return res.status(404).json({ error: "Analyse introuvable" });
    res.json({ analysis });
  } catch (e) { next(e); }
});

export default router;
