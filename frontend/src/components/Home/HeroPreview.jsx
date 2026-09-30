import React from "react";
import {
  HiOutlineCheckBadge,
  HiOutlineShieldCheck,
  HiOutlineCalendarDays,
  HiArrowRight,
} from "react-icons/hi2";
import { LuDroplet, LuHeartPulse, LuBean } from "react-icons/lu";

// Illustrative preview of a DiagnoAI screening report (static, not real data)
const screenings = [
  {
    icon: LuDroplet,
    name: "Diabetes",
    status: "Low risk",
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    iconTone: "bg-amber-50 text-amber-600",
  },
  {
    icon: LuHeartPulse,
    name: "Heart disease",
    status: "Low risk",
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    iconTone: "bg-rose-50 text-rose-600",
  },
  {
    icon: LuBean,
    name: "Kidney disease",
    status: "Review",
    tone: "bg-amber-50 text-amber-700 ring-amber-100",
    iconTone: "bg-teal-50 text-teal-600",
  },
];

const Lungs = () => (
  <svg viewBox="0 0 120 100" className="h-full w-full" fill="none" aria-hidden="true">
    <path
      d="M60 6v34m0 0-8 10m8-10 8 10"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity=".7"
    />
    <path
      d="M52 22C38 20 21 37 17 61c-3 19 4 29 17 27 13-2 20-12 20-27V30c0-5-1-8-2-8Z"
      fill="currentColor"
      fillOpacity=".08"
      stroke="currentColor"
      strokeWidth="2"
      opacity=".8"
    />
    <path
      d="M68 22c14-2 31 15 35 39 3 19-4 29-17 27-13-2-20-12-20-27V30c0-5 1-8 2-8Z"
      fill="currentColor"
      fillOpacity=".08"
      stroke="currentColor"
      strokeWidth="2"
      opacity=".8"
    />
  </svg>
);

const HeroPreview = () => {
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-[560px] animate-fade-up [animation-delay:150ms]">
      <div className="absolute -inset-8 rounded-[48px] bg-gradient-to-tr from-brand-200/60 via-white to-accent-100/70 blur-3xl" />

      {/* App window */}
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-line">
        <div className="flex items-center gap-3 border-b border-line bg-surface/80 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          </div>
          <div className="mx-auto flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-muted ring-1 ring-line">
            <HiOutlineShieldCheck className="h-3 w-3 text-accent-600" />
            diagnoai.app/report
          </div>
          <span className="w-10" />
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          {/* Report header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white">
                SK
              </span>
              <div>
                <p className="font-display text-sm font-bold text-ink">
                  Screening report
                </p>
                <p className="text-xs text-muted">Sarah K. · Today</p>
              </div>
            </div>
            <span className="badge bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100">
              4 tests
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1.15fr_1fr]">
            {/* Lab-value screenings */}
            <ul className="space-y-2">
              {screenings.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center gap-3 rounded-2xl bg-white p-2.5 ring-1 ring-line"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.iconTone}`}
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="flex-1 text-sm font-semibold text-ink">
                    {item.name}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${item.tone}`}
                  >
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>

            {/* Image screening */}
            <div className="relative flex flex-col overflow-hidden rounded-2xl bg-ink p-3 text-white">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Chest X-ray</span>
                <span className="flex items-center gap-1 text-accent-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-400" />
                  AI scan
                </span>
              </div>
              <div className="relative my-2 flex-1 text-brand-200">
                <div className="mx-auto h-24 w-28">
                  <Lungs />
                </div>
                <span className="scan-line pointer-events-none absolute inset-x-2 h-8 bg-gradient-to-b from-transparent via-accent-400/30 to-transparent" />
              </div>
              <p className="flex items-center gap-1.5 text-xs font-semibold">
                <HiOutlineCheckBadge className="h-4 w-4 text-accent-400" />
                No pneumonia detected
              </p>
            </div>
          </div>

          {/* Next step */}
          <div className="flex items-center gap-3 rounded-2xl bg-brand-50/70 p-3 ring-1 ring-inset ring-brand-100">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 ring-1 ring-brand-100">
              <HiOutlineCalendarDays className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted">Suggested next step</p>
              <p className="truncate text-sm font-semibold text-ink">
                Review kidney values with a nephrologist
              </p>
            </div>
            <span className="hidden items-center gap-1 rounded-full bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white sm:flex">
              Book
              <HiArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <div className="absolute -top-7 right-8 hidden animate-float items-center gap-2.5 rounded-2xl bg-white/95 p-2.5 pr-4 shadow-lift ring-1 ring-line backdrop-blur lg:flex">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
          <HiOutlineCheckBadge className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[11px] text-muted">Results</p>
          <p className="text-xs font-semibold text-ink">Ready in seconds</p>
        </div>
      </div>
      <div
        className="absolute -bottom-5 -right-4 hidden animate-float items-center gap-2.5 rounded-2xl bg-white/95 p-2.5 pr-4 shadow-lift ring-1 ring-line backdrop-blur sm:flex"
        style={{ animationDelay: "1.5s" }}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <HiOutlineShieldCheck className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[11px] text-muted">Your data</p>
          <p className="text-xs font-semibold text-ink">Private &amp; secure</p>
        </div>
      </div>
    </div>
  );
};

export default HeroPreview;
