import React, { useState } from "react";
import {
  Sparkles, HeartHandshake, Brain, BookOpen, ArrowRight, CheckCircle2,
  Target, Zap, Users, GraduationCap, Briefcase, Globe, MapPin,
  ChevronDown, ChevronUp, Quote, Star, FileText, MessageCircle,
  TrendingUp, ShieldCheck, Clock
} from "lucide-react";
import { PukriLogo, PukriHeader, PukriFooter, TalentYaBadge, PukriIconSvg } from "../lib/brand.jsx";

// ============================================================
//  Hero
// ============================================================

function Hero({ onCTA }) {
  return (
    <section className="relative overflow-hidden bg-[var(--pukri-marine-900)] text-white">
      {/* Halos atmosphériques style logo PUKRI */}
      <div className="absolute -top-40 -right-32 w-[500px] h-[500px] bg-[var(--pukri-orange-400)] rounded-full opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-[var(--pukri-cyan-500)] rounded-full opacity-15 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-pukri-grid opacity-30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 lg:px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Gauche — texte */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--pukri-cyan-400)] animate-pulse-soft" />
              <span className="text-xs font-semibold text-[var(--pukri-cyan-400)] tracking-wider uppercase">
                Module Talent·Ya · Live
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mb-6">
              Décroche le poste<br />
              <span className="text-[var(--pukri-orange-400)]">qui change tout.</span>
            </h1>

            <p className="text-lg text-white/75 leading-relaxed mb-8 max-w-xl">
              L'agent IA qui transforme ta candidature en dossier solide. Pensé pour les recruteurs africains. Aligné sur ton vrai potentiel.
              <span className="block mt-2 text-[var(--pukri-cyan-400)] font-medium">Pas d'invention. Du toi, en mieux dit.</span>
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <button onClick={onCTA} className="btn-pukri btn-pukri-orange !text-base !py-3.5 !px-6 animate-glow">
                Lance-toi gratuitement
                <ArrowRight className="w-4 h-4" />
              </button>
              <a href="#comment" className="btn-pukri btn-pukri-outline !bg-white/5 !border-white/20 !text-white hover:!bg-white/10 !text-base !py-3.5 !px-6">
                Voir comment ça marche
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-[var(--pukri-cyan-400)] font-display">10+</div>
                <div className="text-xs text-white/50 mt-1 uppercase tracking-wider">Secteurs africains</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[var(--pukri-orange-400)] font-display">14j</div>
                <div className="text-xs text-white/50 mt-1 uppercase tracking-wider">Plan d'action</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white font-display">100%</div>
                <div className="text-xs text-white/50 mt-1 uppercase tracking-wider">Local</div>
              </div>
            </div>
          </div>

          {/* Droite — visuel mockup app */}
          <div className="hidden lg:block relative animate-fade-up delay-2">
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueStrip() {
  const items = [
    "Analyse CV + offre",
    "Simulation recruteur",
    "Coaching personnalisé",
    "Plan d’action concret",
  ];

  return (
    <div className="py-6 bg-white border-y border-[var(--pukri-mist)]">
      <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-6 text-sm text-[var(--pukri-stone)]">
        {items.map((t, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[var(--pukri-cyan-500)] rounded-full" />
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
function HeroMockup() {
  return (
    <div className="relative">
      {/* Ombre derrière le mockup */}
      <div className="absolute inset-0 translate-x-4 translate-y-4 bg-[var(--pukri-orange-400)] rounded-2xl opacity-20 blur-xl" />

      {/* Mockup de l'écran de coaching */}
      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        <div className="px-5 py-3 bg-[var(--pukri-snow)] border-b border-[var(--pukri-mist)] flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="ml-3 text-[10px] text-[var(--pukri-stone)]">talent-ya · Coaching</div>
        </div>

        <div className="p-5 bg-white">
          {/* Barre de progression */}
          <div className="flex items-center gap-2 mb-4 text-xs">
            <span className="text-[var(--pukri-stone)] font-bold uppercase tracking-wider">Question 3 / 5</span>
          </div>
          <div className="h-1.5 bg-[var(--pukri-cloud)] rounded-full overflow-hidden mb-5">
            <div className="h-full w-[60%] bg-gradient-to-r from-[var(--pukri-cyan-500)] to-[var(--pukri-orange-400)] rounded-full" />
          </div>

          {/* Réaction du coach */}
          <div className="bg-[var(--pukri-cyan-50)] border border-[var(--pukri-cyan-100)] rounded-xl p-3 mb-4 flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--pukri-marine-900)] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-[var(--pukri-orange-400)]" />
            </div>
            <p className="text-xs text-[var(--pukri-marine-900)] leading-relaxed">
              <strong>Bien Issaka</strong>, c'est exactement ce que je voulais entendre. Tu as livré du concret, pas du flou.
            </p>
          </div>

          {/* Question */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--pukri-orange-400)] to-[var(--pukri-orange-600)] text-white flex items-center justify-center font-bold flex-shrink-0 text-sm">3</div>
            <h3 className="text-base font-bold text-[var(--pukri-marine-900)] leading-snug font-display">
              Sur ta tontine-app, qu'est-ce qui a fait que tes 12 utilisateurs l'ont gardée 3 mois ?
            </h3>
          </div>

          <div className="bg-[var(--pukri-snow)] border border-[var(--pukri-mist)] rounded-lg p-3 text-xs text-[var(--pukri-stone)] italic">
            Prends ton temps. Sois précis…
          </div>

          <div className="mt-4 flex justify-end">
            <div className="btn-pukri btn-pukri-orange !text-xs !py-2 !px-3">
              Suivant <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 flex items-center gap-2 animate-float">
        <div className="w-8 h-8 rounded-lg bg-[var(--pukri-orange-100)] flex items-center justify-center">
          <CheckCircle2 className="w-4 h-4 text-[var(--pukri-orange-600)]" />
        </div>
        <div>
          <div className="text-xs font-bold text-[var(--pukri-marine-900)]">Score : 87 / 100</div>
          <div className="text-[10px] text-[var(--pukri-stone)]">+25 vs original</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  Pour qui ?
// ============================================================

function PourQui() {
  const profils = [
    { icon: GraduationCap, title: "Étudiant", desc: "1er stage, alternance, contrat junior — démarre fort." },
    { icon: Briefcase, title: "Jeune diplômé", desc: "Premier vrai emploi. On te fait passer le filtre." },
    { icon: Target, title: "En reconversion", desc: "Tu changes de secteur ? On valorise ton transfert." },
    { icon: Globe, title: "Postulant ONG/Bailleurs", desc: "USAID, UE, AFD — on parle leur langue." },
  ];

  return (
    <section className="py-16 lg:py-24 bg-pukri-canvas">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="text-center mb-12 animate-fade-up">
          <div className="text-xs font-bold text-[var(--pukri-cyan-700)] uppercase tracking-[0.2em] mb-3">Pour toi</div>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-[var(--pukri-marine-900)] mb-4">
            Si tu cherches du travail<br />en Afrique, c'est pour toi.
          </h2>
          <p className="text-lg text-[var(--pukri-stone)] max-w-2xl mx-auto">
            Un coach IA qui connaît tes recruteurs, tes secteurs, tes codes culturels.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {profils.map((p, i) => (
            <div key={i} className={`bg-white border border-[var(--pukri-mist)] rounded-2xl p-6 hover:shadow-[var(--pukri-shadow-lg)] hover:-translate-y-1 transition-all animate-fade-up delay-${i + 1}`}>
              <div className="w-12 h-12 rounded-xl bg-[var(--pukri-cyan-50)] flex items-center justify-center mb-4">
                <p.icon className="w-6 h-6 text-[var(--pukri-cyan-600)]" />
              </div>
              <h3 className="font-bold text-[var(--pukri-marine-900)] mb-2">{p.title}</h3>
              <p className="text-sm text-[var(--pukri-stone)] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
//  3 modules-clés
// ============================================================

function Modules({ onCTA }) {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="text-center mb-12 animate-fade-up">
          <div className="text-xs font-bold text-[var(--pukri-orange-600)] uppercase tracking-[0.2em] mb-3">Ce que tu obtiens</div>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-[var(--pukri-marine-900)] mb-4">
            4 outils qui bossent pour toi.
          </h2>
          <p className="text-lg text-[var(--pukri-stone)] max-w-2xl mx-auto">
            Du diagnostic au plan d'action, en passant par la simulation d'entretien.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Analyse */}
          <ModuleCard
            icon={Sparkles}
            title="Analyse"
            tag="Express"
            color="cyan"
            desc="Score, mots-clés, conseils localisés en 20 secondes. Le check rapide avant de postuler."
            features={["Score sur 100", "Mots-clés ATS", "Conseils visuels"]}
          />

          {/* Coaching — featured */}
          <ModuleCard
            icon={HeartHandshake}
            title="Coaching IA"
            tag="Phare"
            color="orange"
            featured
            desc="Dialogue de 10 min avec un coach IA. Tu repars avec un dossier complet : CV, lettre, plan d'action, prep entretien."
            features={["5 questions adaptatives", "CV + lettre réécrits", "Plan d'action 14j"]}
          />

          {/* Simulation */}
          <ModuleCard
            icon={Brain}
            title="Simulation"
            tag="Entretien"
            color="marine"
            desc="Recruteur virtuel, 5 questions, verdict honnête. Pour t'entraîner avant le grand jour."
            features={["Questions sectorielles", "Verdict tranché", "Points à travailler"]}
          />

          {/* Formation */}
          <ModuleCard
            icon={BookOpen}
            title="Formation"
            tag="6 modules"
            color="cyan"
            desc="Les bonnes pratiques pensées pour le marché africain. CV, lettre, LinkedIn, ONG, bailleurs."
            features={["6 modules courts", "Codes africains", "Suivi de progression"]}
          />
        </div>

        <div className="text-center mt-10">
          <button onClick={onCTA} className="btn-pukri btn-pukri-orange !text-base !py-3 !px-6">
            Tester gratuitement
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function ModuleCard({ icon: Icon, title, tag, color, desc, features, featured }) {
  const colorMap = {
    cyan: { bg: "bg-[var(--pukri-cyan-50)]", text: "text-[var(--pukri-cyan-700)]", icon: "text-[var(--pukri-cyan-600)]" },
    orange: { bg: "bg-[var(--pukri-orange-50)]", text: "text-[var(--pukri-orange-700)]", icon: "text-[var(--pukri-orange-600)]" },
    marine: { bg: "bg-[var(--pukri-marine-50)]", text: "text-[var(--pukri-marine-800)]", icon: "text-[var(--pukri-marine-800)]" },
  };
  const c = colorMap[color];
  const cardCls = featured
    ? "bg-white border-2 border-[var(--pukri-orange-400)] shadow-[var(--pukri-shadow-xl)] relative"
    : "bg-white border border-[var(--pukri-mist)] hover:border-[var(--pukri-cyan-200)] hover:-translate-y-1";

  return (
    <div className={`${cardCls} rounded-2xl p-6 transition-all`}>
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--pukri-orange-400)] text-[var(--pukri-marine-900)] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
          ⭐ Module phare
        </div>
      )}
      <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 ${c.icon}`} />
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <h3 className="font-bold text-lg text-[var(--pukri-marine-900)]">{title}</h3>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${c.text}`}>{tag}</span>
      </div>
      <p className="text-sm text-[var(--pukri-stone)] leading-relaxed mb-4">{desc}</p>
      <ul className="space-y-1.5">
        {features.map((f, i) => (
          <li key={i} className="flex gap-2 text-xs text-[var(--pukri-graphite)]">
            <CheckCircle2 className={`w-3.5 h-3.5 ${c.icon} flex-shrink-0 mt-0.5`} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================
//  Comment ça marche
// ============================================================

function CommentCaMarche() {
  const steps = [
    { num: "01", title: "Tu colles ton CV et l'offre", desc: "Texte ou PDF, peu importe. Tu choisis le secteur et le pays cible. 30 secondes." },
    { num: "02", title: "L'IA dialogue avec toi", desc: "5 questions ciblées. Tu réponds avec ce que tu sais vraiment. Pas d'invention." },
    { num: "03", title: "Tu repars avec ton dossier", desc: "CV optimisé, lettre calibrée, plan d'action 14 jours, prep entretien. Prêt à envoyer." },
  ];

  return (
    <section id="comment" className="py-16 lg:py-24 bg-[var(--pukri-marine-900)] text-white relative overflow-hidden">
      <div className="absolute -top-32 -right-20 w-96 h-96 bg-[var(--pukri-cyan-500)] rounded-full opacity-15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-[var(--pukri-orange-400)] rounded-full opacity-15 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 lg:px-6">
        <div className="text-center mb-12 animate-fade-up">
          <div className="text-xs font-bold text-[var(--pukri-cyan-400)] uppercase tracking-[0.2em] mb-3">Comment ça marche</div>
          <h2 className="font-display text-3xl lg:text-5xl font-bold mb-4">
            3 étapes. 10 minutes.<br />Un dossier qui te ressemble.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={i} className={`relative animate-fade-up delay-${i + 1}`}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm h-full">
                <div className="font-display text-5xl font-bold text-[var(--pukri-orange-400)] mb-4">{s.num}</div>
                <h3 className="font-bold text-xl mb-2">{s.title}</h3>
                <p className="text-white/70 leading-relaxed">{s.desc}</p>
              </div>
              {i < 2 && (
                <ArrowRight className="hidden md:block absolute top-1/2 -right-3 w-6 h-6 text-[var(--pukri-orange-400)] z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
//  Avant / Après — exemple concret
// ============================================================

function AvantApres() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-[var(--pukri-orange-600)] uppercase tracking-[0.2em] mb-3">Avant / Après</div>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-[var(--pukri-marine-900)] mb-4">
            Du flou au pro.
          </h2>
          <p className="text-lg text-[var(--pukri-stone)] max-w-2xl mx-auto">
            Sur un vrai cas — Issaka, jeune dev junior à Ouaga.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-[var(--pukri-mist)] rounded-2xl p-6 relative">
            <div className="absolute top-4 right-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--pukri-stone)] bg-[var(--pukri-cloud)] px-2 py-1 rounded">Avant</span>
            </div>
            <h3 className="font-bold text-[var(--pukri-marine-900)] mb-1">CV original</h3>
            <p className="text-xs text-[var(--pukri-stone)] mb-4">Score : 38 / 100</p>
            <div className="space-y-3 text-sm font-mono bg-[var(--pukri-snow)] p-4 rounded-lg border border-[var(--pukri-mist)]">
              <p className="text-[var(--pukri-stone)]">EXPÉRIENCE</p>
              <p>Sept 2023 — Stagiaire, Faso Digital</p>
              <p className="text-[var(--pukri-stone)] italic">- Aide à l'équipe sur projet React</p>
              <p className="text-[var(--pukri-stone)] italic">- Maintenance de sites WordPress</p>
              <p className="text-[var(--pukri-stone)] italic">- Participation aux daily stand-ups</p>
            </div>
            <p className="text-xs text-[var(--pukri-stone)] italic mt-3">
              "On comprend rien à ce qu'il a vraiment fait."
            </p>
          </div>

          <div className="bg-white border-2 border-[var(--pukri-orange-400)] rounded-2xl p-6 relative shadow-[var(--pukri-shadow-lg)]">
            <div className="absolute top-4 right-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--pukri-orange-700)] bg-[var(--pukri-orange-100)] px-2 py-1 rounded">Après</span>
            </div>
            <h3 className="font-bold text-[var(--pukri-marine-900)] mb-1">CV optimisé</h3>
            <p className="text-xs text-[var(--pukri-orange-600)] font-bold mb-4">Score : 78 / 100 · +40 points</p>
            <div className="space-y-3 text-sm font-mono bg-[var(--pukri-snow)] p-4 rounded-lg border border-[var(--pukri-orange-100)]">
              <p className="text-[var(--pukri-stone)]">EXPÉRIENCE</p>
              <p>Sept 2023 — Stagiaire, Faso Digital, Ouagadougou</p>
              <p className="text-[var(--pukri-marine-900)]">- Contribution à un projet React en équipe : suivi de tickets, lecture et compréhension de code en production</p>
              <p className="text-[var(--pukri-marine-900)]">- Maintenance d'écosystème WordPress : corrections de bugs, mises à jour plugins, sauvegardes</p>
              <p className="text-[var(--pukri-marine-900)]">- Pratique des cérémonies Agile (daily stand-ups quotidiens en français, 6 mois)</p>
            </div>
            <p className="text-xs text-[var(--pukri-orange-600)] italic mt-3 font-medium">
              "Précis, factuel, fidèle au CV. Aucune invention."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
//  Témoignages
// ============================================================

function Temoignages() {
  const items = [
    {
      name: "Aminata B.",
      role: "S&E, ONG Sahel",
      city: "Ouagadougou",
      stars: 5,
      text: "J'avais postulé 8 fois sans réponse. Après Talent·Ya, j'ai eu 3 entretiens en 2 semaines. La simulation m'a vraiment préparée."
    },
    {
      name: "Jean-Pierre K.",
      role: "Dev junior",
      city: "Abidjan",
      stars: 5,
      text: "Le coaching m'a fait comprendre que je sous-estimais mon expérience. Ils ne m'ont pas inventé un parcours, ils m'ont aidé à raconter le mien."
    },
    {
      name: "Fatou D.",
      role: "Marketing digital",
      city: "Dakar",
      stars: 5,
      text: "Le module 'lettre courte' a changé ma façon d'écrire. J'envoyais des pavés. Maintenant, 1 page, et ça passe."
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-pukri-canvas">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-[var(--pukri-cyan-700)] uppercase tracking-[0.2em] mb-3">Ils ont décroché</div>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-[var(--pukri-marine-900)] mb-4">
            Quand l'IA croit en toi,<br />les recruteurs aussi.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <div key={i} className={`bg-white border border-[var(--pukri-mist)] rounded-2xl p-6 hover:shadow-[var(--pukri-shadow-lg)] transition-all animate-fade-up delay-${i + 1}`}>
              <Quote className="w-8 h-8 text-[var(--pukri-orange-400)] opacity-30 mb-3" />
              <p className="text-[var(--pukri-graphite)] leading-relaxed mb-5 text-sm">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-[var(--pukri-mist)]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--pukri-cyan-500)] to-[var(--pukri-marine-800)] text-white flex items-center justify-center font-bold text-sm">
                  {t.name[0]}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-[var(--pukri-marine-900)]">{t.name}</div>
                  <div className="text-xs text-[var(--pukri-stone)]">{t.role} · {t.city}</div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-3 h-3 fill-[var(--pukri-orange-400)] text-[var(--pukri-orange-400)]" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-center text-[var(--pukri-stone)] mt-8 italic">
          Témoignages représentatifs des retours de notre phase pilote.
        </p>
      </div>
    </section>
  );
}

// ============================================================
//  FAQ
// ============================================================

const FAQS = [
  {
    q: "Est-ce que mes données restent confidentielles ?",
    r: "Oui. Ton CV et tes réponses sont utilisés uniquement pour générer ton dossier et ne sont jamais partagés. Les mots de passe sont hachés (bcrypt). Tu peux supprimer ton compte à tout moment."
  },
  {
    q: "Est-ce vraiment gratuit ?",
    r: "Le module Talent·Ya est entièrement gratuit pendant la phase de lancement. Tu peux faire autant d'analyses, simulations et coaching que tu veux."
  },
  {
    q: "Ça marche pour quel type de poste ?",
    r: "Étudiants, jeunes diplômés, candidats juniors et intermédiaires. Tous secteurs : Tech, Santé/ONG, Banque, Agriculture, Mines, BTP, Marketing, Logistique, RH, Éducation. ONG/bailleurs internationaux inclus."
  },
  {
    q: "L'IA invente-t-elle des choses sur mon CV ?",
    r: "Non. C'est notre charte d'intégrité : l'agent ne peut reformuler que ce qui est explicitement dans ton CV ou que tu as confirmé pendant le coaching. Pas de chiffres inventés, pas d'outils ajoutés. Le vrai vaut mille fois mieux que le faux."
  },
  {
    q: "Je suis dans un pays africain non listé, ça marche quand même ?",
    r: "Oui. Tu peux taper n'importe quel pays africain. L'agent adaptera ses conseils culturels au contexte que tu indiques."
  },
  {
    q: "Combien de temps prend une session de coaching complète ?",
    r: "10 à 15 minutes. 5 questions, tu réponds à ton rythme. Tu repars avec : CV optimisé, lettre, plan d'action sur 14 jours, et préparation aux questions probables d'entretien."
  },
];

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-[var(--pukri-orange-600)] uppercase tracking-[0.2em] mb-3">FAQ</div>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-[var(--pukri-marine-900)] mb-4">
            Vos questions.<br />Nos réponses.
          </h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={i} className="bg-white border border-[var(--pukri-mist)] rounded-xl overflow-hidden hover:border-[var(--pukri-cyan-200)] transition">
              <button onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-[var(--pukri-snow)] transition">
                <span className="font-bold text-[var(--pukri-marine-900)]">{f.q}</span>
                {open === i
                  ? <ChevronUp className="w-5 h-5 text-[var(--pukri-orange-500)] flex-shrink-0" />
                  : <ChevronDown className="w-5 h-5 text-[var(--pukri-stone)] flex-shrink-0" />}
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-[var(--pukri-graphite)] leading-relaxed border-t border-[var(--pukri-mist)] pt-4 animate-fade-in">
                  {f.r}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
//  CTA final
// ============================================================

function CTAFinal({ onCTA }) {
  return (
    <section className="py-16 lg:py-24 bg-[var(--pukri-marine-900)] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-pukri-grid opacity-30 pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--pukri-orange-400)] rounded-full opacity-20 blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 lg:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 mb-6">
          <Zap className="w-3.5 h-3.5 text-[var(--pukri-orange-400)]" />
          <span className="text-xs font-bold text-[var(--pukri-orange-400)] tracking-wider uppercase">
            Lancement gratuit
          </span>
        </div>

        <h2 className="font-display text-4xl lg:text-6xl font-bold leading-[1.05] mb-6">
          Ton prochain entretien<br />
          <span className="text-[var(--pukri-orange-400)]">commence ici.</span>
        </h2>
        <p className="text-lg text-white/75 max-w-2xl mx-auto mb-10">
          Crée ton compte en 30 secondes. Lance ton premier coaching. Repars avec un dossier qui te ressemble.
        </p>

        <button onClick={onCTA} className="btn-pukri btn-pukri-orange !text-base !py-4 !px-8 animate-glow">
          Lance-toi gratuitement
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-white/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--pukri-cyan-400)]" />
            <span>Données chiffrées</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--pukri-cyan-400)]" />
            <span>Setup en 30s</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--pukri-cyan-400)]" />
            <span>0% d'invention</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
//  HomeView — composition finale
// ============================================================

export default function HomeView({ onCTA }) {
  return (
    <div className="min-h-screen flex flex-col">
      <PukriHeader onCTA={onCTA} />
      <main className="flex-1">
       <Hero onCTA={onCTA} />
        <ValueStrip />
        <PourQui />
        <Modules onCTA={onCTA} />
        <CommentCaMarche />
        <AvantApres />
        <Temoignages />
        <FAQ />
        <CTAFinal onCTA={onCTA} />
      </main>
      <PukriFooter />
    </div>
  );
}
