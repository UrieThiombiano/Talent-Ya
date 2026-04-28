import React, { useState, useEffect } from "react";
import {
  ChevronLeft, ArrowRight, CheckCircle2, FileText, Target, Send,
  Briefcase, Users, GraduationCap, Clock, BookOpen, Sparkles
} from "lucide-react";
import { Btn } from "../components/UI.jsx";
import { MODULES } from "../lib/constants.js";
import { api } from "../lib/api.js";

const ICONS = { FileText, Target, Send, Briefcase, Users, GraduationCap };

// Niveau de chaque module (calculé une fois pour toutes)
const MODULE_LEVELS = {
  "cv-afro": "Débutant",
  "mots-cles": "Intermédiaire",
  "lettre": "Débutant",
  "entretien": "Intermédiaire",
  "linkedin": "Débutant",
  "ong-bailleurs": "Avancé",
};

const MODULE_BENEFITS = {
  "cv-afro": "Obtenir plus d'entretiens",
  "mots-cles": "Passer le filtre ATS",
  "lettre": "Marquer dès la 1ère ligne",
  "entretien": "Décrocher l'offre",
  "linkedin": "Être repéré par les recruteurs",
  "ong-bailleurs": "Décoder le marché ONG",
};

export default function TrainingView() {
  const [active, setActive] = useState(null);
  const [done, setDone] = useState([]);

  useEffect(() => {
    api.getProgress().then(d => setDone(d.modulesDone || [])).catch(() => {});
  }, []);

  async function complete(id) {
    if (done.includes(id)) return;
    setDone([...done, id]);
    try { await api.completeModule(id); } catch {}
  }

  // Vue détail d'un module
  if (active) {
    const m = MODULES.find(x => x.id === active);
    const Icon = ICONS[m.icon] || FileText;
    const isDone = done.includes(active);

    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-up">
        <button onClick={() => setActive(null)}
          className="flex items-center gap-1 text-sm text-[var(--pukri-stone)] hover:text-[var(--pukri-marine-900)] mb-6 transition">
          <ChevronLeft className="w-4 h-4" /> Retour aux modules
        </button>

        {/* Header */}
        <div className="bg-[var(--pukri-marine-900)] text-white rounded-2xl p-6 lg:p-8 mb-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-[var(--pukri-orange-400)] rounded-full opacity-20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[var(--pukri-cyan-500)] rounded-full opacity-15 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-[var(--pukri-orange-400)]" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-[var(--pukri-cyan-400)] font-bold">{m.duration} de lecture</span>
                <span className="text-[10px] text-white/40">·</span>
                <span className="text-[10px] uppercase tracking-wider text-white/60 font-bold">{MODULE_LEVELS[m.id]}</span>
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold font-display mb-3">{m.title}</h1>
            <p className="text-white/75 text-lg">{m.desc}</p>
            <div className="mt-4 inline-flex items-center gap-2 text-xs">
              <Target className="w-3.5 h-3.5 text-[var(--pukri-orange-400)]" />
              <span className="text-[var(--pukri-cyan-400)]">Objectif : {MODULE_BENEFITS[m.id]}</span>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="space-y-4">
          {m.content.map((s, i) => (
            <div key={i} className={`bg-white border border-[var(--pukri-mist)] rounded-2xl p-5 hover:shadow-[var(--pukri-shadow)] transition animate-fade-up delay-${Math.min(i + 1, 5)}`}>
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-bold text-[var(--pukri-orange-600)] flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-bold text-lg text-[var(--pukri-marine-900)]">{s.h}</h3>
              </div>
              <p className="text-[var(--pukri-graphite)] leading-relaxed mt-2 text-sm">{s.p}</p>
            </div>
          ))}
        </div>

        {/* CTA fin de module */}
        <div className="mt-8">
          {isDone ? (
            <div className="flex items-center gap-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl p-4">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <div>
                <div className="font-semibold">Module terminé.</div>
                <div className="text-xs text-green-600 mt-0.5">Tu peux y revenir quand tu veux.</div>
              </div>
            </div>
          ) : (
            <Btn variant="orange" icon={CheckCircle2} className="w-full !py-3" onClick={() => complete(active)}>
              J'ai terminé ce module
            </Btn>
          )}
        </div>
      </div>
    );
  }

  // Vue liste des modules
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-up">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--pukri-cyan-50)] border border-[var(--pukri-cyan-100)] rounded-full text-xs font-bold text-[var(--pukri-cyan-700)] mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          CENTRE DE FORMATION
        </div>
        <h1 className="text-3xl lg:text-5xl font-bold font-display text-[var(--pukri-marine-900)] mb-3">
          Les bonnes pratiques,<br/>pensées pour l'Afrique.
        </h1>
        <p className="text-[var(--pukri-stone)] text-lg max-w-2xl">
          6 modules courts pour t'outiller : CV, lettre, entretien, LinkedIn, ONG/bailleurs.
        </p>

        {/* Progression globale */}
        <div className="mt-6 bg-white border border-[var(--pukri-mist)] rounded-xl p-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold uppercase tracking-wider text-[var(--pukri-stone)]">Ta progression</span>
              <span className="font-bold text-[var(--pukri-marine-900)]">{done.length} / {MODULES.length} modules</span>
            </div>
            <div className="h-2 bg-[var(--pukri-cloud)] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[var(--pukri-cyan-500)] to-[var(--pukri-orange-400)] rounded-full transition-all duration-500"
                style={{ width: `${(done.length / MODULES.length) * 100}%` }} />
            </div>
          </div>
          {done.length === MODULES.length && (
            <div className="flex items-center gap-1.5 text-sm font-bold text-[var(--pukri-orange-600)]">
              <Sparkles className="w-4 h-4" />
              Complet !
            </div>
          )}
        </div>
      </div>

      {/* Grille de modules */}
      <div className="grid md:grid-cols-2 gap-4">
        {MODULES.map((m, i) => {
          const isDone = done.includes(m.id);
          const Icon = ICONS[m.icon] || FileText;
          const level = MODULE_LEVELS[m.id];
          const benefit = MODULE_BENEFITS[m.id];

          return (
            <button key={m.id} onClick={() => setActive(m.id)}
              className={`group text-left bg-white border rounded-2xl p-5 transition-all hover:shadow-[var(--pukri-shadow-lg)] hover:-translate-y-1 animate-fade-up delay-${Math.min(i + 1, 5)} ${
                isDone
                  ? "border-green-200 bg-gradient-to-br from-green-50/30 to-white"
                  : "border-[var(--pukri-mist)] hover:border-[var(--pukri-cyan-200)]"
              }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isDone
                    ? "bg-green-100 text-green-700"
                    : "bg-[var(--pukri-marine-900)] text-[var(--pukri-orange-400)]"
                }`}>
                  {isDone ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[var(--pukri-marine-900)] mb-1 leading-tight">{m.title}</h3>
                  <p className="text-sm text-[var(--pukri-stone)] leading-snug mb-3">{m.desc}</p>

                  {/* Méta-infos */}
                  <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wider font-bold mb-3">
                    <span className="flex items-center gap-1 text-[var(--pukri-stone)]">
                      <Clock className="w-3 h-3" />{m.duration}
                    </span>
                    <span className="text-[var(--pukri-fog)]">·</span>
                    <span className="text-[var(--pukri-cyan-700)]">{level}</span>
                    {isDone && (
                      <>
                        <span className="text-[var(--pukri-fog)]">·</span>
                        <span className="text-green-600">Terminé</span>
                      </>
                    )}
                  </div>

                  {/* Bénéfice */}
                  <div className="text-xs text-[var(--pukri-orange-700)] flex items-center gap-1.5 mb-3">
                    <Target className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Objectif : {benefit}</span>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--pukri-marine-900)] group-hover:text-[var(--pukri-orange-600)] transition">
                      {isDone ? "Revoir le module" : "Commencer"}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[var(--pukri-fog)] group-hover:text-[var(--pukri-orange-600)] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
