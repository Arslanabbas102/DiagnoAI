import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import uploadImageToCloudinary from "../utils/uploadCloudinary";
import { BASE_URL } from "../config.js";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";
import {
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineBeaker,
  HiOutlineUserGroup,
  HiOutlineCamera,
  HiOutlineUserCircle,
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

const Signup = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photo: selectedFile,
    gender: "",
    role: "patient",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    const data = await uploadImageToCloudinary(file);

    setPreviewUrl(data.url);
    setSelectedFile(data.url);
    setFormData({ ...formData, photo: data.url });

    // console.log(data);
    //late we use it
    // console.log(file);
  };
  const submitHandler = async (event) => {
    // console.log(formData);
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const { message } = await res.json();
      if (!res.ok) {
        throw new Error(message);
      }

      setLoading(false);
      toast.success(message);
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
            <div className="mx-auto w-full max-w-[460px]">
              <span className="eyebrow">Get started</span>
              <h1 className="mt-4 text-[28px] font-bold leading-tight text-ink md:text-[32px]">
                Create your account
              </h1>
              <p className="mt-2 text-[15px] leading-6 text-muted">
                Join as a patient or doctor in under a minute.
              </p>

              <form className="mt-8 space-y-5" onSubmit={submitHandler}>
                <div>
                  <label htmlFor="signup-name" className="form__label">
                    Full name
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    placeholder="Jane Doe"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form__input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="signup-email" className="form__label">
                    Email address
                  </label>
                  <input
                    id="signup-email"
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
                  <label htmlFor="signup-password" className="form__label">
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    name="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form__input"
                    required
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="signup-role" className="form__label">
                      I am a
                    </label>
                    <select
                      id="signup-role"
                      name="role"
                      className="form__input cursor-pointer"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="select">Select</option>
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="signup-gender" className="form__label">
                      Gender
                    </label>
                    <select
                      id="signup-gender"
                      name="gender"
                      className="form__input cursor-pointer"
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="select">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <span className="form__label">Profile photo</span>
                  <div className="flex items-center gap-4 rounded-xl border border-dashed border-line bg-surface p-4">
                    {selectedFile ? (
                      <figure className="h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-brand-500 ring-offset-2">
                        <img
                          src={previewUrl}
                          className="h-full w-full object-cover"
                          alt="Profile preview"
                        />
                      </figure>
                    ) : (
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-slate-400 ring-1 ring-line">
                        <HiOutlineUserCircle className="h-8 w-8" aria-hidden="true" />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink-700">
                        {selectedFile ? "Photo uploaded" : "Add a profile photo"}
                      </p>
                      <p className="text-xs text-muted">JPG or PNG</p>
                    </div>
                    <div className="relative">
                      <input
                        type="file"
                        name="photo"
                        id="customFile"
                        accept=".jpg,.png"
                        className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        onChange={handleFileInputChange}
                      />
                      <label
                        htmlFor="customFile"
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-700 ring-1 ring-line transition hover:ring-brand-300 peer-focus-visible:ring-4 peer-focus-visible:ring-brand-100"
                      >
                        <HiOutlineCamera className="h-4 w-4" aria-hidden="true" />
                        {selectedFile ? "Change" : "Upload"}
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  disabled={loading && true}
                  type="submit"
                  className="btn-primary w-full py-3.5"
                >
                  {loading ? (
                    <HashLoader size={22} color="#ffffff" />
                  ) : (
                    "Create account"
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-[15px] text-muted">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-brand-600 hover:text-brand-700"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <BrandPanel
            title="Care that starts with better lab insight."
            text="Create an account to book tests, receive AI-assisted report summaries and consult verified doctors."
            points={trustPoints}
          />
        </div>
      </div>
    </section>
  );
};

export default Signup;
