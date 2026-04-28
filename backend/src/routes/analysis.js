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

    const prompt = `Analyse cette candidature pour le marché africain.

🎯 PAYS CIBLE — STRICT : ${country}
Tu ancres TOUS tes conseils culturels et exemples sur ${country} UNIQUEMENT.
Aucune mention d'autres pays africains autorisée (sauf si présents dans le CV ou l'offre).

Secteur : ${sectorName}

=== CV ===
${cv.substring(0, 3500)}

=== LETTRE DE MOTIVATION ===
${letter.trim() ? letter.substring(0, 2000) : "(non fournie)"}

=== OFFRE D'EMPLOI ===
${offerText.substring(0, 2500)}

CONTRAINTES ABSOLUES :
1. Pour "ameliorations_contenu" et "phrases_a_ajouter" : reformule UNIQUEMENT ce qui est dans le CV. Aucun chiffre inventé. Aucun outil ajouté.
2. Pour "conseils_culturels" : ancre sur ${country}. AUCUNE mention d'un autre pays africain.
3. "mots_cles_manquants" : OK pour lister les vrais gaps.
4. Si zone floue ("notions de X"), suggère que le candidat précise — n'invente pas.

Renvoie STRICTEMENT ce JSON (aucun texte autour) :
{
  "score_global": <0-100>,
  "score_visuel": <0-100>,
  "score_mots_cles": <0-100>,
  "score_pertinence": <0-100>,
  "score_localisation": <0-100>,
  "verdict": "<une phrase tranchée, 15 mots max>",
  "forces": ["<3 forces ancrées dans le CV>"],
  "faiblesses": ["<3 faiblesses concrètes>"],
  "mots_cles_offre": ["<8 mots-clés de l'offre>"],
  "mots_cles_manquants": ["<5 manquants>"],
  "ameliorations_visuelles": ["<3 conseils mise en forme>"],
  "ameliorations_contenu": ["<4 réécritures FIDÈLES>"],
  "conseils_culturels": ["<2 conseils ancrés sur ${country}>"],
  "phrases_a_ajouter": ["<2 phrases ancrées DANS le CV réel>"],
  "lettre_intro_amelioree": "<accroche améliorée 2-3 lignes>"
}`;

    // Appel avec validation géo activée
    const result = await callClaude(prompt, "json", 2000, country);

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
