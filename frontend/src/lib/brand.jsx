import React from "react";

/**
 * Logo PUKRI — version icône SVG (fallback si l'image n'est pas uploadée).
 * Représente : téléphone marine + Afrique cyan + anneaux orange.
 * Utilisé partout dans l'app pour rester cohérent.
 */
export function PukriIconSvg({ size = 40, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="pukri-phone" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#102a43" />
        </linearGradient>
        <linearGradient id="pukri-screen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a1929" />
          <stop offset="100%" stopColor="#102a43" />
        </linearGradient>
        <radialGradient id="pukri-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Téléphone */}
      <rect x="32" y="14" width="36" height="72" rx="6" fill="url(#pukri-phone)" />
      {/* Écran */}
      <rect x="35" y="22" width="30" height="50" rx="2" fill="url(#pukri-screen)" />

      {/* Halo cyan derrière l'Afrique */}
      <circle cx="50" cy="47" r="18" fill="url(#pukri-glow)" />

      {/* Carte Afrique stylisée — silhouette simplifiée */}
      <path
        d="M 47 28
           Q 51 28 54 31
           Q 58 35 58 41
           Q 60 44 60 49
           Q 60 54 56 58
           Q 53 62 51 65
           Q 49 68 48 65
           Q 46 62 44 59
           Q 42 55 42 50
           Q 41 46 42 41
           Q 43 35 47 28 Z"
        fill="#06b6d4"
        opacity="0.85"
      />

      {/* Points lumineux (capitales) */}
      <circle cx="48" cy="36" r="1.2" fill="#22d3ee" />
      <circle cx="52" cy="44" r="1.2" fill="#22d3ee" />
      <circle cx="46" cy="50" r="1.2" fill="#22d3ee" />
      <circle cx="54" cy="56" r="1.2" fill="#22d3ee" />

      {/* Anneaux orange (atome / orbites) */}
      <ellipse
        cx="50"
        cy="50"
        rx="34"
        ry="14"
        fill="none"
        stroke="#f59332"
        strokeWidth="3"
        transform="rotate(35 50 50)"
        opacity="0.95"
      />
      <ellipse
        cx="50"
        cy="50"
        rx="34"
        ry="14"
        fill="none"
        stroke="#f59332"
        strokeWidth="3"
        transform="rotate(-35 50 50)"
        opacity="0.95"
      />

      {/* Bouton home téléphone */}
      <circle cx="50" cy="79" r="2" fill="#4a78a8" />
    </svg>
  );
}

/**
 * Logo PUKRI complet (icône + texte) pour la landing et le footer.
 * Si l'image PNG est uploadée dans /public, on l'utilise.
 * Sinon fallback sur SVG + texte.
 */
export function PukriLogo({ variant = "full", size = "md", inverted = false }) {
  const sizes = {
    sm: { icon: 28, name: "text-base", tagline: "text-[10px]" },
    md: { icon: 40, name: "text-xl", tagline: "text-xs" },
    lg: { icon: 56, name: "text-2xl", tagline: "text-sm" },
    xl: { icon: 80, name: "text-4xl", tagline: "text-base" },
  };
  const s = sizes[size];

  const nameColor = inverted ? "text-white" : "text-[var(--pukri-marine-900)]";
  const taglineColor = inverted ? "text-[var(--pukri-orange-400)]" : "text-[var(--pukri-orange-500)]";

  if (variant === "icon") {
    return <PukriIconSvg size={s.icon} />;
  }

  return (
    <div className="flex items-center gap-3">
      <PukriIconSvg size={s.icon} />
      <div className="flex flex-col leading-none">
        <span className={`font-display font-bold ${s.name} ${nameColor} tracking-tight`}>
          PUKRI<span className={taglineColor}>.</span>AI
        </span>
        {(size === "lg" || size === "xl") && (
          <span className={`${s.tagline} mt-1.5 ${taglineColor} font-medium tracking-wide`}>
            Éveiller le potentiel par l'IA
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Badge "Talent·Ya" — indique que c'est le module de candidature.
 * Plus discret que le logo principal.
 */
export function TalentYaBadge({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--pukri-cyan-50)] border border-[var(--pukri-cyan-100)] ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--pukri-cyan-500)]" />
      <span className="text-xs font-semibold text-[var(--pukri-cyan-700)] tracking-wide">
        Talent·Ya
      </span>
    </span>
  );
}

/**
 * Header simplifié pour les pages publiques (landing, login).
 */
export function PukriHeader({ onCTA }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-[var(--pukri-mist)]">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PukriLogo size="sm" />
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-[var(--pukri-mist)]">
            <TalentYaBadge />
          </div>
        </div>
        <button onClick={onCTA} className="btn-pukri btn-pukri-orange text-sm">
          Commencer →
        </button>
      </div>
    </header>
  );
}

/**
 * Footer riche, présent sur toutes les pages publiques + page de l'app.
 */
export function PukriFooter() {
  return (
    <footer className="bg-[var(--pukri-marine-900)] text-white relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-[var(--pukri-orange-400)] rounded-full opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-[var(--pukri-cyan-500)] rounded-full opacity-10 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div>
            <PukriLogo size="lg" inverted />
            <p className="text-sm text-white/60 mt-4 leading-relaxed max-w-xs">
              PUKRI AI Systems développe des outils intelligents pensés pour les réalités africaines.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-4">Produits</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-white">Talent·Ya</span>
                <span className="text-[10px] uppercase tracking-wider text-[var(--pukri-cyan-400)] font-bold">Live</span>
              </li>
              <li className="text-white/40">Skills·Ya — Bientôt</li>
              <li className="text-white/40">Connect·Ya — Bientôt</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-4">Marché ciblé</h4>
            <p className="text-sm text-white/60 leading-relaxed">
              Burkina Faso · Sénégal · Côte d'Ivoire · Mali · Cameroun · Kenya · et toute l'Afrique francophone et anglophone.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <div>© {new Date().getFullYear()} PUKRI AI Systems. Tous droits réservés.</div>
          <div className="font-medium text-[var(--pukri-orange-400)]">Éveiller le potentiel par l'IA.</div>
        </div>
      </div>
    </footer>
  );
}
