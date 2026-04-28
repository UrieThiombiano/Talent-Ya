import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { authRequired } from "../middleware/auth.js";
import { callClaude } from "../services/claude.js";

const router = Router();

const TOTAL_QUESTIONS = 5;

// ============================================================
//  POST /api/coaching/start
//  Lit CV + offre, produit briefing chaleureux + 1ère question
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

    const prompt = `Un candidat te confie son dossier pour t'aider à le préparer pour un poste précis.

=== CV DU CANDIDAT ===
${cv.substring(0, 3500)}

=== LETTRE (si fournie) ===
${letter.trim() ? letter.substring(0, 2000) : "(non fournie)"}

=== OFFRE D'EMPLOI ===
${offer.substring(0, 2500)}

Pays : ${country} · Secteur : ${sectorName}

Ta mission :
1. Extraire le PRÉNOM du candidat depuis son CV (premier prénom uniquement, ex: "Issaka").
2. Rédiger un BRIEFING chaleureux et motivant qui :
   - Le salue par son prénom avec un petit emoji discret
   - Lui dit clairement le verdict honnête : "tu as ta place / il y a du travail / le gap est sérieux mais jouable"
   - Lui annonce le déroulement (5 questions, 10 min, dossier final)
   - Pose la règle d'or : "on ne ment jamais, on valorise le vrai"
   - Termine par une phrase qui donne envie de démarrer
   - Ton : grand frère pro, pas sirupeux, pas froid. Phrases qui respirent.
3. Poser la PREMIÈRE question : la plus importante pour révéler le potentiel caché du candidat sur ce poste précis. Question concrète, ouverte, qui demande du "comment / qu'est-ce que / raconte-moi".
4. Donner un TIP court (1 phrase) pour aider à bien répondre.

JSON STRICT :
{
  "prenom": "<prénom extrait>",
  "briefing": "<message d'accueil, 80-150 mots, structuré, chaleureux et exigeant>",
  "question": "<la 1ère question>",
  "tip": "<1 phrase d'aide pour bien répondre>",
  "focus": "<1 mot-clé qui résume la zone explorée par cette question, ex: experience_react, projets_concrets, langues, leadership>"
}`;

    const result = await callClaude(prompt, "coach", 1500);

    const session = await prisma.coachingSession.create({
      data: {
        userId: req.userId,
        cv,
        letter,
        offer,
        sector,
        sectorName,
        country,
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
//  Reçoit la réponse, adapte la question suivante OU passe à finalize
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

    // Enregistrer la réponse à la question courante
    const questions = [...session.questions];
    questions[session.questionIndex].a = parsed.data.answer.trim();

    const nextIndex = session.questionIndex + 1;

    // Si on a fini les questions, on passe en "ready"
    if (nextIndex >= TOTAL_QUESTIONS) {
      await prisma.coachingSession.update({
        where: { id: session.id },
        data: {
          questions,
          questionIndex: nextIndex,
          state: "ready",
        },
      });
      return res.json({ done: true });
    }

    // Sinon, générer la question suivante adaptative
    const conversationHistory = questions
      .map((q, i) => `Q${i + 1}: ${q.q}\nR: ${q.a || "(en attente)"}`)
      .join("\n\n");

    const prompt = `Tu coaches un candidat (prénom : ${session.prenom}) pour le poste suivant :
=== OFFRE ===
${session.offer.substring(0, 2000)}

=== CV DU CANDIDAT ===
${session.cv.substring(0, 2500)}

=== CONVERSATION JUSQU'ICI ===
${conversationHistory}

Tu viens de recevoir sa réponse à la question ${session.questionIndex + 1}/${TOTAL_QUESTIONS}.

Mission :
1. RÉAGIR brièvement à sa dernière réponse (2-3 phrases max). Sois naturel et chaleureux : valorise un détail, ou recadre gentiment si la réponse est floue/trop courte. Cette réaction sera affichée AU-DESSUS de la prochaine question.
2. POSER la question ${nextIndex + 1}/${TOTAL_QUESTIONS}, ADAPTATIVE selon ce qu'il vient de dire et ce qui reste à explorer pour ce poste précis. Évite de répéter une zone déjà explorée. Vise toujours le concret.
3. DONNER un tip court (1 phrase).
4. FOCUS : 1 mot-clé qui résume ce que cette question explore.

JSON STRICT :
{
  "reaction": "<2-3 phrases naturelles en réaction à sa réponse, en utilisant son prénom ${session.prenom}>",
  "question": "<la question ${nextIndex + 1}>",
  "tip": "<1 phrase d'aide>",
  "focus": "<1 mot-clé>"
}`;

    const result = await callClaude(prompt, "coach", 1200);

    questions.push({ q: result.question, tip: result.tip, focus: result.focus, a: null });

    await prisma.coachingSession.update({
      where: { id: session.id },
      data: {
        questions,
        questionIndex: nextIndex,
      },
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
//  Produit le livrable final : CV optimisé + lettre + plan + entretien
// ============================================================

const finalizeSchema = z.object({
  sessionId: z.string().min(1),
});

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

    const conversationHistory = session.questions
      .map((q, i) => `Q${i + 1} (${q.focus}): ${q.q}\nR: ${q.a}`)
      .join("\n\n");

    const prompt = `Tu finalises un dossier de candidature pour ${session.prenom}.

=== OFFRE ===
${session.offer.substring(0, 2500)}

=== CV ORIGINAL ===
${session.cv.substring(0, 3500)}

=== LETTRE ORIGINALE (si fournie) ===
${session.letter ? session.letter.substring(0, 2000) : "(non fournie)"}

=== CONVERSATION DE COACHING (5 réponses du candidat) ===
${conversationHistory}

Pays : ${session.country} · Secteur : ${session.sectorName}

Ta mission : produire le LIVRABLE FINAL — un dossier qui maximise les chances de ${session.prenom}.

CONTRAINTE ABSOLUE :
- Tout ce que tu écris dans le CV optimisé et la lettre doit être TRAÇABLE soit au CV original, soit aux réponses confirmées par ${session.prenom}.
- Pas de chiffres inventés. Pas de techno absente. Pas d'expérience fabriquée.
- Si un gap existe (ex: TypeScript demandé mais absent du CV ET non confirmé en réponse), il va dans "plan_action" comme objectif d'apprentissage, JAMAIS dans le CV.

Structure ton livrable :

1. MOT DU COACH (chaleureux, 50-80 mots, parle directement à ${session.prenom}, valorise ce qui est ressorti de l'échange, motive pour la suite — ancré dans son vrai profil).

2. CV OPTIMISÉ (texte complet, prêt à copier, structure pro avec sections claires : Profil, Expérience, Formation, Compétences, Langues. Markdown léger autorisé, ## pour sections).

3. LETTRE DE MOTIVATION (300-400 mots, structurée en 3 temps : pourquoi vous / pourquoi cette org / ce que vous apportez. Personnalisée, sans "humblement", "prestigieuse", ton direct et professionnel).

4. PLAN D'ACTION 14 JOURS (3 à 5 actions concrètes : ressources gratuites, micro-projets, deadlines courtes pour combler les VRAIS gaps détectés. Chaque action a un titre, des étapes, un délai).

5. PRÉPARATION ENTRETIEN (3 questions probables que le recruteur posera pour ce poste précis, avec pour chacune un point d'ancrage à mettre en avant — basé sur les réponses du candidat).

6. CALL TO ACTION FINAL (1 paragraphe motivant, exigeant, 50-80 mots, qui termine sur une note d'urgence positive : "tu vas y arriver, va chercher ce poste").

JSON STRICT :
{
  "mot_coach": "<paragraphe ouverture chaleureux>",
  "cv_optimise": "<texte complet du CV réécrit, en markdown>",
  "lettre_optimisee": "<texte complet de la lettre>",
  "plan_action": [
    {
      "titre": "<titre court de l'action>",
      "objectif": "<pourquoi c'est important pour ce poste>",
      "etapes": ["<étape 1>", "<étape 2>", "<étape 3>"],
      "delai": "<ex: J1-J3>",
      "ressource": "<lien ou nom de ressource gratuite si pertinent>"
    }
  ],
  "preparation_entretien": [
    {
      "question": "<question probable>",
      "comment_repondre": "<méthode + ancrage dans le profil réel du candidat, 2-3 phrases>"
    }
  ],
  "call_to_action": "<paragraphe motivant final>"
}`;

    const result = await callClaude(prompt, "coach", 4000);

    await prisma.coachingSession.update({
      where: { id: session.id },
      data: {
        deliverable: result,
        state: "finalized",
        finalizedAt: new Date(),
      },
    });

    res.json({ deliverable: result });
  } catch (e) { next(e); }
});

// ============================================================
//  GET /api/coaching/sessions — historique
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
