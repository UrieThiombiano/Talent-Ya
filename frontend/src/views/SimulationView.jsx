import React, { useState, useRef, useEffect } from "react";
import { Brain, Zap, Send, RefreshCw, Briefcase, CheckCircle2, AlertCircle } from "lucide-react";
import { Btn, SectionCard } from "../components/UI.jsx";
import { SECTORS } from "../lib/constants.js";
import { api } from "../lib/api.js";

export default function SimulationView() {
  const [started, setStarted] = useState(false);
  const [poste, setPoste] = useState("");
  const [secteur, setSecteur] = useState("sante");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const [err, setErr] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  async function startSim() {
    if (!poste.trim()) return;
    const sObj = SECTORS.find(s => s.id === secteur);
    setStarted(true); setLoading(true); setErr("");
    try {
      const data = await api.startSim({ poste, sectorName: sObj.name });
      setMessages([{ role: "ai", text: data.question }]);
    } catch (e) {
      setErr(e.message); setStarted(false);
    } finally { setLoading(false); }
  }

  async function send() {
    if (!input.trim() || loading) return;
    const newMsgs = [...messages, { role: "user", text: input.trim() }];
    setMessages(newMsgs); setInput(""); setLoading(true); setErr("");

    try {
      const userTurns = newMsgs.filter(m => m.role === "user").length;
      if (userTurns >= 4) {
        const data = await api.finalizeSim({ poste, sector: secteur, history: newMsgs });
        setVerdict(data.verdict);
      } else {
        const data = await api.simMessage({ poste, history: newMsgs });
        setMessages([...newMsgs, { role: "ai", text: data.question }]);
      }
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }

  function reset() {
    setStarted(false); setMessages([]); setVerdict(null); setPoste(""); setErr("");
  }

  // Setup
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--pukri-marine-800)] to-[var(--pukri-cyan-600)] text-white mb-4 shadow-[var(--pukri-shadow-lg)]">
            <Brain className="w-10 h-10" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 font-display text-[var(--pukri-marine-900)]">
            Mets-toi en condition entretien
          </h1>
          <p className="text-[var(--pukri-stone)] text-lg">
            5 questions, un verdict honnête. Comme en vrai.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--pukri-mist)] p-6 space-y-4 shadow-[var(--pukri-shadow)]">
          <div>
            <label className="block text-xs font-semibold text-[var(--pukri-graphite)] uppercase tracking-wider mb-2">Poste visé</label>
            <input value={poste} onChange={e => setPoste(e.target.value)}
              placeholder="ex : Chargé(e) de projet S&E" className="input-pukri" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--pukri-graphite)] uppercase tracking-wider mb-2">Secteur</label>
            <select value={secteur} onChange={e => setSecteur(e.target.value)} className="input-pukri">
              {SECTORS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          {err && <div className="text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">{err}</div>}
          <Btn variant="orange" className="w-full !py-3" icon={Zap} onClick={startSim} disabled={!poste.trim() || loading}>
            {loading ? "Préparation..." : "Démarrer la simulation"}
          </Btn>
        </div>
      </div>
    );
  }

  // Verdict
  if (verdict) {
    const dec = {
      retenu: ["✓ Retenu", "bg-green-100 text-green-800 border-green-300"],
      en_attente: ["⏸ Profil en attente", "bg-[var(--pukri-orange-50)] text-[var(--pukri-orange-700)] border-[var(--pukri-orange-200)]"],
      rejete: ["✗ Non retenu", "bg-red-100 text-red-800 border-red-300"],
    }[verdict.decision] || ["—", ""];

    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5 animate-fade-up">
        <h1 className="text-3xl font-bold font-display text-[var(--pukri-marine-900)]">Voilà le verdict</h1>
        <div className={`border-2 rounded-2xl p-6 ${dec[1]}`}>
          <div className="text-sm font-bold uppercase tracking-wider mb-2">Décision du recruteur</div>
          <div className="text-3xl font-bold font-display">{dec[0]}</div>
          <div className="mt-3 text-sm">Score : <span className="font-bold">{verdict.score}/100</span></div>
        </div>
        <SectionCard icon={Briefcase} title="Feedback du recruteur" accent="marine">
          <p className="text-sm leading-relaxed text-[var(--pukri-graphite)]">{verdict.feedback}</p>
        </SectionCard>
        <div className="grid md:grid-cols-2 gap-4">
          <SectionCard icon={CheckCircle2} title="Points forts" accent="success">
            <ul className="text-sm space-y-1 text-[var(--pukri-graphite)]">
              {verdict.points_forts.map((p, i) => <li key={i}>· {p}</li>)}
            </ul>
          </SectionCard>
          <SectionCard icon={AlertCircle} title="À travailler" accent="orange">
            <ul className="text-sm space-y-1 text-[var(--pukri-graphite)]">
              {verdict.a_travailler.map((p, i) => <li key={i}>· {p}</li>)}
            </ul>
          </SectionCard>
        </div>
        <Btn variant="marine" icon={RefreshCw} onClick={reset} className="w-full">Refaire une simulation</Btn>
      </div>
    );
  }

  // Chat
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-up">
      <div className="bg-white rounded-2xl border border-[var(--pukri-mist)] overflow-hidden flex flex-col shadow-[var(--pukri-shadow-lg)]" style={{ height: "calc(100vh - 160px)" }}>
        <div className="px-4 py-3 border-b border-[var(--pukri-mist)] flex items-center gap-2 bg-[var(--pukri-snow)]">
          <div className="w-9 h-9 rounded-full bg-[var(--pukri-marine-900)] flex items-center justify-center">
            <Brain className="w-4 h-4 text-[var(--pukri-cyan-400)]" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-[var(--pukri-marine-900)]">Recruteur IA</div>
            <div className="text-xs text-[var(--pukri-stone)]">{poste}</div>
          </div>
          <button onClick={reset} className="text-xs text-[var(--pukri-stone)] hover:text-[var(--pukri-orange-600)]">Quitter</button>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                m.role === "user"
                  ? "bg-[var(--pukri-cyan-500)] text-white rounded-br-sm"
                  : "bg-[var(--pukri-cloud)] text-[var(--pukri-marine-900)] rounded-bl-sm"
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[var(--pukri-cloud)] rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 bg-[var(--pukri-stone)] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          {err && <div className="text-xs text-red-600 px-3 py-2 bg-red-50 rounded-lg">{err}</div>}
        </div>
        <div className="border-t border-[var(--pukri-mist)] p-3 flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") send(); }}
            placeholder="Tape ta réponse…" disabled={loading}
            className="input-pukri !rounded-full" />
          <button onClick={send} disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-full bg-[var(--pukri-orange-400)] hover:bg-[var(--pukri-orange-500)] disabled:opacity-40 text-[var(--pukri-marine-900)] flex items-center justify-center transition active:scale-95">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
