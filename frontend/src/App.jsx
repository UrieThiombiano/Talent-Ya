import React, { useState, useEffect } from "react";
import { api, setToken } from "./lib/api.js";
import AuthView from "./views/AuthView.jsx";
import AnalyseView from "./views/AnalyseView.jsx";
import CoachingView from "./views/CoachingView.jsx";
import SimulationView from "./views/SimulationView.jsx";
import ProgressView from "./views/ProgressView.jsx";
import TrainingView from "./views/TrainingView.jsx";
import Header from "./components/Header.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("coaching"); // coaching par défaut, c'est le mode phare
  const [refreshKey, setRefreshKey] = useState(0);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.me();
        setUser(data.user.username);
      } catch {
        setToken(null);
      } finally {
        setBootstrapping(false);
      }
    })();
  }, []);

  function logout() {
    setToken(null);
    setUser(null);
  }

  if (bootstrapping) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-sm">Chargement…</div>
      </div>
    );
  }

  if (!user) return <AuthView onLogin={setUser} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={logout} view={view} setView={setView} />
      <main className="pb-12">
        {view === "analyse" && <AnalyseView onAnalysisDone={() => setRefreshKey(k => k + 1)} />}
        {view === "coaching" && <CoachingView />}
        {view === "simulation" && <SimulationView />}
        {view === "progres" && <ProgressView refreshKey={refreshKey} />}
        {view === "formation" && <TrainingView />}
      </main>
      <footer className="border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-400">
        Talent·Ya — agent IA candidatures · Adapté aux réalités du marché africain
      </footer>
    </div>
  );
}
