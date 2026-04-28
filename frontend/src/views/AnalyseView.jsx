import React, { useState, useRef } from "react";
import {
  Upload, Sparkles, Globe, MapPin, AlertCircle, Zap, Loader2, Brain,
  RefreshCw, Target, Lightbulb, Award, Send, FileText, CheckCircle2
} from "lucide-react";
import { Card, Btn, SectionCard } from "../components/UI.jsx";
import { SECTORS, DEMO_CV, DEMO_OFFER } from "../lib/constants.js";
import { api } from "../lib/api.js";

export default function AnalyseView({ onAnalysisDone }) {
  const [step, setStep] = useState(1);
  const [cv, setCv] = useState("");
  const [letter, setLetter] = useState("");
  const [offer, setOffer] = useState("");
  const [offerUrl, setOfferUrl] = useState("");
  const [sector, setSector] = useState("sante");
  const [country, setCountry] = useState("Burkina Faso");
  const [results, setResults] = useState(null);
  const [err, setErr] = useState("");
  const cvFileRef = useRef();
  const offerFileRef = useRef();

  async function readFile(file, setter) {
    if (!file) return;
    if (file.type === "application/pdf") {
      setter(`[PDF importé : ${file.name} — ${(file.size / 1024).toFixed(1)} Ko]\n\nNote : pour une analyse optimale, colle plutôt le texte de ton CV ci-dessous.\n\nNom du fichier : ${file.name}`);
    } else {
      const text = await file.text();
      setter(text);
    }
  }

  function loadDemo() {
    setCv(DEMO_CV); setOffer(DEMO_OFFER); setSector("sante");
  }

  async function runAnalysis() {
    setErr("");
    if (!cv.trim()) return setErr("Le CV est requis.");
    if (!offer.trim() && !offerUrl.trim()) return setErr("Donne-moi l'offre (texte, PDF ou URL).");

    setStep(2);
    const sectorObj = SECTORS.find(s => s.id === sector) || SECTORS[0];
    try {
      const data = await api.runAnalysis({
        cv, letter, offer, offerUrl,
        sector: sectorObj.id, sectorName: sectorObj.name, country,
      });
      setResults(data.result);
      onAnalysisDone();
      setStep(3);
    } catch (e) {
      setErr(e.message || "L'analyse a échoué.");
      setStep(1);
    }
  }

  function reset() { setStep(1); setResults(null); setErr(""); }

  // Step 2 — Loading
  if (step === 2) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center px-4">
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--pukri-cyan-500)] to-[var(--pukri-marine-800)] flex items-center justify-center animate-pulse-soft">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <Loader2 className="absolute inset-0 w-24 h-24 animate-spin text-[var(--pukri-orange-500)]" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold mb-3 font-display text-[var(--pukri-marine-900)]">
          On regarde ça ensemble…
        </h2>
        <p className="text-[var(--pukri-stone)] max-w-md mx-auto">
          Lecture du CV, croisement avec l'offre, application des codes du recruteur africain.
        </p>
        <div className="mt-8 max-w-sm mx-auto space-y-2 text-left">
          {[
            "Extraction des informations clés",
            "Détection des mots-clés sectoriels",
            "Simulation du regard recruteur",
            "Génération des recommandations",
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-[var(--pukri-stone)] animate-pulse-soft" style={{ animationDelay: `${i * 0.4}s` }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--pukri-cyan-500)]" />
              {t}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (step === 3 && results) return <ResultsView results={results} onReset={reset} />;

  // Step 1 — Form
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-up">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--pukri-cyan-50)] border border-[var(--pukri-cyan-100)] rounded-full text-xs font-bold text-[var(--pukri-cyan-700)] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          ANALYSE EXPRESS
        </div>
        <h1 className="text-3xl lg:text-5xl font-bold mb-3 font-display text-[var(--pukri-marine-900)]">
          Colle ton CV, je vais voir<br/>ce qui bloque.
        </h1>
        <p className="text-[var(--pukri-stone)] max-w-2xl text-lg">
          Diagnostic complet en 20 secondes. Score, mots-clés, conseils localisés.
        </p>
      </div>

      <div className="space-y-4">
        <Card title="Ton CV" required>
          <textarea value={cv} onChange={e => setCv(e.target.value)}
            placeholder="Colle ici le contenu de ton CV…"
            className="input-pukri min-h-[140px] resize-y" />
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <input ref={cvFileRef} type="file" accept=".txt,.md,.pdf" className="hidden"
              onChange={e => readFile(e.target.files[0], setCv)} />
            <Btn variant="outline" icon={Upload} onClick={() => cvFileRef.current.click()}>
              Importer un fichier
            </Btn>
            <Btn variant="ghost" icon={Sparkles} onClick={loadDemo}>Charger un exemple</Btn>
            <span className="text-xs text-[var(--pukri-stone)] ml-auto">{cv.length} caractères</span>
          </div>
        </Card>

        <Card title="Lettre de motivation" optional>
          <textarea value={letter} onChange={e => setLetter(e.target.value)}
            placeholder="(Optionnel) Colle ta lettre, ou laisse vide."
            className="input-pukri min-h-[100px] resize-y" />
        </Card>

        <Card title="L'offre d'emploi" required>
          <textarea value={offer} onChange={e => setOffer(e.target.value)}
            placeholder="Colle le texte de l'offre…"
            className="input-pukri min-h-[120px] resize-y" />
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <input ref={offerFileRef} type="file" accept=".txt,.md,.pdf" className="hidden"
              onChange={e => readFile(e.target.files[0], setOffer)} />
            <Btn variant="outline" icon={Upload} onClick={() => offerFileRef.current.click()}>
              Importer (PDF/TXT)
            </Btn>
            <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-[var(--pukri-snow)] border border-[var(--pukri-mist)] rounded-lg px-3">
              <Globe className="w-4 h-4 text-[var(--pukri-stone)]" />
              <input value={offerUrl} onChange={e => setOfferUrl(e.target.value)}
                placeholder="…ou colle une URL d'offre"
                className="flex-1 py-2.5 bg-transparent text-sm focus:outline-none text-[var(--pukri-graphite)]" />
            </div>
          </div>
        </Card>

        <Card title="Contexte de la candidature">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--pukri-graphite)] uppercase tracking-wider mb-2">Secteur cible</label>
              <select value={sector} onChange={e => setSector(e.target.value)} className="input-pukri">
                {SECTORS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--pukri-graphite)] uppercase tracking-wider mb-2">Pays cible</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pukri-stone)]" />
                <input value={country} onChange={e => setCountry(e.target.value)} className="input-pukri pl-10" />
              </div>
            </div>
          </div>
        </Card>

        {err && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {err}
          </div>
        )}

        <div className="sticky bottom-4 pt-4">
          <Btn variant="orange" className="w-full !py-4 !text-base" icon={Zap} onClick={runAnalysis}>
            Lancer l'analyse
          </Btn>
          <p className="text-center text-xs text-[var(--pukri-stone)] mt-2">L'analyse prend environ 10-20 secondes.</p>
        </div>
      </div>
    </div>
  );
}

function ResultsView({ results, onReset }) {
  const r = results;
  const scoreColor = r.score_global >= 75 ? "text-green-600"
    : r.score_global >= 55 ? "text-[var(--pukri-cyan-600)]"
    : r.score_global >= 35 ? "text-[var(--pukri-orange-600)]"
    : "text-red-600";

  const scoreBg = r.score_global >= 75 ? "bg-green-50 border-green-200"
    : r.score_global >= 55 ? "bg-[var(--pukri-cyan-50)] border-[var(--pukri-cyan-200)]"
    : r.score_global >= 35 ? "bg-[var(--pukri-orange-50)] border-[var(--pukri-orange-200)]"
    : "bg-red-50 border-red-200";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-[var(--pukri-marine-900)]">Voilà ton diagnostic</h1>
          <p className="text-[var(--pukri-stone)] text-sm mt-1">Tout ce qu'il faut pour passer le filtre.</p>
        </div>
        <Btn variant="outline" icon={RefreshCw} onClick={onReset}>Nouvelle analyse</Btn>
      </div>

      {/* Score global */}
      <div className={`${scoreBg} border-2 rounded-2xl p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center gap-6`}>
        <div className="flex items-center gap-5">
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg className="w-28 h-28 -rotate-90">
              <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200" />
              <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="none"
                strokeDasharray={`${2 * Math.PI * 48}`}
                strokeDashoffset={`${2 * Math.PI * 48 * (1 - r.score_global / 100)}`}
                strokeLinecap="round" className={scoreColor} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold font-display ${scoreColor}`}>{r.score_global}</span>
              <span className="text-[10px] text-[var(--pukri-stone)] uppercase tracking-wider">/100</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--pukri-stone)] mb-1">Verdict</div>
            <p className="text-lg lg:text-xl font-semibold leading-snug max-w-md text-[var(--pukri-marine-900)]">{r.verdict}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full lg:w-auto lg:ml-auto">
          {[
            { label: "Visuel", v: r.score_visuel },
            { label: "Mots-clés", v: r.score_mots_cles },
            { label: "Pertinence", v: r.score_pertinence },
            { label: "Local", v: r.score_localisation },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-lg p-3 border border-[var(--pukri-mist)]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--pukri-stone)]">{s.label}</div>
              <div className="text-2xl font-bold mt-1 text-[var(--pukri-marine-900)]">{s.v}<span className="text-xs text-[var(--pukri-stone)]">/100</span></div>
              <div className="h-1 bg-[var(--pukri-cloud)] rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-[var(--pukri-marine-900)] rounded-full transition-all" style={{ width: `${s.v}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forces / Faiblesses */}
      <div className="grid md:grid-cols-2 gap-4">
        <SectionCard icon={CheckCircle2} title="Tes forces" accent="success">
          <ul className="space-y-2">
            {r.forces.map((f, i) => <li key={i} className="flex gap-2 text-sm text-[var(--pukri-graphite)]"><span className="text-green-600 font-bold">+</span>{f}</li>)}
          </ul>
        </SectionCard>
        <SectionCard icon={AlertCircle} title="À renforcer" accent="orange">
          <ul className="space-y-2">
            {r.faiblesses.map((f, i) => <li key={i} className="flex gap-2 text-sm text-[var(--pukri-graphite)]"><span className="text-[var(--pukri-orange-600)] font-bold">!</span>{f}</li>)}
          </ul>
        </SectionCard>
      </div>

      {/* Mots-clés */}
      <SectionCard icon={Target} title="Mots-clés stratégiques" accent="cyan">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--pukri-stone)] mb-2">Présents dans l'offre</div>
            <div className="flex flex-wrap gap-1.5">
              {r.mots_cles_offre.map((k, i) => (
                <span key={i} className="px-2.5 py-1 bg-[var(--pukri-cyan-50)] text-[var(--pukri-cyan-700)] border border-[var(--pukri-cyan-100)] rounded-md text-xs font-medium">{k}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--pukri-orange-600)] mb-2">Manquants dans ton CV ⚠</div>
            <div className="flex flex-wrap gap-1.5">
              {r.mots_cles_manquants.map((k, i) => (
                <span key={i} className="px-2.5 py-1 bg-[var(--pukri-orange-50)] text-[var(--pukri-orange-700)] border border-[var(--pukri-orange-100)] rounded-md text-xs font-medium">{k}</span>
              ))}
            </div>
            <p className="text-xs text-[var(--pukri-stone)] mt-2 italic">Intègre-les naturellement, sans bourrage.</p>
          </div>
        </div>
      </SectionCard>

      {/* Améliorations visuelles + culturelles */}
      <div className="grid md:grid-cols-2 gap-4">
        <SectionCard icon={Sparkles} title="Mise en forme" accent="cyan">
          <ol className="space-y-3">
            {r.ameliorations_visuelles.map((c, i) => (
              <li key={i} className="flex gap-3 text-sm text-[var(--pukri-graphite)]">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--pukri-marine-900)] text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span>{c}</span>
              </li>
            ))}
          </ol>
        </SectionCard>
        <SectionCard icon={Lightbulb} title="Conseils culturels" accent="orange">
          <ul className="space-y-3">
            {r.conseils_culturels.map((c, i) => (
              <li key={i} className="flex gap-2 text-sm text-[var(--pukri-graphite)]"><MapPin className="w-4 h-4 text-[var(--pukri-cyan-600)] flex-shrink-0 mt-0.5" />{c}</li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Réécritures */}
      <SectionCard icon={Award} title="Réécritures recommandées" accent="orange">
        <ol className="space-y-3">
          {r.ameliorations_contenu.map((c, i) => (
            <li key={i} className="flex gap-3 text-sm bg-[var(--pukri-snow)] p-3 rounded-lg border border-[var(--pukri-mist)]">
              <span className="flex-shrink-0 w-6 h-6 rounded bg-[var(--pukri-orange-500)] text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <span className="text-[var(--pukri-graphite)]">{c}</span>
            </li>
          ))}
        </ol>
      </SectionCard>

      {/* Phrases prêtes */}
      <SectionCard icon={Send} title="Phrases prêtes à insérer" accent="cyan">
        <div className="space-y-2">
          {r.phrases_a_ajouter.map((p, i) => (
            <div key={i} className="p-3 bg-[var(--pukri-cyan-50)] border-l-4 border-[var(--pukri-cyan-500)] rounded-r-lg text-sm italic text-[var(--pukri-marine-900)]">
              "{p}"
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Lettre intro */}
      <SectionCard icon={FileText} title="Accroche de lettre proposée" accent="marine">
        <div className="p-4 bg-[var(--pukri-marine-900)] text-white rounded-lg text-sm leading-relaxed font-light">
          {r.lettre_intro_amelioree}
        </div>
      </SectionCard>
    </div>
  );
}
