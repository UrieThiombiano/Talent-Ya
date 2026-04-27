import React, { useState, useEffect } from "react";
import {
  ChevronLeft, ArrowRight, CheckCircle2, FileText, Target, Send,
  Briefcase, Users, GraduationCap
} from "lucide-react";
import { Btn } from "../components/UI.jsx";
import { MODULES } from "../lib/constants.js";
import { api } from "../lib/api.js";

const ICONS = { FileText, Target, Send, Briefcase, Users, GraduationCap };

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

  if (active) {
    const m = MODULES.find(x => x.id === active);
    const Icon = ICONS[m.icon] || FileText;
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button onClick={() => setActive(null)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-6">
          <ChevronLeft className="w-4 h-4" /> Retour aux modules
        </button>
        <div className="flex items-center gap-3 mb-2">
          <Icon className="w-6 h-6 text-red-600" />
          <span className="text-xs uppercase tracking-wider text-gray-500 font-bold">{m.duration} de lecture</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold mb-3 font-display">{m.title}</h1>
        <p className="text-gray-600 text-lg mb-8">{m.desc}</p>
        <div className="space-y-6">
          {m.content.map((s, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-bold text-red-600">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-bold text-lg">{s.h}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mt-2 text-sm">{s.p}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          {done.includes(active) ? (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-4">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Module terminé · vous y reviendrez quand vous voudrez.</span>
            </div>
          ) : (
            <Btn variant="primary" icon={CheckCircle2} className="w-full !py-3" onClick={() => complete(active)}>
              J'ai terminé ce module
            </Btn>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display">Centre de formation</h1>
        <p className="text-gray-600">Les bonnes pratiques de candidature, pensées pour le marché africain.</p>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-red-600 rounded-full transition-all"
              style={{ width: `${(done.length / MODULES.length) * 100}%` }} />
          </div>
          <span className="text-xs font-bold text-gray-500">{done.length}/{MODULES.length}</span>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {MODULES.map(m => {
          const isDone = done.includes(m.id);
          const Icon = ICONS[m.icon] || FileText;
          return (
            <button key={m.id} onClick={() => setActive(m.id)}
              className="group text-left bg-white border border-gray-200 hover:border-black rounded-2xl p-5 transition-all hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${isDone ? "bg-green-100 text-green-700" : "bg-black text-white"}`}>
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold mb-1 leading-tight">{m.title}</h3>
                  <p className="text-sm text-gray-500 leading-snug">{m.desc}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">{m.duration}</span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
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
