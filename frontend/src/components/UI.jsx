import React from "react";
import { PukriIconSvg } from "../lib/brand.jsx";

/**
 * Logo Talent·Ya — utilisé pour le header de l'app authentifiée.
 * Il met en avant la marque-mère PUKRI avec Talent·Ya comme module.
 */
export function Logo({ size = "md" }) {
  const dims = size === "lg" ? "w-12 h-12" : size === "sm" ? "w-9 h-9" : "w-10 h-10";
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";

  return (
    <div className="flex items-center gap-3">
      <PukriIconSvg size={size === "lg" ? 48 : size === "sm" ? 36 : 40} />
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1.5">
          <span className={`font-display font-bold ${text} text-[var(--pukri-marine-900)] tracking-tight`}>
            PUKRI<span className="text-[var(--pukri-orange-500)]">.</span>AI
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--pukri-cyan-700)] font-bold mt-1">
          Talent·Ya
        </span>
      </div>
    </div>
  );
}

/**
 * Bouton PUKRI — variants alignés sur la nouvelle palette.
 */
export function Btn({ children, onClick, variant = "primary", className = "", disabled, type = "button", icon: Icon, iconRight: IconR }) {
  const variants = {
    primary: "btn-pukri btn-pukri-orange",
    orange:  "btn-pukri btn-pukri-orange",
    marine:  "btn-pukri btn-pukri-marine",
    cyan:    "btn-pukri btn-pukri-cyan",
    outline: "btn-pukri btn-pukri-outline",
    ghost:   "btn-pukri btn-pukri-ghost",
    // anciens noms pour compatibilité
    blue:    "btn-pukri btn-pukri-cyan",
    red:     "btn-pukri btn-pukri-orange",
  };
  const v = variants[variant] || variants.primary;

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${v} ${className}`}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
      {IconR && <IconR className="w-4 h-4" />}
    </button>
  );
}

/**
 * Card simple — pour les formulaires et sections d'app.
 */
export function Card({ title, children, required, optional, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-[var(--pukri-mist)] shadow-[var(--pukri-shadow-sm)] p-5 transition hover:shadow-[var(--pukri-shadow)] ${className}`}>
      {title && (
        <div className="flex items-baseline gap-2 mb-3">
          <h3 className="font-semibold text-[var(--pukri-marine-900)]">{title}</h3>
          {required && <span className="text-[10px] font-bold text-[var(--pukri-orange-600)] uppercase tracking-wider">Requis</span>}
          {optional && <span className="text-[10px] font-medium text-[var(--pukri-stone)] uppercase tracking-wider">Optionnel</span>}
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * SectionCard — pour les sections de résultats avec icône.
 */
export function SectionCard({ icon: Icon, title, accent = "default", children, className = "" }) {
  const accents = {
    default: "border-[var(--pukri-mist)]",
    cyan: "border-[var(--pukri-cyan-100)]",
    orange: "border-[var(--pukri-orange-100)]",
    marine: "border-[var(--pukri-marine-200)]",
    success: "border-green-200",
    danger: "border-red-200",
  };
  const iconColors = {
    default: "text-[var(--pukri-stone)]",
    cyan: "text-[var(--pukri-cyan-600)]",
    orange: "text-[var(--pukri-orange-600)]",
    marine: "text-[var(--pukri-marine-800)]",
    success: "text-green-600",
    danger: "text-red-600",
  };

  return (
    <div className={`bg-white rounded-2xl border ${accents[accent] || accents.default} shadow-[var(--pukri-shadow-sm)] p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-4 h-4 ${iconColors[accent] || iconColors.default}`} />
        <h3 className="font-semibold text-[var(--pukri-marine-900)]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

/**
 * Badge — petites étiquettes de statut.
 */
export function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-[var(--pukri-cloud)] text-[var(--pukri-graphite)]",
    cyan: "bg-[var(--pukri-cyan-50)] text-[var(--pukri-cyan-700)] border border-[var(--pukri-cyan-100)]",
    orange: "bg-[var(--pukri-orange-50)] text-[var(--pukri-orange-700)] border border-[var(--pukri-orange-100)]",
    marine: "bg-[var(--pukri-marine-50)] text-[var(--pukri-marine-800)] border border-[var(--pukri-marine-100)]",
    success: "bg-green-50 text-green-700 border border-green-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}

/**
 * Skeleton — placeholder pendant chargement.
 */
export function Skeleton({ className = "" }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}
