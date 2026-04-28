import React from "react";
import { Sparkles, Brain, TrendingUp, BookOpen, LogOut, HeartHandshake } from "lucide-react";
import { Logo } from "./UI.jsx";

const TABS = [
  { id: "analyse", label: "Analyse", icon: Sparkles },
  { id: "coaching", label: "Coaching", icon: HeartHandshake, accent: true },
  { id: "simulation", label: "Simulation", icon: Brain },
  { id: "progres", label: "Progression", icon: TrendingUp },
  { id: "formation", label: "Formation", icon: BookOpen },
];

export default function Header({ user, onLogout, view, setView }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/85 border-b border-[var(--pukri-mist)]">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 flex items-center justify-between h-16">
        <Logo size="sm" />

        <nav className="hidden md:flex items-center gap-1 bg-[var(--pukri-cloud)] p-1 rounded-xl">
          {TABS.map(t => {
            const isActive = view === t.id;
            return (
              <button key={t.id} onClick={() => setView(t.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all relative ${
                  isActive
                    ? (t.accent
                        ? "bg-[var(--pukri-orange-400)] text-[var(--pukri-marine-900)] shadow-[var(--pukri-shadow)]"
                        : "bg-white text-[var(--pukri-marine-900)] shadow-[var(--pukri-shadow-sm)]")
                    : "text-[var(--pukri-stone)] hover:text-[var(--pukri-marine-900)]"
                }`}>
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--pukri-cyan-500)] to-[var(--pukri-marine-800)] flex items-center justify-center text-white text-xs font-bold">
              {user[0].toUpperCase()}
            </div>
            <span className="font-medium text-[var(--pukri-graphite)]">{user}</span>
          </div>
          <button onClick={onLogout}
            className="text-[var(--pukri-stone)] hover:text-[var(--pukri-orange-600)] p-2 rounded-lg hover:bg-[var(--pukri-cloud)] transition">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="md:hidden border-t border-[var(--pukri-mist)] px-2 overflow-x-auto">
        <div className="flex gap-1 py-2">
          {TABS.map(t => {
            const isActive = view === t.id;
            return (
              <button key={t.id} onClick={() => setView(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  isActive
                    ? (t.accent
                        ? "bg-[var(--pukri-orange-400)] text-[var(--pukri-marine-900)]"
                        : "bg-[var(--pukri-marine-900)] text-white")
                    : "text-[var(--pukri-stone)] bg-[var(--pukri-cloud)]"
                }`}>
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
