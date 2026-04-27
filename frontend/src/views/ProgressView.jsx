import React, { useState, useEffect } from "react";
import { BarChart3, FileText, Award, TrendingUp } from "lucide-react";
import { api } from "../lib/api.js";

export default function ProgressView({ refreshKey }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.getProgress().then(setData).catch(e => setErr(e.message));
  }, [refreshKey]);

  if (err) return <div className="p-12 text-center text-red-500">Erreur : {err}</div>;
  if (!data) return <div className="p-12 text-center text-gray-400">Chargement…</div>;

  const allScores = data.scoreHistory || [];
  const avg = allScores.length ? Math.round(allScores.reduce((s, h) => s + h.score, 0) / allScores.length) : 0;
  const best = allScores.length ? Math.max(...allScores.map(h => h.score)) : 0;
  const trend = allScores.length >= 2 ? allScores[0].score - allScores[allScores.length - 1].score : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Votre progression</h1>
        <p className="text-gray-600">Suivez l'évolution de vos scores au fil des analyses et simulations.</p>
      </div>

      {data.analyses.length === 0 && data.simulations.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold mb-1">Aucune activité pour l'instant</h3>
          <p className="text-sm text-gray-500">Lancez votre première analyse pour voir vos statistiques ici.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Analyses" value={data.analyses.length} icon={FileText} />
            <StatCard label="Score moyen" value={avg} suffix="/100" icon={BarChart3} />
            <StatCard label="Meilleur" value={best} suffix="/100" icon={Award} accent="blue" />
            <StatCard label="Tendance" value={trend > 0 ? `+${trend}` : trend} icon={TrendingUp}
              accent={trend > 0 ? "green" : trend < 0 ? "red" : "default"} />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-semibold mb-4">Évolution des scores</h3>
            <ScoreChart history={[...allScores].reverse()} />
          </div>

          {data.analyses.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-semibold mb-4">Historique des analyses</h3>
              <div className="space-y-2">
                {data.analyses.map(a => (
                  <div key={a.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${a.scoreGlobal >= 75 ? "bg-green-100 text-green-700" : a.scoreGlobal >= 55 ? "bg-blue-100 text-blue-700" : a.scoreGlobal >= 35 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                      {a.scoreGlobal}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{a.verdict}</div>
                      <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-gray-100 rounded">{a.sector}</span>
                        <span>{a.country}</span>
                        <span>· {new Date(a.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.simulations.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-semibold mb-4">Historique des simulations</h3>
              <div className="space-y-2">
                {data.simulations.map(s => {
                  const dec = { retenu: "text-green-700 bg-green-50", en_attente: "text-yellow-700 bg-yellow-50", rejete: "text-red-700 bg-red-50" }[s.decision] || "text-gray-700 bg-gray-50";
                  return (
                    <div key={s.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${s.score >= 75 ? "bg-green-100 text-green-700" : s.score >= 55 ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
                        {s.score}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{s.poste}</div>
                        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2 flex-wrap">
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
  const c = { default: "text-black", blue: "text-blue-600", red: "text-red-600", green: "text-green-600" }[accent];
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</span>
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div className={`text-3xl font-bold ${c}`}>{value}<span className="text-sm text-gray-400 font-normal">{suffix}</span></div>
    </div>
  );
}

function ScoreChart({ history }) {
  if (history.length === 0) return <p className="text-sm text-gray-400">Pas encore de données.</p>;
  const w = 600, h = 160, pad = 20;
  const xs = history.map((_, i) => pad + (i * (w - 2 * pad)) / Math.max(1, history.length - 1));
  const ys = history.map(p => h - pad - (p.score / 100) * (h - 2 * pad));
  const path = history.map((_, i) => `${i === 0 ? "M" : "L"} ${xs[i]} ${ys[i]}`).join(" ");
  const area = `${path} L ${xs[xs.length - 1]} ${h - pad} L ${xs[0]} ${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40">
      <defs>
        <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#dc2626" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 25, 50, 75, 100].map(g => (
        <line key={g} x1={pad} y1={h - pad - (g / 100) * (h - 2 * pad)} x2={w - pad} y2={h - pad - (g / 100) * (h - 2 * pad)} stroke="#f3f4f6" strokeWidth="1" />
      ))}
      <path d={area} fill="url(#grad)" />
      <path d={path} stroke="#dc2626" strokeWidth="2" fill="none" strokeLinecap="round" />
      {history.map((p, i) => (
        <circle key={i} cx={xs[i]} cy={ys[i]} r="3" fill="white" stroke="#dc2626" strokeWidth="2" />
      ))}
    </svg>
  );
}
