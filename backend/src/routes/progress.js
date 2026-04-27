import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/", authRequired, async (req, res, next) => {
  try {
    const [analyses, simulations, moduleProgress] = await Promise.all([
      prisma.analysis.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: "desc" },
        take: 30,
        select: {
          id: true, sector: true, country: true, scoreGlobal: true,
          verdict: true, createdAt: true,
        },
      }),
      prisma.simulation.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: "desc" },
        take: 30,
        select: {
          id: true, poste: true, sector: true, score: true,
          decision: true, createdAt: true,
        },
      }),
      prisma.moduleProgress.findMany({
        where: { userId: req.userId },
        select: { moduleId: true, completedAt: true },
      }),
    ]);

    // Historique de scores combiné (analyses + simulations) pour le graphe
    const scoreHistory = [
      ...analyses.map(a => ({ date: a.createdAt, score: a.scoreGlobal, type: "analysis" })),
      ...simulations.map(s => ({ date: s.createdAt, score: s.score, type: "simulation" })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 30);

    res.json({
      analyses,
      simulations,
      modulesDone: moduleProgress.map(m => m.moduleId),
      scoreHistory,
    });
  } catch (e) { next(e); }
});

const moduleSchema = z.object({
  moduleId: z.string().min(1).max(60),
});

router.post("/module/complete", authRequired, async (req, res, next) => {
  try {
    const parsed = moduleSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    await prisma.moduleProgress.upsert({
      where: {
        userId_moduleId: { userId: req.userId, moduleId: parsed.data.moduleId },
      },
      create: { userId: req.userId, moduleId: parsed.data.moduleId },
      update: {},
    });

    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
