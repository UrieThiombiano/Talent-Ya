import React, { useState, useRef, useEffect } from "react";
import {
  Upload, Sparkles, Globe, MapPin, AlertCircle, Loader2, RefreshCw,
  HeartHandshake, ArrowRight, Lightbulb, CheckCircle2, Copy, FileText,
  Send, Calendar, MessageCircle, Target, Flame, ChevronDown, ChevronUp
} from "lucide-react";
import { Card, Btn } from "../components/UI.jsx";
import { SECTORS, DEMO_CV, DEMO_OFFER } from "../lib/constants.js";
import { api } from "../lib/api.js";

export default function CoachingView() {
  const [step, setStep] = useState(1);
  const [cv, setCv] = useState("");
  const [letter, setLetter] = useState("");
  const [offer, setOffer] = useState("");
  const [sector, setSector] = useState("sante");
  const [country, setCountry] = useState("Burkina Faso");
  const [sessionId, setSessionId] = useState(null);
  const [prenom, setPrenom] = useState("");
  const [briefing, setBriefing] = useState("");
  const [currentQ, setCurrentQ] = useState(null);
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState([]);
  const [deliverable, setDeliverable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const cvFileRef = useRef();
  const offerFileRef = useRef();

  async function readFile(file, setter) {
    if (!file) return;
    if (file.type === "application/pdf") {
      setter(`[PDF importé : ${file.name}]\n\nNote : pour de meilleurs résultats, colle plutôt le texte de ton CV ci-dessous.`);
    } else { const text = await file.text(); setter(text); }
  }

  function loadDemo() { setCv(DEMO_CV); setOffer(DEMO_OFFER); setSector("sante"); }

  async function startCoaching() {
    setErr("");
    if (!cv.trim()) return setErr("Le CV est requis pour démarrer le coaching.");
    if (!offer.trim()) return setErr("L'offre est requise.");
    setLoading(true);
    try {
      const sectorObj = SECTORS.find(s => s.id === sector) || SECTORS[0];
      const data = await api.startCoaching({
        cv, letter, offer,
        sector: sectorObj.id, sectorName: sectorObj.name, country,
      });
      setSessionId(data.sessionId);
      setPrenom(data.prenom);
      setBriefing(data.briefing);
      setCurrentQ({ question: data.question, tip: data.tip, num: data.questionNum, total: data.total });
      setStep(2);
    } catch (e) { setErr(e.message || "Erreur"); }
    finally { setLoading(false); }
  }

  function startQuestions() { setStep(3); }

  async function submitAnswer() {
    if (!answer.trim()) return setErr("Donne-moi une réponse, même courte.");
    setErr(""); setLoading(true);
    try {
      const data = await api.answerCoaching({ sessionId, answer: answer.trim() });
      setHistory([...history, { ...currentQ, a: answer.trim() }]);
      setAnswer("");
      if (data.done) {
        setStep(4);
        const finalData = await api.finalizeCoaching(sessionId);
        setDeliverable(finalData.deliverable);
        setStep(5);
      } else {
        setCurrentQ({ question: data.question, tip: data.tip, num: data.questionNum, total: data.total, reaction: data.reaction });
      }
    } catch (e) { setErr(e.message || "Erreur"); }
    finally { setLoading(false); }
  }

  function reset() {
    setStep(1); setSessionId(null); setPrenom(""); setBriefing("");
    setCurrentQ(null); setAnswer(""); setHistory([]); setDeliverable(null); setErr("");
  }

  // Step 4 — génération
  if (step === 4) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center px-4">
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--pukri-cyan-500)] to-[var(--pukri-orange-400)] flex items-center justify-center animate-pulse-soft">
            <Flame className="w-12 h-12 text-white" />
          </div>
          <Loader2 className="absolute inset-0 w-24 h-24 animate-spin text-[var(--pukri-marine-900)]" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold mb-3 font-display text-[var(--pukri-marine-900)]">
          On t'assemble le dossier idéal, {prenom}…
        </h2>
        <p className="text-[var(--pukri-stone)] max-w-md mx-auto">
          Réécriture du CV, calibrage de la lettre, plan d'action sur mesure. ~30 secondes.
        </p>
        <div className="mt-8 max-w-sm mx-auto space-y-2 text-left">
          {["Réécriture fidèle du CV", "Lettre de motivation calibrée", "Plan d'action sur 14 jours", "Préparation aux questions probables", "Mot final du coach"].map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-[var(--pukri-stone)] animate-pulse-soft" style={{ animationDelay: `${i * 0.4}s` }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--pukri-orange-500)]" />
              {t}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (step === 5 && deliverable) return <DeliverableView deliverable={deliverable} prenom={prenom} onReset={reset} />;
  if (step === 3 && currentQ) return <QuestionStep prenom={prenom} currentQ={currentQ} answer={answer} setAnswer={setAnswer} onSubmit={submitAnswer} loading={loading} err={err} history={history} />;
  if (step === 2) return <BriefingStep prenom={prenom} briefing={briefing} onContinue={startQuestions} />;

  // Step 1 — Setup
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-up">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[var(--pukri-cyan-50)] to-[var(--pukri-orange-50)] border border-[var(--pukri-orange-100)] rounded-full text-xs font-bold text-[var(--pukri-marine-900)] mb-4">
          <HeartHandshake className="w-3.5 h-3.5 text-[var(--pukri-orange-600)]" />
          MODULE PHARE — COACHING APPROFONDI
        </div>
        <h1 className="text-3xl lg:text-5xl font-bold mb-3 font-display text-[var(--pukri-marine-900)]">
          On va décrocher ce poste<br/>ensemble.
        </h1>
        <p className="text-[var(--pukri-stone)] max-w-2xl text-lg">
          5 questions ciblées, 10 minutes de dialogue, et tu repars avec un dossier complet.
          <strong className="text-[var(--pukri-marine-900)]"> Pas d'invention.</strong> Du vrai. Du toi.
        </p>
      </div>

      <div className="space-y-4">
        <Card title="Ton CV" required>
          <textarea value={cv} onChange={e => setCv(e.target.value)}
            placeholder="Colle le contenu de ton CV ici…"
            className="input-pukri min-h-[140px] resize-y" />
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <input ref={cvFileRef} type="file" accept=".txt,.md,.pdf" className="hidden"
              onChange={e => readFile(e.target.files[0], setCv)} />
            <Btn variant="outline" icon={Upload} onClick={() => cvFileRef.current.click()}>Importer</Btn>
            <Btn variant="ghost" icon={Sparkles} onClick={loadDemo}>Charger un exemple</Btn>
            <span className="text-xs text-[var(--pukri-stone)] ml-auto">{cv.length} caractères</span>
          </div>
        </Card>

        <Card title="Lettre actuelle" optional>
          <textarea value={letter} onChange={e => setLetter(e.target.value)}
            placeholder="(Optionnel) Si tu en as déjà une, colle-la ici. Sinon je t'en proposerai une à la fin."
            className="input-pukri min-h-[100px] resize-y" />
        </Card>

        <Card title="L'offre visée" required>
          <textarea value={offer} onChange={e => setOffer(e.target.value)}
            placeholder="Colle l'offre d'emploi ici…"
            className="input-pukri min-h-[140px] resize-y" />
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <input ref={offerFileRef} type="file" accept=".txt,.md,.pdf" className="hidden"
              onChange={e => readFile(e.target.files[0], setOffer)} />
            <Btn variant="outline" icon={Upload} onClick={() => offerFileRef.current.click()}>Importer</Btn>
          </div>
        </Card>

        <Card title="Contexte">
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
          <Btn variant="orange" className="w-full !py-4 !text-base" icon={loading ? Loader2 : HeartHandshake} onClick={startCoaching} disabled={loading}>
            {loading ? "Préparation du coaching…" : "Démarrer le coaching"}
          </Btn>
          <p className="text-center text-xs text-[var(--pukri-stone)] mt-2">~10 minutes · 5 questions · Tu repars avec ton dossier complet</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  Briefing
// ============================================================

function BriefingStep({ prenom, briefing, onContinue }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-up">
      <div className="bg-white rounded-2xl border border-[var(--pukri-mist)] overflow-hidden shadow-[var(--pukri-shadow-lg)]">
        <div className="bg-[var(--pukri-marine-900)] p-6 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--pukri-orange-400)] rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[var(--pukri-cyan-500)] rounded-full opacity-20 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/10 rounded-full text-xs uppercase tracking-wider font-bold mb-3">
              <Flame className="w-3.5 h-3.5 text-[var(--pukri-orange-400)]" />
              Mot d'accueil de ton coach
            </div>
            <h1 className="text-2xl font-bold font-display">Salut {prenom} !</h1>
          </div>
        </div>
        <div className="p-6">
          <p className="text-[var(--pukri-graphite)] leading-relaxed whitespace-pre-line">{briefing}</p>
        </div>
        <div className="border-t border-[var(--pukri-mist)] p-5 bg-[var(--pukri-snow)] flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 text-sm text-[var(--pukri-stone)]">
            <span className="font-bold text-[var(--pukri-marine-900)]">5 questions</span> · 10 minutes · 1 dossier final
          </div>
          <Btn variant="orange" icon={ArrowRight} onClick={onContinue}>Allez, on démarre</Btn>
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  Question
// ============================================================

function QuestionStep({ prenom, currentQ, answer, setAnswer, onSubmit, loading, err, history }) {
  const progress = (currentQ.num / currentQ.total) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-up">
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-[var(--pukri-stone)] mb-2">
          <span className="font-bold uppercase tracking-wider">Question {currentQ.num} sur {currentQ.total}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-[var(--pukri-cloud)] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[var(--pukri-cyan-500)] to-[var(--pukri-orange-400)] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {currentQ.reaction && (
        <div className="bg-[var(--pukri-cyan-50)] border border-[var(--pukri-cyan-100)] rounded-xl p-4 mb-5 flex gap-3 animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-[var(--pukri-marine-900)] flex items-center justify-center flex-shrink-0">
            <Flame className="w-4 h-4 text-[var(--pukri-orange-400)]" />
          </div>
          <p className="text-sm text-[var(--pukri-marine-900)] leading-relaxed">{currentQ.reaction}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[var(--pukri-mist)] p-6 shadow-[var(--pukri-shadow)]">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--pukri-orange-400)] to-[var(--pukri-orange-600)] text-[var(--pukri-marine-900)] flex items-center justify-center font-bold flex-shrink-0">
            {currentQ.num}
          </div>
          <h2 className="text-xl lg:text-2xl font-bold leading-snug font-display flex-1 text-[var(--pukri-marine-900)]">
            {currentQ.question}
          </h2>
        </div>

        {currentQ.tip && (
          <div className="flex gap-2 p-3 bg-[var(--pukri-orange-50)] border border-[var(--pukri-orange-100)] rounded-lg mb-5">
            <Lightbulb className="w-4 h-4 text-[var(--pukri-orange-600)] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--pukri-graphite)]"><strong>Astuce :</strong> {currentQ.tip}</p>
          </div>
        )}

        <textarea value={answer} onChange={e => setAnswer(e.target.value)}
          placeholder="Prends ton temps. Sois précis, sois honnête. Le vrai vaut mille fois mieux que le flou."
          className="input-pukri min-h-[160px] resize-y" disabled={loading} />

        <div className="flex items-center justify-between mt-3 text-xs text-[var(--pukri-stone)]">
          <span>{answer.length} caractères</span>
          {answer.length > 0 && answer.length < 30 && (
            <span className="text-[var(--pukri-orange-600)]">⚠ Très court — peux-tu détailler ?</span>
          )}
        </div>

        {err && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mt-3">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />{err}
          </div>
        )}

        <div className="flex justify-end mt-5">
          <Btn variant="orange" icon={loading ? Loader2 : ArrowRight} onClick={onSubmit} disabled={loading || !answer.trim()}>
            {loading ? "Le coach réfléchit…" : (currentQ.num >= currentQ.total ? "Finaliser mon dossier" : "Question suivante")}
          </Btn>
        </div>
      </div>

      {history.length > 0 && <HistoryAccordion history={history} />}
    </div>
  );
}

function HistoryAccordion({ history }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-3 bg-white border border-[var(--pukri-mist)] rounded-lg text-sm hover:bg-[var(--pukri-snow)]">
        <span className="font-medium text-[var(--pukri-graphite)]">Tes réponses précédentes ({history.length})</span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && (
        <div className="mt-2 space-y-2 animate-fade-in">
          {history.map((h, i) => (
            <div key={i} className="bg-[var(--pukri-snow)] border border-[var(--pukri-mist)] rounded-lg p-3 text-sm">
              <div className="text-xs font-bold text-[var(--pukri-stone)] uppercase tracking-wider mb-1">Q{h.num}</div>
              <div className="text-[var(--pukri-graphite)] italic mb-2">{h.question}</div>
              <div className="text-[var(--pukri-marine-900)]">{h.a}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
//  Livrable final
// ============================================================

function DeliverableView({ deliverable, prenom, onReset }) {
  const [openSection, setOpenSection] = useState("cv");
  const sections = [
    { id: "cv", title: "CV optimisé", icon: FileText, content: deliverable.cv_optimise, copyable: true },
    { id: "lettre", title: "Lettre de motivation", icon: Send, content: deliverable.lettre_optimisee, copyable: true },
    { id: "plan", title: "Plan d'action 14 jours", icon: Calendar, content: null, custom: "plan" },
    { id: "entretien", title: "Préparation entretien", icon: MessageCircle, content: null, custom: "entretien" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-5 animate-fade-up">
      <div className="bg-[var(--pukri-marine-900)] rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-[var(--pukri-orange-400)] rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[var(--pukri-cyan-500)] rounded-full opacity-20 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/10 rounded-full text-xs uppercase tracking-wider font-bold mb-3">
            <Flame className="w-3.5 h-3.5 text-[var(--pukri-orange-400)]" />
            Ton dossier optimisé
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4 font-display">C'est prêt, {prenom} 💪</h1>
          <p className="text-white/80 leading-relaxed whitespace-pre-line">{deliverable.mot_coach}</p>
        </div>
      </div>

      <div className="space-y-3">
        {sections.map(s => (
          <DeliverableSection key={s.id} section={s} deliverable={deliverable}
            isOpen={openSection === s.id} onToggle={() => setOpenSection(openSection === s.id ? null : s.id)} />
        ))}
      </div>

      <div className="bg-gradient-to-r from-[var(--pukri-orange-400)] to-[var(--pukri-orange-600)] rounded-2xl p-6 text-[var(--pukri-marine-900)]">
        <div className="flex items-start gap-3">
          <Target className="w-6 h-6 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2 font-display">Va chercher ce poste.</h3>
            <p className="text-sm leading-relaxed whitespace-pre-line">{deliverable.call_to_action}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Btn variant="outline" icon={RefreshCw} onClick={onReset}>Nouvelle session de coaching</Btn>
      </div>
    </div>
  );
}

function DeliverableSection({ section, deliverable, isOpen, onToggle }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(section.content || "");
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white border border-[var(--pukri-mist)] rounded-2xl overflow-hidden">
      <button onClick={onToggle} className="w-full p-5 flex items-center justify-between hover:bg-[var(--pukri-snow)] transition">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--pukri-marine-900)] text-white flex items-center justify-center">
            <section.icon className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[var(--pukri-marine-900)]">{section.title}</h3>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-[var(--pukri-stone)]" /> : <ChevronDown className="w-5 h-5 text-[var(--pukri-stone)]" />}
      </button>
      {isOpen && (
        <div className="border-t border-[var(--pukri-mist)] p-5 animate-fade-in">
          {section.copyable && section.content && (
            <>
              <div className="bg-[var(--pukri-snow)] border border-[var(--pukri-mist)] rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed font-mono">
                {section.content}
              </div>
              <div className="mt-3 flex justify-end">
                <Btn variant="outline" icon={copied ? CheckCircle2 : Copy} onClick={copy}>
                  {copied ? "Copié !" : "Copier"}
                </Btn>
              </div>
            </>
          )}

          {section.custom === "plan" && (
            <div className="space-y-3">
              {(deliverable.plan_action || []).map((p, i) => (
                <div key={i} className="border border-[var(--pukri-mist)] rounded-lg p-4 bg-white">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-8 h-8 rounded bg-[var(--pukri-orange-500)] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-[var(--pukri-marine-900)]">{p.titre}</h4>
                      <p className="text-xs text-[var(--pukri-stone)] mt-0.5">📅 {p.delai}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--pukri-graphite)] mb-3">{p.objectif}</p>
                  <ul className="space-y-1.5">
                    {(p.etapes || []).map((e, j) => (
                      <li key={j} className="flex gap-2 text-sm text-[var(--pukri-graphite)]">
                        <CheckCircle2 className="w-4 h-4 text-[var(--pukri-cyan-600)] flex-shrink-0 mt-0.5" />
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                  {p.ressource && (
                    <div className="mt-3 text-xs text-[var(--pukri-stone)] italic flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Ressource : {p.ressource}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {section.custom === "entretien" && (
            <div className="space-y-4">
              {(deliverable.preparation_entretien || []).map((p, i) => (
                <div key={i} className="border-l-4 border-[var(--pukri-cyan-500)] bg-[var(--pukri-cyan-50)] rounded-r-lg p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--pukri-cyan-700)] mb-1">Question probable n°{i + 1}</div>
                  <h4 className="font-bold text-sm mb-2 text-[var(--pukri-marine-900)]">"{p.question}"</h4>
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--pukri-stone)] mt-3 mb-1">Comment répondre</div>
                  <p className="text-sm text-[var(--pukri-graphite)] leading-relaxed">{p.comment_repondre}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
