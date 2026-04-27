import React, { useState, useRef } from "react";
import {
  Upload, Sparkles, Globe, MapPin, AlertCircle, Zap, Loader2, Brain,
  RefreshCw, Target, Lightbulb, Award, Send, FileText, CheckCircle2
} from "lucide-react";
import { Card, Btn, SectionCard } from "../components/UI.jsx";
import { SECTORS, DEMO_CV, DEMO_OFFER } from "../lib/constants.js";
import { api } from "../lib/api.js";

export default function AnalyseView({ onAnalysisDone }) {
  const [step, setStep] = useState(1); // 1=input, 2=loading, 3=results
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
      setter(`[PDF importé : ${file.name} — ${(file.size / 1024).toFixed(1)} Ko]\n\nNote : pour une analyse optimale, collez plutôt le texte de votre CV ci-dessous.\n\nNom du fichier : ${file.name}`);
    } else {
      const text = await file.text();
      setter(text);
    }
  }

  function loadDemo() {
    setCv(DEMO_CV);
    setOffer(DEMO_OFFER);
    setSector("sante");
  }

  async function runAnalysis() {
    setErr("");
    if (!cv.trim()) return setErr("Le CV est requis.");
    if (!offer.trim() && !offerUrl.trim()) return setErr("Fournissez l'offre (texte, PDF ou URL).");

    setStep(2);
    const sectorObj = SECTORS.find(s => s.id === sector) || SECTORS[0];

    try {
      const data = await api.runAnalysis({
        cv, letter, offer, offerUrl,
        sector: sectorObj.id,
        sectorName: sectorObj.name,
        country,
      });
      setResults(data.result);
      onAnalysisDone();
      setStep(3);
    } catch (e) {
      setErr(e.message || "L'analyse a échoué.");
      setStep(1);
    }
  }

  function reset() {
    setStep(1); setResults(null); setErr("");
  }

  if (step === 2) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="relative inline-block mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-red-600 flex items-center justify-center animate-pulse">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <Loader2 className="absolute inset-0 w-20 h-20 animate-spin text-black" />
        </div>
        <h2 className="text-2xl font-bold mb-2 font-display">L'agent analyse votre dossier…</h2>
        <p className="text-gray-500">Lecture du CV, croisement avec l'offre, application des codes du recruteur africain.</p>
        <div className="mt-8 max-w-sm mx-auto space-y-2 text-left">
          {["Extraction des informations clés", "Détection des mots-clés sectoriels", "Simulation du regard recruteur", "Génération des recommandations"].map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-600 animate-pulse" style={{ animationDelay: `${i * 0.4}s` }}>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              {t}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (step === 3 && results) return <ResultsView results={results} onReset={reset} />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2 font-display">
          Faites passer votre candidature au scanner.
        </h1>
        <p className="text-gray-600">Importez ou collez vos documents. L'agent fait le reste — diagnostic, mots-clés, conseils localisés.</p>
      </div>

      <div className="space-y-5">
        <Card title="Votre CV" required>
          <textarea value={cv} onChange={e => setCv(e.target.value)}
            placeholder="Collez ici le contenu de votre CV…"
            className="w-full min-h-[140px] p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white resize-y" />
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <input ref={cvFileRef} type="file" accept=".txt,.md,.pdf" className="hidden"
              onChange={e => readFile(e.target.files[0], setCv)} />
            <Btn variant="outline" icon={Upload} onClick={() => cvFileRef.current.click()}>
              Importer un fichier
            </Btn>
            <Btn variant="ghost" icon={Sparkles} onClick={loadDemo}>Charger un exemple</Btn>
            <span className="text-xs text-gray-400 ml-auto">{cv.length} caractères</span>
          </div>
        </Card>

        <Card title="Lettre de motivation" optional>
          <textarea value={letter} onChange={e => setLetter(e.target.value)}
            placeholder="(Optionnel) Collez votre lettre, ou laissez vide pour ne pas l'analyser."
            className="w-full min-h-[100px] p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white resize-y" />
        </Card>

        <Card title="Offre d'emploi" required>
          <textarea value={offer} onChange={e => setOffer(e.target.value)}
            placeholder="Collez le texte de l'offre…"
            className="w-full min-h-[120px] p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white resize-y" />
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <input ref={offerFileRef} type="file" accept=".txt,.md,.pdf" className="hidden"
              onChange={e => readFile(e.target.files[0], setOffer)} />
            <Btn variant="outline" icon={Upload} onClick={() => offerFileRef.current.click()}>
              Importer (PDF/TXT)
            </Btn>
            <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3">
              <Globe className="w-4 h-4 text-gray-400" />
              <input value={offerUrl} onChange={e => setOfferUrl(e.target.value)}
                placeholder="…ou collez une URL d'offre"
                className="flex-1 py-2.5 bg-transparent text-sm focus:outline-none" />
            </div>
          </div>
        </Card>

        <Card title="Contexte de la candidature">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Secteur cible</label>
              <select value={sector} onChange={e => setSector(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white">
                {SECTORS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Pays cible</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={country} onChange={e => setCountry(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white" />
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

        <div className="sticky bottom-4 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent pt-6 pb-2 -mx-4 px-4">
          <Btn variant="red" className="w-full !py-4 !text-base" icon={Zap} onClick={runAnalysis}>
            Lancer l'analyse IA
          </Btn>
          <p className="text-center text-xs text-gray-400 mt-2">L'analyse prend environ 10-20 secondes.</p>
        </div>
      </div>
    </div>
  );
}

function ResultsView({ results, onReset }) {
  const r = results;
  const scoreColor = r.score_global >= 75 ? "text-green-600" : r.score_global >= 55 ? "text-blue-600" : r.score_global >= 35 ? "text-yellow-600" : "text-red-600";
  const scoreBg = r.score_global >= 75 ? "bg-green-50 border-green-200" : r.score_global >= 55 ? "bg-blue-50 border-blue-200" : r.score_global >= 35 ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display">Résultats d'analyse</h1>
          <p className="text-gray-500 text-sm mt-1">Diagnostic complet et plan d'action.</p>
        </div>
        <Btn variant="outline" icon={RefreshCw} onClick={onReset}>Nouvelle analyse</Btn>
      </div>

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
              <span className={`text-3xl font-bold ${scoreColor}`}>{r.score_global}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">/100</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Verdict</div>
            <p className="text-lg lg:text-xl font-semibold leading-snug max-w-md">{r.verdict}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full lg:w-auto lg:ml-auto">
          {[
            { label: "Visuel", v: r.score_visuel },
            { label: "Mots-clés", v: r.score_mots_cles },
            { label: "Pertinence", v: r.score_pertinence },
            { label: "Local", v: r.score_localisation },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{s.label}</div>
              <div className="text-2xl font-bold mt-1">{s.v}<span className="text-xs text-gray-400">/100</span></div>
              <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-black rounded-full" style={{ width: `${s.v}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <SectionCard icon={CheckCircle2} title="Vos forces" accent="green">
          <ul className="space-y-2">
            {r.forces.map((f, i) => <li key={i} className="flex gap-2 text-sm"><span className="text-green-600 font-bold">+</span>{f}</li>)}
          </ul>
        </SectionCard>
        <SectionCard icon={AlertCircle} title="À renforcer" accent="red">
          <ul className="space-y-2">
            {r.faiblesses.map((f, i) => <li key={i} className="flex gap-2 text-sm"><span className="text-red-600 font-bold">!</span>{f}</li>)}
          </ul>
        </SectionCard>
      </div>

      <SectionCard icon={Target} title="Mots-clés stratégiques">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Présents dans l'offre</div>
            <div className="flex flex-wrap gap-1.5">
              {r.mots_cles_offre.map((k, i) => <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-xs font-medium">{k}</span>)}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-red-600 mb-2">Manquants dans votre CV ⚠</div>
            <div className="flex flex-wrap gap-1.5">
              {r.mots_cles_manquants.map((k, i) => <span key={i} className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-md text-xs font-medium">{k}</span>)}
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">Intégrez-les naturellement, sans bourrage.</p>
          </div>
        </div>
      </SectionCard>

      <div className="grid md:grid-cols-2 gap-4">
        <SectionCard icon={Sparkles} title="Mise en forme">
          <ol className="space-y-3">
            {r.ameliorations_visuelles.map((c, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span>{c}</span>
              </li>
            ))}
          </ol>
        </SectionCard>
        <SectionCard icon={Lightbulb} title="Conseils culturels">
          <ul className="space-y-3">
            {r.conseils_culturels.map((c, i) => (
              <li key={i} className="flex gap-2 text-sm"><MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />{c}</li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard icon={Award} title="Réécritures recommandées">
        <ol className="space-y-3">
          {r.ameliorations_contenu.map((c, i) => (
            <li key={i} className="flex gap-3 text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="flex-shrink-0 w-6 h-6 rounded bg-red-600 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <span>{c}</span>
            </li>
          ))}
        </ol>
      </SectionCard>

      <SectionCard icon={Send} title="Phrases prêtes à insérer">
        <div className="space-y-2">
          {r.phrases_a_ajouter.map((p, i) => (
            <div key={i} className="p-3 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg text-sm italic text-gray-800">
              "{p}"
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard icon={FileText} title="Accroche de lettre proposée">
        <div className="p-4 bg-gradient-to-br from-gray-900 to-black text-white rounded-lg text-sm leading-relaxed font-light">
          {r.lettre_intro_amelioree}
        </div>
      </SectionCard>
    </div>
  );
}
