import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.js";
import analysisRoutes from "./routes/analysis.js";
import simulationRoutes from "./routes/simulation.js";
import progressRoutes from "./routes/progress.js";
import coachingRoutes from "./routes/coaching.js";

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error("CORS bloqué : origine non autorisée"));
  },
  credentials: true,
}));

app.use(express.json({ limit: "1mb" }));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

app.get("/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

app.use("/api/auth", authRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/simulation", simulationRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/coaching", coachingRoutes);

app.use((req, res) => res.status(404).json({ error: "Route introuvable" }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Erreur serveur",
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Talent-Ya API en écoute sur le port ${PORT}`);
  console.log(`   Env: ${process.env.NODE_ENV || "development"}`);
});
