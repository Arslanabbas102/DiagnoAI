import React from "react";
import { Link } from "react-router-dom";

const Logo = ({ light = false, className = "" }) => {
  return (
    <Link
      to="/home"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="DiagnoAI home"
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-brand transition-transform duration-300 group-hover:rotate-6">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none">
          <path
            d="M9.5 3.5h5v6h6v5h-6v6h-5v-6h-6v-5h6v-6Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent-400 ring-2 ring-white" />
      </span>
      <span
        className={`whitespace-nowrap font-display text-[19px] font-extrabold tracking-tight ${
          light ? "text-white" : "text-ink"
        }`}
      >
        Diagno<span className="text-brand-600">AI</span>
      </span>
    </Link>
  );
};

export default Logo;
