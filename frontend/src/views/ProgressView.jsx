import React, { useState, useEffect } from "react";
import { BarChart3, FileText, Award, TrendingUp, Sparkles, Target, Zap } from "lucide-react";
import { api } from "../lib/api.js";

export default function ProgressView({ refreshKey }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.getProgress().then(setData).catch(e => setErr(e.message));
  }, [refreshKey]);

  if (err) return <div className="p-12 text-center text-red-500">Erreur : {err}</div>;
  if (!data) return <div className="p-12 text-center text-[var(--pukri-stone)]">Chargement…</div>;

  const allScores = data.scoreHistory || [];
  const avg = allScores.length ? Math.round(allScores.reduce((s, h) => s + h.score, 0) / allScores.length) : 0;
  const best = allScores.length ? Math.max(...allScores.map(h => h.score)) : 0;
  const trend = allScores.length >= 2 ? allScores[0].score - allScores[allScores.length - 1].score : 0;

  // Phrase coach selon le niveau
  const coachMessage = (() => {
    if (allScores.length === 0) return null;
    if (avg >= 75) return { emoji: "🎯", text: "Tu es au niveau entretien. Garde le cap, peaufine les détails." };
    if (avg >= 55) return { emoji: "💪", text: "Tu progresses. Travaille les mots-clés et la lettre pour passer le palier." };
    if (avg >= 35) return { emoji: "🚀", text: "Tu démarres bien. Refais une analyse après chaque modif pour voir ton score grimper." };
    return { emoji: "🌱", text: "On commence. Lance un coaching pour transformer ton dossier en profondeur." };
  })();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold font-display text-[var(--pukri-marine-900)]">Tu progresses comment ?</h1>
        <p className="text-[var(--pukri-stone)]">L'évolution de tes scores au fil des analyses et simulations.</p>
      </div>

      {data.analyses.length === 0 && data.simulations.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-[var(--pukri-mist)] rounded-2xl p-12 text-center">
          <BarChart3 className="w-12 h-12 text-[var(--pukri-fog)] mx-auto mb-3" />
          <h3 className="font-semibold mb-1 text-[var(--pukri-marine-900)]">Pas encore d'activité</h3>
          <p className="text-sm text-[var(--pukri-stone)]">Lance ta première analyse ou ton premier coaching pour voir tes stats ici.</p>
        </div>
      ) : (
        <>
          {/* Coach message */}
          {coachMessage && (
            <div className="bg-gradient-to-r from-[var(--pukri-marine-900)] to-[var(--pukri-marine-800)] text-white rounded-2xl p-5 flex items-start gap-4 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--pukri-orange-400)] rounded-full opacity-20 blur-3xl" />
              <div className="relative w-12 h-12 rounded-xl bg-[var(--pukri-orange-400)] flex items-center justify-center flex-shrink-0 text-2xl">
                {coachMessage.emoji}
              </div>
              <div className="relative flex-1">
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--pukri-cyan-400)] mb-1">Mot du coach</div>
                <p className="leading-relaxed">{coachMessage.text}</p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Analyses" value={data.analyses.length} icon={FileText} accent="marine" />
            <StatCard label="Ton niveau actuel" value={avg} suffix="/100" icon={BarChart3} accent="cyan" />
            <StatCard label="Meilleur score" value={best} suffix="/100" icon={Award} accent="orange" />
            <StatCard
              label="Tendance"
              value={trend > 0 ? `+${trend}` : trend}
              icon={TrendingUp}
              accent={trend > 0 ? "success" : trend < 0 ? "danger" : "default"}
            />
          </div>

          {/* Graphe */}
          <div className="bg-white rounded-2xl border border-[var(--pukri-mist)] p-5">
            <h3 className="font-semibold mb-4 text-[var(--pukri-marine-900)]">Évolution de tes scores</h3>
            <ScoreChart history={[...allScores].reverse()} />
          </div>

          {/* Historique analyses */}
          {data.analyses.length > 0 && (
            <div className="bg-white rounded-2xl border border-[var(--pukri-mist)] p-5">
              <h3 className="font-semibold mb-4 text-[var(--pukri-marine-900)]">Historique des analyses</h3>
              <div className="space-y-2">
                {data.analyses.map(a => (
                  <div key={a.id} className="flex items-center gap-4 p-3 hover:bg-[var(--pukri-snow)] rounded-lg transition">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      a.scoreGlobal >= 75 ? "bg-green-100 text-green-700"
                      : a.scoreGlobal >= 55 ? "bg-[var(--pukri-cyan-50)] text-[var(--pukri-cyan-700)]"
                      : a.scoreGlobal >= 35 ? "bg-[var(--pukri-orange-50)] text-[var(--pukri-orange-700)]"
                      : "bg-red-50 text-red-700"
                    }`}>
                      {a.scoreGlobal}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate text-[var(--pukri-marine-900)]">{a.verdict}</div>
                      <div className="text-xs text-[var(--pukri-stone)] mt-0.5 flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-[var(--pukri-cloud)] rounded">{a.sector}</span>
                        <span>{a.country}</span>
                        <span>· {new Date(a.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historique simulations */}
          {data.simulations.length > 0 && (
            <div className="bg-white rounded-2xl border border-[var(--pukri-mist)] p-5">
              <h3 className="font-semibold mb-4 text-[var(--pukri-marine-900)]">Historique des simulations</h3>
              <div className="space-y-2">
                {data.simulations.map(s => {
                  const dec = {
                    retenu: "text-green-700 bg-green-50",
                    en_attente: "text-[var(--pukri-orange-700)] bg-[var(--pukri-orange-50)]",
                    rejete: "text-red-700 bg-red-50",
                  }[s.decision] || "text-[var(--pukri-stone)] bg-[var(--pukri-cloud)]";
                  return (
                    <div key={s.id} className="flex items-center gap-4 p-3 hover:bg-[var(--pukri-snow)] rounded-lg transition">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        s.score >= 75 ? "bg-green-100 text-green-700"
                        : s.score >= 55 ? "bg-[var(--pukri-cyan-50)] text-[var(--pukri-cyan-700)]"
                        : "bg-red-50 text-red-700"
                      }`}>
                        {s.score}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate text-[var(--pukri-marine-900)]">{s.poste}</div>
                        <div className="text-xs text-[var(--pukri-stone)] mt-0.5 flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded ${dec}`}>{s.decision.replace("_", " ")}</span>
                          <span>· {new Date(s.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, suffix, icon: Icon, accent = "default" }) {
  const colors = {
    default: { text: "text-[var(--pukri-marine-900)]", bg: "bg-[var(--pukri-cloud)]", icon: "text-[var(--pukri-stone)]" },
    cyan: { text: "text-[var(--pukri-cyan-700)]", bg: "bg-[var(--pukri-cyan-50)]", icon: "text-[var(--pukri-cyan-600)]" },
    orange: { text: "text-[var(--pukri-orange-700)]", bg: "bg-[var(--pukri-orange-50)]", icon: "text-[var(--pukri-orange-600)]" },
    marine: { text: "text-[var(--pukri-marine-900)]", bg: "bg-[var(--pukri-marine-50)]", icon: "text-[var(--pukri-marine-800)]" },
    success: { text: "text-green-700", bg: "bg-green-50", icon: "text-green-600" },
    danger: { text: "text-red-700", bg: "bg-red-50", icon: "text-red-600" },
  };
  const c = colors[accent] || colors.default;

  return (
    <div className="bg-white border border-[var(--pukri-mist)] rounded-2xl p-4 hover:shadow-[var(--pukri-shadow-md)] transition">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--pukri-stone)]">{label}</span>
        <div className={`w-7 h-7 rounded-lg ${c.bg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${c.icon}`} />
        </div>
      </div>
      <div className={`text-3xl font-bold font-display ${c.text}`}>
        {value}<span className="text-sm text-[var(--pukri-stone)] font-normal">{suffix}</span>
      </div>
    </div>
  );
}

function ScoreChart({ history }) {
  if (history.length === 0) return <p className="text-sm text-[var(--pukri-stone)]">Pas encore de données.</p>;
  const w = 600, h = 160, pad = 20;
  const xs = history.map((_, i) => pad + (i * (w - 2 * pad)) / Math.max(1, history.length - 1));
  const ys = history.map(p => h - pad - (p.score / 100) * (h - 2 * pad));
  const path = history.map((_, i) => `${i === 0 ? "M" : "L"} ${xs[i]} ${ys[i]}`).join(" ");
  const area = `${path} L ${xs[xs.length - 1]} ${h - pad} L ${xs[0]} ${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40">
      <defs>
        <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f59332" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f59332" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 25, 50, 75, 100].map(g => (
        <line key={g} x1={pad} y1={h - pad - (g / 100) * (h - 2 * pad)} x2={w - pad} y2={h - pad - (g / 100) * (h - 2 * pad)} stroke="#e2e8f0" strokeWidth="1" />
      ))}
      <path d={area} fill="url(#grad)" />
      <path d={path} stroke="#f59332" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {history.map((p, i) => (
        <circle key={i} cx={xs[i]} cy={ys[i]} r="3.5" fill="white" stroke="#f59332" strokeWidth="2" />
      ))}
    </svg>
  );
}
