import React, { useState } from "react";
import { User, Lock, Eye, EyeOff, AlertCircle, LogIn, Loader2 } from "lucide-react";
import { Logo, Btn } from "../components/UI.jsx";
import { api, setToken } from "../lib/api.js";

export default function AuthView({ onLogin }) {
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
      <div className="hidden lg:flex flex-1 bg-black text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-red-600 rounded-full opacity-15 blur-3xl" />

        <div className="relative z-10"><Logo size="lg" /></div>

        <div className="relative z-10">
          <h1 className="text-5xl font-bold leading-tight mb-6 font-display">
            Décrochez<br />le poste<br />
            <span className="text-red-500">qui compte.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md leading-relaxed">
            L'agent IA qui transforme votre candidature pour répondre aux exigences réelles des recruteurs africains et internationaux opérant sur le continent.
          </p>
          <div className="grid grid-cols-3 gap-6 mt-12 max-w-md">
            <div>
              <div className="text-3xl font-bold text-blue-500">10+</div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Secteurs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-500">IA</div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Simulation</div>
            </div>
            <div>
              <div className="text-3xl font-bold">100%</div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Local</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-gray-500">
          Adapté aux réalités du marché : Burkina Faso · Sénégal · Côte d'Ivoire · Mali · Cameroun · Kenya · et plus
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center"><Logo size="lg" /></div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button onClick={() => { setMode("login"); setErr(""); }}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === "login" ? "bg-white text-black shadow-sm" : "text-gray-500"}`}>
                Connexion
              </button>
              <button onClick={() => { setMode("signup"); setErr(""); }}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === "signup" ? "bg-white text-black shadow-sm" : "text-gray-500"}`}>
                Créer un compte
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-1 font-display">
              {mode === "login" ? "Bon retour" : "Bienvenue"}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {mode === "login" ? "Reprenez où vous vous êtes arrêté." : "Quelques secondes pour démarrer."}
            </p>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={username} onChange={e => setUsername(e.target.value)}
                    autoComplete="username" placeholder="ex : aminata.b"
                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={password} onChange={e => setPassword(e.target.value)}
                    type={showPwd ? "text" : "password"}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === "signup" && (
                  <p className="text-[11px] text-gray-400 mt-1.5">6 caractères minimum.</p>
                )}
              </div>

              {err && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{err}</span>
                </div>
              )}

              <Btn type="submit" variant="primary" className="w-full !py-3" disabled={loading}
                icon={loading ? Loader2 : LogIn}>
                {loading ? "Connexion..." : (mode === "login" ? "Se connecter" : "Créer mon compte")}
              </Btn>
            </form>

            <p className="text-xs text-gray-400 text-center mt-6">
              Vos données sont stockées de manière sécurisée. Mot de passe haché.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
