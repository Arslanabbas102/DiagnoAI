import React from "react";
import { Link } from "react-router-dom";
import {
  AiFillYoutube,
  AiFillGithub,
  AiFillInstagram,
  AiFillLinkedin,
} from "react-icons/ai";
import { HiOutlineShieldCheck } from "react-icons/hi2";
import Logo from "../Logo/Logo";

const socialIcons = [
  {
    label: "GitHub",
    icon: <AiFillGithub className="h-[18px] w-[18px]" />,
  },
  {
    label: "YouTube",
    icon: <AiFillYoutube className="h-[18px] w-[18px]" />,
  },
  {
    label: "Instagram",
    icon: <AiFillInstagram className="h-[18px] w-[18px]" />,
  },
  {
    label: "LinkedIn",
    icon: <AiFillLinkedin className="h-[18px] w-[18px]" />,
  },
];

const linkGroups = [
  {
    title: "Platform",
    links: [
      { path: "/home", display: "Home" },
      { path: "/services", display: "AI Tests" },
      { path: "/symptomchk", display: "HealthPredict" },
    ],
  },
  {
    title: "Care",
    links: [
      { path: "/doctors", display: "Find a Doctor" },
      { path: "/doctors", display: "Request an Appointment" },
      { path: "/register", display: "Create an Account" },
    ],
  },
  {
    title: "Support",
    links: [
      { path: "/contact", display: "Contact Us" },
      { path: "/login", display: "Log in" },
      { path: "/forgot-password", display: "Reset Password" },
    ],
  },
];

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-ink text-slate-300">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[720px] -translate-x-1/2 rounded-full bg-brand-600/25 blur-3xl" />
      <div className="container relative">
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo light />
            <p className="mt-5 text-[15px] leading-7 text-slate-400">
              AI-assisted diagnostics for seven major diseases, connected to
              real doctors when you need them.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socialIcons.map((social) => (
                <span
                  key={social.label}
                  title={social.label}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-300 ring-1 ring-white/10"
                >
                  {social.icon}
                </span>
              ))}
            </div>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
                {group.title}
              </h2>
              <ul className="mt-5 space-y-3">
                {group.links.map((item) => (
                  <li key={item.display}>
                    <Link
                      to={item.path}
                      className="text-[15px] text-slate-400 transition hover:text-white"
                    >
                      {item.display}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {year} DiagnoAI. Based on AI-MedLab by Abdul Wahab &amp;
            Nafeesa Shehzadi.
          </p>
          <p className="flex items-center gap-2">
            <HiOutlineShieldCheck className="h-4 w-4 text-accent-400" />
            AI results are informational and not a medical diagnosis.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
