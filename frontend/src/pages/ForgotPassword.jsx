import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import { toast } from "react-toastify";
import {
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineBeaker,
  HiOutlineUserGroup,
  HiOutlineKey,
} from "react-icons/hi2";

const BrandPanel = ({ title, text, points }) => (
  <aside className="relative hidden overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 p-10 text-white shadow-lift lg:flex lg:flex-col lg:justify-between xl:p-12">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-grid opacity-20"
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-400/30 blur-3xl"
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl"
    />
    <div className="relative">
      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white ring-1 ring-inset ring-white/20">
        <HiOutlineSparkles className="h-4 w-4" aria-hidden="true" />
        DiagnoAI
      </span>
      <h2 className="mt-8 max-w-sm text-[34px] font-bold leading-[1.15] text-white">
        {title}
      </h2>
      <p className="mt-4 max-w-sm text-[16px] leading-7 text-brand-100">
        {text}
      </p>
    </div>
    <ul className="relative mt-12 space-y-4">
      {points.map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-inset ring-white/20">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-[15px] font-medium text-white/90">{label}</span>
        </li>
      ))}
    </ul>
  </aside>
);

const trustPoints = [
  { icon: HiOutlineShieldCheck, label: "Secure, encrypted health records" },
  { icon: HiOutlineBeaker, label: "AI-assisted lab report insights" },
  { icon: HiOutlineUserGroup, label: "Verified doctors and specialists" },
];


const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/forgot-password`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }

      setLoading(false);
      toast.success(result.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <section className="bg-hero py-10 lg:py-16">
      <div className="container">
        <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="card animate-fade-up flex flex-col justify-center p-6 sm:p-10 xl:p-12">
            <div className="mx-auto w-full max-w-[420px]">
              <span className="icon-tile">
                <HiOutlineKey className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="eyebrow mt-6">Account recovery</span>
              <h1 className="mt-4 text-[28px] font-bold leading-tight text-ink md:text-[32px]">
                Forgot your password?
              </h1>
              <p className="mt-2 text-[15px] leading-6 text-muted">
                Enter the email linked to your account and we will send you a secure reset link.
              </p>

              <form className="mt-8 space-y-5" onSubmit={submitHandler}>
                <div>
                  <label htmlFor="forgot-email" className="form__label">
                    Email address
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    placeholder="you@example.com"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form__input"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5"
                >
                  {loading ? "Please wait..." : "Send reset link"}
                </button>
              </form>

              <p className="mt-8 text-center text-[15px] text-muted">
                Remembered your password?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-brand-600 hover:text-brand-700"
                >
                  Back to sign in
                </Link>
              </p>
            </div>
          </div>

          <BrandPanel
            title="Your health data stays protected."
            text="Password resets use a time-limited, single-use link sent only to your registered email."
            points={trustPoints}
          />
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
