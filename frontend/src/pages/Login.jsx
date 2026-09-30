import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";
import { authContext } from "../context/AuthContext.jsx";
import {
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineBeaker,
  HiOutlineUserGroup,
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


const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(authContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
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

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: result.data,
          token: result.token,
          role: result.role,
        },
      });

      setLoading(false);
      toast.success(result.message);
      navigate("/home");
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
              <span className="eyebrow">Welcome back</span>
              <h1 className="mt-4 text-[28px] font-bold leading-tight text-ink md:text-[32px]">
                Sign in to your account
              </h1>
              <p className="mt-2 text-[15px] leading-6 text-muted">
                Access your lab reports, bookings and care team.
              </p>

              <form className="mt-8 space-y-5" onSubmit={submitHandler}>
                <div>
                  <label htmlFor="login-email" className="form__label">
                    Email address
                  </label>
                  <input
                    id="login-email"
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
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="login-password"
                      className="block text-sm font-semibold text-ink-700"
                    >
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="rounded text-sm font-semibold text-brand-600 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    autoComplete="current-password"
                    value={formData.password}
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
                  {loading ? <HashLoader size={22} color="#ffffff" /> : "Sign in"}
                </button>
              </form>

              <p className="mt-8 text-center text-[15px] text-muted">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-brand-600 hover:text-brand-700"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>

          <BrandPanel
            title="Smarter diagnostics, one secure login away."
            text="Book lab tests, review AI-assisted insights and stay connected with your doctors from a single dashboard."
            points={trustPoints}
          />
        </div>
      </div>
    </section>
  );
};

export default Login;
