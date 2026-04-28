import React, { useState, useEffect } from "react";
import { api, setToken } from "./lib/api.js";
import HomeView from "./views/HomeView.jsx";
import AuthView from "./views/AuthView.jsx";
import AnalyseView from "./views/AnalyseView.jsx";
import CoachingView from "./views/CoachingView.jsx";
import SimulationView from "./views/SimulationView.jsx";
import ProgressView from "./views/ProgressView.jsx";
import TrainingView from "./views/TrainingView.jsx";
import Header from "./components/Header.jsx";
import { PukriFooter } from "./lib/brand.jsx";

export default function App() {
  // 3 états : "home" (landing), "auth" (login/signup), "app" (connecté)
  const [user, setUser] = useState(null);
  const [publicView, setPublicView] = useState("home"); // "home" ou "auth"
  const [view, setView] = useState("coaching");
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
    setPublicView("home");
  }

  if (bootstrapping) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--pukri-snow)]">
        <div className="text-[var(--pukri-stone)] text-sm">Chargement…</div>
      </div>
    );
  }

  // Non connecté → landing OU auth
  if (!user) {
    if (publicView === "auth") {
      return <AuthView onLogin={setUser} onBackHome={() => setPublicView("home")} />;
    }
    return <HomeView onCTA={() => setPublicView("auth")} />;
  }

  // Connecté → app
  return (
    <div className="min-h-screen flex flex-col bg-pukri-canvas">
      <Header user={user} onLogout={logout} view={view} setView={setView} />
      <main className="flex-1 pb-12">
        {view === "analyse" && <AnalyseView onAnalysisDone={() => setRefreshKey(k => k + 1)} />}
        {view === "coaching" && <CoachingView />}
        {view === "simulation" && <SimulationView />}
        {view === "progres" && <ProgressView refreshKey={refreshKey} />}
        {view === "formation" && <TrainingView />}
      </main>
      <PukriFooter />
    </div>
  );
}
