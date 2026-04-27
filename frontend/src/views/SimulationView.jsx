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
    setStarted(true);
    setLoading(true);
    setErr("");
    try {
      const data = await api.startSim({ poste, sectorName: sObj.name });
      setMessages([{ role: "ai", text: data.question }]);
    } catch (e) {
      setErr(e.message);
      setStarted(false);
    } finally {
      setLoading(false);
    }
  }

  async function send() {
    if (!input.trim() || loading) return;
    const newMsgs = [...messages, { role: "user", text: input.trim() }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    setErr("");

    try {
      const userTurns = newMsgs.filter(m => m.role === "user").length;
      if (userTurns >= 4) {
        const data = await api.finalizeSim({ poste, sector: secteur, history: newMsgs });
        setVerdict(data.verdict);
      } else {
        const data = await api.simMessage({ poste, history: newMsgs });
        setMessages([...newMsgs, { role: "ai", text: data.question }]);
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStarted(false); setMessages([]); setVerdict(null); setPoste(""); setErr("");
  }

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-red-600 text-white mb-4">
            <Brain className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2 font-display">Simulation recruteur IA</h1>
          <p className="text-gray-600">5 questions, un verdict honnête. Comme en vrai.</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Poste visé</label>
            <input value={poste} onChange={e => setPoste(e.target.value)}
              placeholder="ex : Chargé(e) de projet S&E"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Secteur</label>
            <select value={secteur} onChange={e => setSecteur(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white">
              {SECTORS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          {err && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{err}</div>}
          <Btn variant="red" className="w-full !py-3" icon={Zap} onClick={startSim} disabled={!poste.trim() || loading}>
            {loading ? "Préparation..." : "Démarrer la simulation"}
          </Btn>
        </div>
      </div>
    );
  }

  if (verdict) {
    const dec = {
      retenu: ["✓ Retenu", "bg-green-100 text-green-800 border-green-300"],
      en_attente: ["⏸ Profil en attente", "bg-yellow-100 text-yellow-800 border-yellow-300"],
      rejete: ["✗ Non retenu", "bg-red-100 text-red-800 border-red-300"],
    }[verdict.decision] || ["—", ""];
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        <h1 className="text-3xl font-bold font-display">Verdict de simulation</h1>
        <div className={`border-2 rounded-2xl p-6 ${dec[1]}`}>
          <div className="text-sm font-bold uppercase tracking-wider mb-2">Décision</div>
          <div className="text-3xl font-bold">{dec[0]}</div>
          <div className="mt-3 text-sm">Score : <span className="font-bold">{verdict.score}/100</span></div>
        </div>
        <SectionCard icon={Briefcase} title="Feedback du recruteur">
          <p className="text-sm leading-relaxed">{verdict.feedback}</p>
        </SectionCard>
        <div className="grid md:grid-cols-2 gap-4">
          <SectionCard icon={CheckCircle2} title="Points forts" accent="green">
            <ul className="text-sm space-y-1">{verdict.points_forts.map((p, i) => <li key={i}>· {p}</li>)}</ul>
          </SectionCard>
          <SectionCard icon={AlertCircle} title="À travailler" accent="red">
            <ul className="text-sm space-y-1">{verdict.a_travailler.map((p, i) => <li key={i}>· {p}</li>)}</ul>
          </SectionCard>
        </div>
        <Btn variant="primary" icon={RefreshCw} onClick={reset} className="w-full">Refaire une simulation</Btn>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col" style={{ height: "calc(100vh - 160px)" }}>
        <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center"><Brain className="w-4 h-4 text-white" /></div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Recruteur IA</div>
            <div className="text-xs text-gray-500">{poste}</div>
          </div>
          <button onClick={reset} className="text-xs text-gray-500 hover:text-red-600">Quitter</button>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${m.role === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-gray-100 text-gray-900 rounded-bl-sm"}`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                </div>
              </div>
            </div>
          )}
          {err && <div className="text-xs text-red-600 px-3 py-2 bg-red-50 rounded-lg">{err}</div>}
        </div>
        <div className="border-t border-gray-200 p-3 flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") send(); }}
            placeholder="Tapez votre réponse…" disabled={loading}
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-blue-500 focus:bg-white" />
          <button onClick={send} disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white flex items-center justify-center transition">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
