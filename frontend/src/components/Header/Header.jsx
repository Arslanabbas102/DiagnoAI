import React, { useEffect, useState, useContext } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { HiBars3, HiXMark, HiArrowRight } from "react-icons/hi2";
import { authContext } from "../../context/AuthContext.jsx";
import Logo from "../Logo/Logo";

const navLinks = [
  { path: "/home", display: "Home" },
  { path: "/symptomchk", display: "HealthPredict" },
  { path: "/doctors", display: "Find a Doctor" },
  { path: "/services", display: "AI Tests" },
  { path: "/contact", display: "Contact" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, role, token } = useContext(authContext);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes
  useEffect(() => setMenuOpen(false), [location.pathname]);

  const profilePath =
    role === "doctor" ? "/doctors/profile/me" : "/users/profile/me";
  const initials = (user?.name || "U")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // "/" renders the home page too, so treat it as the Home link
  const isLinkActive = (path, isActive) =>
    isActive || (path === "/home" && location.pathname === "/");

  const linkClass = (path) => ({ isActive }) =>
    `rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
      isLinkActive(path, isActive)
        ? "bg-brand-50 text-brand-700"
        : "text-muted hover:text-ink hover:bg-surface"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled || menuOpen
          ? "border-b border-line bg-white/85 shadow-soft backdrop-blur-xl"
          : "border-b border-transparent bg-white/60 backdrop-blur"
      }`}
    >
      <div className="container">
        <div className="flex h-[72px] items-center justify-between gap-3">
          <Logo />

          {/* Desktop navigation */}
          <nav className="hidden lg:block" aria-label="Main">
            <ul className="flex items-center gap-1 rounded-full bg-white/70 p-1 ring-1 ring-line">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <NavLink to={link.path} className={linkClass(link.path)}>
                    {link.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {token && user ? (
              <Link
                to={profilePath}
                className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 ring-1 ring-line transition hover:ring-brand-200 hover:shadow-soft"
              >
                {user?.photo ? (
                  <img
                    src={user.photo}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    {initials}
                  </span>
                )}
                <span className="hidden max-w-[120px] truncate text-sm font-semibold text-ink sm:block">
                  {user?.name || "My account"}
                </span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost hidden sm:inline-flex">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="btn-primary whitespace-nowrap px-4 py-2.5 text-sm sm:px-5 sm:text-[15px]"
                >
                  Get started
                  <HiArrowRight className="hidden h-4 w-4 sm:block" />
                </Link>
              </>
            )}

            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink ring-1 ring-line transition hover:bg-surface lg:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <HiXMark className="h-5 w-5" />
              ) : (
                <HiBars3 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        className={`overflow-hidden transition-[max-height] duration-300 lg:hidden ${
          menuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="container pb-5" aria-label="Mobile">
          <ul className="flex flex-col gap-1 border-t border-line pt-3">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 text-[15px] font-medium ${
                      isLinkActive(link.path, isActive)
                        ? "bg-brand-50 text-brand-700"
                        : "text-ink-700 hover:bg-surface"
                    }`
                  }
                >
                  {link.display}
                </NavLink>
              </li>
            ))}
            {!(token && user) && (
              <li className="sm:hidden">
                <Link
                  to="/login"
                  className="block rounded-xl px-4 py-3 text-[15px] font-medium text-ink-700 hover:bg-surface"
                >
                  Log in
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
