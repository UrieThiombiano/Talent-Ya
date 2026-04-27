import React from "react";
import { Flame } from "lucide-react";

export function Logo({ size = "md" }) {
  const dims = size === "lg" ? "w-12 h-12" : size === "sm" ? "w-7 h-7" : "w-9 h-9";
  const text = size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-xl";
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${dims} relative flex items-center justify-center bg-black rounded-lg`}>
        <div className="absolute inset-0.5 bg-gradient-to-br from-blue-600 to-red-600 rounded-md opacity-90" />
        <Flame className="relative w-1/2 h-1/2 text-white" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col leading-none">
        <span className={`${text} font-bold tracking-tight text-black font-display`}>
          Talent<span className="text-red-600">·</span>Ya
        </span>
        {size === "lg" && (
          <span className="text-[11px] text-gray-500 mt-1 tracking-wider uppercase">
            Candidatures africaines
          </span>
        )}
      </div>
    </div>
  );
}

export function Btn({ children, onClick, variant = "primary", className = "", disabled, type = "button", icon: Icon }) {
  const v = {
    primary: "bg-black hover:bg-gray-800 text-white",
    blue: "bg-blue-600 hover:bg-blue-700 text-white",
    red: "bg-red-600 hover:bg-red-700 text-white",
    outline: "bg-white hover:bg-gray-50 text-black border border-gray-300",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  }[variant];
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${v} ${className} px-4 py-2.5 rounded-lg font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]`}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}

export function Card({ title, children, required, optional }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-baseline gap-2 mb-3">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {required && <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Requis</span>}
        {optional && <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Optionnel</span>}
      </div>
      {children}
    </div>
  );
}

export function SectionCard({ icon: Icon, title, accent = "default", children }) {
  const colors = {
    default: "border-gray-200",
    green: "border-green-200",
    red: "border-red-200",
    blue: "border-blue-200",
  }[accent];
  return (
    <div className={`bg-white rounded-2xl border ${colors} p-5`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-gray-700" />
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}
