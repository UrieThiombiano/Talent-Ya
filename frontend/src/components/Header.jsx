import React from "react";
import { Sparkles, Brain, TrendingUp, BookOpen, LogOut } from "lucide-react";
import { Logo } from "./UI.jsx";

const TABS = [
  { id: "analyse", label: "Analyse", icon: Sparkles },
  { id: "simulation", label: "Simulation IA", icon: Brain },
  { id: "progres", label: "Progression", icon: TrendingUp },
  { id: "formation", label: "Formation", icon: BookOpen },
];

export default function Header({ user, onLogout, view, setView }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 flex items-center justify-between h-16">
        <Logo size="sm" />
        <nav className="hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setView(t.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition ${view === t.id ? "bg-white text-black shadow-sm" : "text-gray-600 hover:text-black"}`}>
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-red-600 flex items-center justify-center text-white text-xs font-bold">
              {user[0].toUpperCase()}
            </div>
            <span className="font-medium text-gray-800">{user}</span>
          </div>
          <button onClick={onLogout} className="text-gray-500 hover:text-red-600 p-2 rounded-lg hover:bg-gray-100 transition">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="md:hidden border-t border-gray-100 px-2 overflow-x-auto">
        <div className="flex gap-1 py-2">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setView(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${view === t.id ? "bg-black text-white" : "text-gray-600 bg-gray-100"}`}>
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
