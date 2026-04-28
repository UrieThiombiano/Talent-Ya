import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { authRequired } from "../middleware/auth.js";
import { callClaude } from "../services/claude.js";

const router = Router();

const TOTAL_QUESTIONS = 5;

// ============================================================
//  POST /api/coaching/start
// ============================================================

const startSchema = z.object({
  cv: z.string().min(20).max(15000),
  letter: z.string().max(8000).optional().default(""),
  offer: z.string().min(10).max(10000),
  sector: z.string().min(1),
  sectorName: z.string().min(1),
  country: z.string().min(1).max(100),
});

router.post("/start", authRequired, async (req, res, next) => {
  try {
    const parsed = startSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const { cv, letter, offer, sectorName, country, sector } = parsed.data;

    const prompt = `Un candidat te confie son dossier pour un poste précis.

🎯 PAYS CIBLE — STRICT : ${country}
Tous tes conseils ancrés UNIQUEMENT sur ${country}. Aucune mention d'autres pays africains.

=== CV DU CANDIDAT ===
${cv.substring(0, 3500)}

=== LETTRE (si fournie) ===
${letter.trim() ? letter.substring(0, 2000) : "(non fournie)"}

=== OFFRE D'EMPLOI ===
${offer.substring(0, 2500)}

Secteur : ${sectorName}

Ta mission :
1. Extraire le PRÉNOM du candidat depuis son CV (premier prénom uniquement).
2. Rédiger un BRIEFING chaleureux (80-150 mots) :
   - Salue par prénom avec emoji discret
   - Verdict honnête : tu as ta place / il y a du travail / le gap est sérieux mais jouable
   - Annonce le déroulement (5 questions, 10 min, dossier final)
   - Pose la règle d'or : on ne ment jamais, on valorise le vrai
   - Termine sur une note qui donne envie de démarrer
3. Poser la PREMIÈRE question : la plus importante pour révéler le potentiel sur ce poste précis. Concrète, ouverte.
4. Donner un TIP court (1 phrase).

JSON STRICT :
{
  "prenom": "<prénom extrait>",
  "briefing": "<message d'accueil 80-150 mots>",
  "question": "<la 1ère question>",
  "tip": "<1 phrase d'aide>",
  "focus": "<1 mot-clé qui résume la zone explorée>"
}`;

    const result = await callClaude(prompt, "coach", 1500, country);

    const session = await prisma.coachingSession.create({
      data: {
        userId: req.userId,
        cv, letter, offer, sector, sectorName, country,
        prenom: result.prenom || "",
        state: "questioning",
        questions: [{ q: result.question, tip: result.tip, focus: result.focus, a: null }],
        questionIndex: 0,
      },
    });

    res.json({
      sessionId: session.id,
      prenom: result.prenom,
      briefing: result.briefing,
      question: result.question,
      tip: result.tip,
      questionNum: 1,
      total: TOTAL_QUESTIONS,
    });
  } catch (e) { next(e); }
});

// ============================================================
//  POST /api/coaching/answer
// ============================================================

const answerSchema = z.object({
  sessionId: z.string().min(1),
  answer: z.string().min(1).max(3000),
});

router.post("/answer", authRequired, async (req, res, next) => {
  try {
    const parsed = answerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const session = await prisma.coachingSession.findFirst({
      where: { id: parsed.data.sessionId, userId: req.userId },
    });
    if (!session) return res.status(404).json({ error: "Session introuvable" });
    if (session.state !== "questioning") {
      return res.status(400).json({ error: "Session déjà finalisée" });
    }

    const questions = [...session.questions];
    questions[session.questionIndex].a = parsed.data.answer.trim();
    const nextIndex = session.questionIndex + 1;

    if (nextIndex >= TOTAL_QUESTIONS) {
      await prisma.coachingSession.update({
        where: { id: session.id },
        data: { questions, questionIndex: nextIndex, state: "ready" },
      });
      return res.json({ done: true });
    }

    const histo = questions
      .map((q, i) => `Q${i + 1}: ${q.q}\nR: ${q.a || "(en attente)"}`)
      .join("\n\n");

    const prompt = `Tu coaches ${session.prenom} pour le poste suivant (PAYS CIBLE STRICT : ${session.country}) :

=== OFFRE ===
${session.offer.substring(0, 2000)}

=== CV ===
${session.cv.substring(0, 2500)}

=== CONVERSATION ===
${histo}

Tu viens de recevoir sa réponse à la question ${session.questionIndex + 1}/${TOTAL_QUESTIONS}.

Mission :
1. RÉAGIR brièvement (2-3 phrases). Naturel, chaleureux. Valorise un détail OU recadre si flou.
2. POSER la question ${nextIndex + 1}/${TOTAL_QUESTIONS}, ADAPTATIVE selon ce qu'il vient de dire et ce qui reste à explorer pour ce poste précis.
3. TIP court (1 phrase).
4. FOCUS : 1 mot-clé.

JSON STRICT :
{
  "reaction": "<2-3 phrases en réaction, en utilisant ${session.prenom}>",
  "question": "<la question ${nextIndex + 1}>",
  "tip": "<1 phrase d'aide>",
  "focus": "<1 mot-clé>"
}`;

    const result = await callClaude(prompt, "coach", 1200, session.country);

    questions.push({ q: result.question, tip: result.tip, focus: result.focus, a: null });

    await prisma.coachingSession.update({
      where: { id: session.id },
      data: { questions, questionIndex: nextIndex },
    });

    res.json({
      done: false,
      reaction: result.reaction,
      question: result.question,
      tip: result.tip,
      questionNum: nextIndex + 1,
      total: TOTAL_QUESTIONS,
    });
  } catch (e) { next(e); }
});

// ============================================================
//  POST /api/coaching/finalize
// ============================================================

const finalizeSchema = z.object({ sessionId: z.string().min(1) });

router.post("/finalize", authRequired, async (req, res, next) => {
  try {
    const parsed = finalizeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const session = await prisma.coachingSession.findFirst({
      where: { id: parsed.data.sessionId, userId: req.userId },
    });
    if (!session) return res.status(404).json({ error: "Session introuvable" });
    if (session.state === "finalized" && session.deliverable) {
      return res.json({ deliverable: session.deliverable });
    }
    if (session.state !== "ready") {
      return res.status(400).json({ error: "Session non prête à finaliser" });
    }

    const histo = session.questions
      .map((q, i) => `Q${i + 1} (${q.focus}): ${q.q}\nR: ${q.a}`)
      .join("\n\n");

    const prompt = `Tu finalises le dossier de candidature de ${session.prenom}.

🎯 PAYS CIBLE — STRICT : ${session.country}
TOUT ton livrable ancré UNIQUEMENT sur ${session.country}. Aucune mention d'autres pays africains.

=== OFFRE ===
${session.offer.substring(0, 2500)}

=== CV ORIGINAL ===
${session.cv.substring(0, 3500)}

=== LETTRE ORIGINALE (si fournie) ===
${session.letter ? session.letter.substring(0, 2000) : "(non fournie)"}

=== CONVERSATION DE COACHING (5 réponses confirmées) ===
${histo}

Secteur : ${session.sectorName}

Mission : produire le LIVRABLE FINAL.

CONTRAINTES ABSOLUES :
- Tout ce que tu écris dans CV optimisé et lettre doit être TRAÇABLE soit au CV original, soit aux réponses confirmées par ${session.prenom}.
- Pas de chiffres inventés. Pas de techno absente. Pas d'expérience fabriquée.
- Si gap (ex: outil demandé mais absent du CV ET non confirmé), il va dans "plan_action" comme objectif d'apprentissage, JAMAIS dans le CV.
- Conseils culturels et références : ${session.country} UNIQUEMENT.

Structure :

1. MOT DU COACH chaleureux (50-80 mots), parle directement à ${session.prenom}, ancré dans son vrai profil.
2. CV OPTIMISÉ (texte complet, sections claires, markdown léger ## autorisé).
3. LETTRE DE MOTIVATION (300-400 mots, structure 3 temps : pourquoi vous / pourquoi cette org / ce que vous apportez).
4. PLAN D'ACTION 14 JOURS (3-5 actions concrètes pour les VRAIS gaps, ressources gratuites).
5. PRÉPARATION ENTRETIEN (3 questions probables avec point d'ancrage dans le profil RÉEL).
6. CALL TO ACTION (50-80 mots, motivant, exigeant).

JSON STRICT :
{
  "mot_coach": "<paragraphe ouverture>",
  "cv_optimise": "<texte complet>",
  "lettre_optimisee": "<texte complet>",
  "plan_action": [
    {
      "titre": "<titre>",
      "objectif": "<pourquoi c'est important>",
      "etapes": ["<étape 1>", "<étape 2>", "<étape 3>"],
      "delai": "<ex: J1-J3>",
      "ressource": "<lien ou nom>"
    }
  ],
  "preparation_entretien": [
    {
      "question": "<question probable>",
      "comment_repondre": "<méthode + ancrage dans le profil réel, 2-3 phrases>"
    }
  ],
  "call_to_action": "<paragraphe final>"
}`;

    const result = await callClaude(prompt, "coach", 4000, session.country);

    await prisma.coachingSession.update({
      where: { id: session.id },
      data: { deliverable: result, state: "finalized", finalizedAt: new Date() },
    });

    res.json({ deliverable: result });
  } catch (e) { next(e); }
});

// ============================================================
//  GET sessions
// ============================================================

router.get("/sessions", authRequired, async (req, res, next) => {
  try {
    const items = await prisma.coachingSession.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true, prenom: true, sector: true, sectorName: true, country: true,
        state: true, createdAt: true, finalizedAt: true,
      },
    });
    res.json({ items });
  } catch (e) { next(e); }
});

router.get("/session/:id", authRequired, async (req, res, next) => {
  try {
    const session = await prisma.coachingSession.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!session) return res.status(404).json({ error: "Session introuvable" });
    res.json({ session });
  } catch (e) { next(e); }
});

export default router;
