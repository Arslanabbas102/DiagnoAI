import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LuActivity,
  LuArrowRight,
  LuBean,
  LuBug,
  LuDroplet,
  LuHeartHandshake,
  LuHeartPulse,
  LuTestTubes,
  LuWind,
} from "react-icons/lu";

// What each test needs from the user, keyed by service id
export const serviceInputs = {
  1: "8 lab values",
  2: "13 lab values",
  3: "18 lab values",
  4: "10 lab values",
  5: "26 cell measurements",
  6: "Image scan",
  7: "Image scan",
};

// Icon + tint per disease, keyed by service id
const serviceMeta = {
  1: { icon: LuDroplet, tile: "bg-amber-50 text-amber-600 ring-amber-100" },
  2: { icon: LuHeartPulse, tile: "bg-rose-50 text-rose-600 ring-rose-100" },
  3: { icon: LuBean, tile: "bg-accent-50 text-accent-600 ring-accent-100" },
  4: { icon: LuTestTubes, tile: "bg-orange-50 text-orange-600 ring-orange-100" },
  5: { icon: LuHeartHandshake, tile: "bg-pink-50 text-pink-600 ring-pink-100" },
  6: { icon: LuBug, tile: "bg-violet-50 text-violet-600 ring-violet-100" },
  7: { icon: LuWind, tile: "bg-sky-50 text-sky-600 ring-sky-100" },
};

const fallbackMeta = {
  icon: LuActivity,
  tile: "bg-brand-50 text-brand-600 ring-brand-100",
};

const ServiceCard = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = (id) => {
    // Navigate to the corresponding disease page based on the id
    navigate(`/disease/${id}`);
  };

  const { id, name, desc } = item;
  const { icon: Icon, tile } = serviceMeta[id] || fallbackMeta;

  return (
    <button
      type="button"
      onClick={() => handleClick(id)}
      className="card card-hover group flex h-full w-full flex-col p-6 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 lg:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 ring-inset ${tile}`}
        >
          <Icon className="h-6 w-6" />
        </span>
        {serviceInputs[id] && (
          <span
            className={`badge ring-1 ring-inset ${
              serviceInputs[id] === "Image scan"
                ? "bg-violet-50 text-violet-700 ring-violet-100"
                : "bg-surface text-ink-700 ring-line"
            }`}
          >
            {serviceInputs[id]}
          </span>
        )}
      </div>

      <h3 className="mt-6 text-xl font-bold leading-7 text-ink">{name}</h3>
      <p className="mt-3 line-clamp-3 text-[15px] leading-7 text-muted">
        {desc}
      </p>

      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-brand-600 transition-colors group-hover:text-brand-700">
        Start test
        <LuArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </button>
  );
};

export default ServiceCard;
