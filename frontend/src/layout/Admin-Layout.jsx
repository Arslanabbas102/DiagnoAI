import React, { useContext } from "react";
import { NavLink, Outlet, Routes, Route } from "react-router-dom";
import {
  HiOutlineSquares2X2,
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineTicket,
  HiOutlineArrowRightOnRectangle,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineBeaker,
} from "react-icons/hi2";
import AdminUsers from "../pages/Admin-Users";
import AdminDoctors from "../pages/Admin-Doctors";
import AdminBookings from "../pages/Admin-Bookings";
import AdminUpdate from "./pages/Admin-Update";
import { authContext } from "../context/AuthContext";
import AdminHome from "../pages/Admin-Home";
import DeleteUser from "../pages/DeleteUser";
import DeleteDoctor from "../pages/DeleteDoctor";

const AdminLayout = () => {
  const { user, dispatch } = useContext(authContext);
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const navItems = [
    { to: "/home", label: "Overview", icon: HiOutlineSquares2X2 },
    { to: "/admin/users", label: "Users", icon: HiOutlineUsers },
    { to: "/admin/doctors", label: "Doctors", icon: HiOutlineUserGroup },
    { to: "/admin/bookings", label: "Bookings", icon: HiOutlineTicket },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-[15px] font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 ${
      isActive
        ? "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100"
        : "text-ink-700 hover:bg-surface hover:text-ink"
    }`;

  const displayName = user?.name || user?.email || "Administrator";

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-white lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-line px-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-brand">
            <HiOutlineBeaker className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-[15px] font-bold text-ink">DiagnoAI</p>
            <p className="text-xs font-medium text-muted">Admin console</p>
          </div>
        </div>
        <nav aria-label="Admin" className="flex-1 space-y-1 px-4 py-6">
          <p className="px-3.5 pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            Manage
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass}>
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-line p-4">
          <div className="flex items-center gap-3 rounded-xl bg-surface p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold uppercase text-brand-700">
              {String(displayName).charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{displayName}</p>
              <p className="text-xs text-muted">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        {/* Top navbar */}
        <header className="sticky top-0 z-30 border-b border-line bg-white/80 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-4 px-5 md:px-8">
            <div className="flex items-center gap-2.5 lg:hidden">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                <HiOutlineBeaker className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="font-display text-[15px] font-bold text-ink">Admin</p>
            </div>
            <div className="hidden lg:block">
              <p className="text-sm text-muted">Welcome back,</p>
              <p className="font-display text-[15px] font-bold leading-tight text-ink">
                {displayName}
              </p>
            </div>
            <div>
              {user ? (
                <button
                  onClick={handleLogout}
                  type="button"
                  className="btn-secondary px-4 py-2 text-sm"
                >
                  <HiOutlineArrowRightOnRectangle className="h-5 w-5" aria-hidden="true" />
                  Logout
                </button>
              ) : (
                <button type="button" className="btn-primary px-4 py-2 text-sm">
                  <HiOutlineArrowLeftOnRectangle className="h-5 w-5" aria-hidden="true" />
                  Login
                </button>
              )}
            </div>
          </div>
          {/* Mobile nav */}
          <nav
            aria-label="Admin"
            className="flex gap-1 overflow-x-auto border-t border-line px-3 py-2 lg:hidden"
          >
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={linkClass}>
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="px-5 py-8 md:px-8 lg:py-10">
          <Outlet />
          <Routes>
            <Route path="/home" element={<AdminHome />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/doctors" element={<AdminDoctors />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/users/:id/edit" element={<AdminUpdate />} />
            <Route path="/delete/user/:id" element={<DeleteUser />} />
            <Route path="/delete/doctor/:id" element={<DeleteDoctor />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
