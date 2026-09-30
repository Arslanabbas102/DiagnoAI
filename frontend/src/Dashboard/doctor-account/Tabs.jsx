import React from "react";
import {
  HiOutlineSquares2X2,
  HiOutlineCalendarDays,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiOutlineTrash,
} from "react-icons/hi2";
import { useContext } from "react";
import { authContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Tabs = ({ tab, setTab }) => {
  const { dispatch } = useContext(authContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" }, navigate("/"));
  };
  const items = [
    { key: "overview", label: "Overview", icon: HiOutlineSquares2X2 },
    { key: "appointments", label: "Appointments", icon: HiOutlineCalendarDays },
    { key: "settings", label: "Settings", icon: HiOutlineCog6Tooth },
  ];

  return (
    <aside className="card h-fit p-3 lg:sticky lg:top-24 lg:p-5">
      <p className="hidden px-3 pb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted lg:block">
        Doctor dashboard
      </p>
      <nav
        aria-label="Dashboard sections"
        className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible"
      >
        {items.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            aria-current={tab === key ? "page" : undefined}
            className={`flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-[15px] font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 lg:w-full ${
              tab === key
                ? "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100"
                : "text-ink-700 hover:bg-surface"
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-3 flex gap-2 border-t border-line pt-3 lg:mt-6 lg:flex-col lg:pt-6">
        <button
          type="button"
          onClick={handleLogout}
          className="btn-secondary flex-1 py-2.5 lg:w-full"
        >
          <HiOutlineArrowRightOnRectangle className="h-5 w-5" aria-hidden="true" />
          Logout
        </button>
        <button
          type="button"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[15px] font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-100 lg:w-full"
        >
          <HiOutlineTrash className="h-5 w-5" aria-hidden="true" />
          Delete Account
        </button>
      </div>
    </aside>
  );
};

export default Tabs;
