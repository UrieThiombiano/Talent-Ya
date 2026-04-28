import React, { useState } from "react";
import { User, Lock, Eye, EyeOff, AlertCircle, LogIn, Loader2, ArrowLeft } from "lucide-react";
import { PukriLogo } from "../lib/brand.jsx";
import { Btn } from "../components/UI.jsx";
import { api, setToken } from "../lib/api.js";

export default function AuthView({ onLogin, onBackHome }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    if (username.length < 3) return setErr("Nom d'utilisateur : 3 caractères minimum");
    if (password.length < 6) return setErr("Mot de passe : 6 caractères minimum");
    setLoading(true);
    try {
      const fn = mode === "login" ? api.login : api.signup;
      const data = await fn({ username: username.trim(), password });
      setToken(data.token);
      onLogin(data.user.username);
    } catch (e) {
      setErr(e.message || "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Gauche — visuel marine PUKRI */}
      <div className="hidden lg:flex flex-1 bg-[var(--pukri-marine-900)] text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-32 -right-20 w-[500px] h-[500px] bg-[var(--pukri-orange-400)] rounded-full opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 w-[500px] h-[500px] bg-[var(--pukri-cyan-500)] rounded-full opacity-15 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-pukri-grid opacity-30 pointer-events-none" />

        <div className="relative z-10">
          {onBackHome && (
            <button onClick={onBackHome} className="flex items-center gap-1 text-white/60 hover:text-white text-sm mb-6 transition">
              <ArrowLeft className="w-4 h-4" /> Retour
            </button>
          )}
          <PukriLogo size="lg" inverted />
        </div>

        <div className="relative z-10 animate-fade-up">
          <h1 className="font-display text-5xl font-bold leading-[1.05] mb-6">
            Décroche<br/>le poste<br/>
            <span className="text-[var(--pukri-orange-400)]">qui change tout.</span>
          </h1>
          <p className="text-white/75 text-lg max-w-md leading-relaxed">
            Talent·Ya — l'agent IA qui transforme ta candidature pour répondre aux exigences réelles des recruteurs africains et internationaux opérant sur le continent.
          </p>
          <div className="grid grid-cols-3 gap-6 mt-12 max-w-md pt-6 border-t border-white/10">
            <div>
              <div className="text-3xl font-bold text-[var(--pukri-cyan-400)] font-display">10+</div>
              <div className="text-xs text-white/50 mt-1 uppercase tracking-wider">Secteurs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[var(--pukri-orange-400)] font-display">14j</div>
              <div className="text-xs text-white/50 mt-1 uppercase tracking-wider">Plan</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-display">100%</div>
              <div className="text-xs text-white/50 mt-1 uppercase tracking-wider">Local</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/40">
          PUKRI AI Systems · Burkina Faso · Sénégal · Côte d'Ivoire · Mali · Cameroun · Kenya
        </div>
      </div>

      {/* Droite — formulaire */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-pukri-canvas">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex flex-col items-center gap-4">
            {onBackHome && (
              <button onClick={onBackHome} className="self-start text-[var(--pukri-stone)] hover:text-[var(--pukri-marine-900)] text-sm flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>
            )}
            <PukriLogo size="lg" />
          </div>

          <div className="bg-white rounded-2xl border border-[var(--pukri-mist)] p-8 shadow-[var(--pukri-shadow-lg)] animate-fade-up">
            <div className="flex bg-[var(--pukri-cloud)] rounded-lg p-1 mb-6">
              <button onClick={() => { setMode("login"); setErr(""); }}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === "login" ? "bg-white text-[var(--pukri-marine-900)] shadow-[var(--pukri-shadow-sm)]" : "text-[var(--pukri-stone)]"}`}>
                Connexion
              </button>
              <button onClick={() => { setMode("signup"); setErr(""); }}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === "signup" ? "bg-white text-[var(--pukri-marine-900)] shadow-[var(--pukri-shadow-sm)]" : "text-[var(--pukri-stone)]"}`}>
                Créer un compte
              </button>
            </div>

            <h2 className="font-display text-2xl font-bold mb-1 text-[var(--pukri-marine-900)]">
              {mode === "login" ? "Bon retour" : "Bienvenue"}
            </h2>
            <p className="text-sm text-[var(--pukri-stone)] mb-6">
              {mode === "login" ? "Reprends où tu t'es arrêté." : "30 secondes et tu démarres."}
            </p>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--pukri-graphite)] uppercase tracking-wider mb-2">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pukri-stone)]" />
                  <input value={username} onChange={e => setUsername(e.target.value)}
                    autoComplete="username" placeholder="ex : aminata.b"
                    className="input-pukri pl-10" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--pukri-graphite)] uppercase tracking-wider mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pukri-stone)]" />
                  <input value={password} onChange={e => setPassword(e.target.value)}
                    type={showPwd ? "text" : "password"}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    placeholder="••••••••" className="input-pukri pl-10 pr-10" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--pukri-stone)] hover:text-[var(--pukri-marine-900)]">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === "signup" && (
                  <p className="text-[11px] text-[var(--pukri-stone)] mt-1.5">6 caractères minimum.</p>
                )}
              </div>

              {err && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{err}</span>
                </div>
              )}

              <Btn type="submit" variant="orange" className="w-full !py-3" disabled={loading}
                icon={loading ? Loader2 : LogIn}>
                {loading ? "Connexion..." : (mode === "login" ? "Se connecter" : "Créer mon compte")}
              </Btn>
            </form>

            <p className="text-xs text-[var(--pukri-stone)] text-center mt-6">
              Mot de passe haché. Tes données sont sécurisées.
            </p>
          </div>

          <p className="text-[11px] text-[var(--pukri-stone)] text-center mt-6">
            Un produit <span className="font-semibold text-[var(--pukri-marine-900)]">PUKRI AI Systems</span>
          </p>
        </div>
      </div>
    </div>
  );
}
