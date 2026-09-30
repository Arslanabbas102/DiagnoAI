import React from "react";
import featureimg from "../assets/images/feature-img.png";
import avatarIcon from "../assets/images/avatar-icon.png";
import { Link, useNavigate } from "react-router-dom";
import {
  HiArrowRight,
  HiOutlineBeaker,
  HiOutlineCalendarDays,
  HiOutlineCpuChip,
  HiOutlineSparkles,
  HiOutlineUserGroup,
  HiOutlineVideoCamera,
  HiCheck,
} from "react-icons/hi2";
import About from "../components/About/About";
import ServiceList from "../components/Services/ServiceList";
import DoctorList from "../components/Doctors/DoctorList";
import FaqList from "../components/Faq/FaqList";
import Testimonial from "../components/Testimonial/Testimonial";
import HeroPreview from "../components/Home/HeroPreview";
import { toast } from "react-toastify";

const diseases = [
  "Diabetes",
  "Heart Disease",
  "Kidney Disease",
  "Liver Disease",
  "Breast Cancer",
  "Malaria",
  "Pneumonia",
];

const stats = [
  { value: "7", label: "AI screening models" },
  { value: "132", label: "Symptoms understood" },
  { value: "41", label: "Conditions recognised" },
  { value: "24/7", label: "Available, no sign-up needed" },
];

const steps = [
  {
    icon: HiOutlineUserGroup,
    title: "Find a doctor",
    desc: "Browse verified specialists, compare ratings and pick the right expert for your needs.",
    path: "/doctors",
    cta: "Browse doctors",
  },
  {
    icon: HiOutlineCpuChip,
    title: "Run an AI test",
    desc: "Enter your lab values or upload a scan and get an instant AI-assisted risk assessment.",
    path: "/services",
    cta: "Explore AI tests",
  },
  {
    icon: HiOutlineCalendarDays,
    title: "Book an appointment",
    desc: "Share your results with a doctor and schedule an in-person or virtual consultation.",
    path: "/doctors",
    cta: "Book a visit",
  },
];

const SectionHeader = ({ eyebrow, title, desc }) => (
  <div className="mx-auto max-w-2xl text-center">
    <span className="eyebrow">{eyebrow}</span>
    <h2 className="heading mt-4">{title}</h2>
    {desc && <p className="text__para">{desc}</p>}
  </div>
);

const Home = () => {
  const navigate = useNavigate(); // Get the navigate function from useNavigate
  const bookAppointment = async () => {
    toast.success("Find your Doctor");
    navigate("/doctors"); // Redirect to the /doctors route
  };
  return (
    <>
      {/* ========== Hero ========== */}
      <section className="relative overflow-hidden bg-hero pb-20 pt-12 lg:pb-28 lg:pt-16">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
        <div className="container relative">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
            <div className="animate-fade-up">
              <span className="eyebrow">
                <HiOutlineSparkles className="h-3.5 w-3.5" />
                AI-powered medical laboratory
              </span>
              <h1 className="mt-6 font-display text-[40px] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-[52px] lg:text-[60px]">
                Smarter lab results.{" "}
                <span className="text-gradient">Healthier lives.</span>
              </h1>
              <p className="mt-6 max-w-xl text-[17px] leading-8 text-muted">
                A healthcare platform that supports the diagnosis, treatment
                and management of seven major diseases, with accurate
                information, personalised care and doctors one click away.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link to="/services" className="btn-primary px-7 py-3.5">
                  <HiOutlineBeaker className="h-5 w-5" />
                  Start a free AI test
                </Link>
                <button onClick={bookAppointment} className="btn-secondary px-7 py-3.5">
                  Request an appointment
                  <HiArrowRight className="h-4 w-4" />
                </button>
              </div>

              <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                {["No sign-up needed", "Results in seconds", "Doctors one click away"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-100 text-accent-600">
                        <HiCheck className="h-3 w-3" />
                      </span>
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Hero visual */}
            <HeroPreview />
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-line ring-1 ring-line lg:mt-24 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/90 px-6 py-7 backdrop-blur">
                <p className="font-display text-3xl font-extrabold tracking-tight text-ink lg:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Disease coverage strip ========== */}
      <div className="border-y border-line bg-white py-6">
        <div className="container flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
          <p className="text-sm font-medium text-muted">
            AI screening available for
          </p>
          <ul className="flex flex-wrap justify-center gap-2">
            {diseases.map((disease) => (
              <li
                key={disease}
                className="rounded-full bg-surface px-3.5 py-1.5 text-sm font-medium text-ink-700 ring-1 ring-line"
              >
                {disease}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ========== How it works ========== */}
      <section>
        <div className="container">
          <SectionHeader
            eyebrow="How it works"
            title="Care that fits around you"
            desc="From first symptoms to a specialist consultation, everything you need lives in one place."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="card card-hover group relative p-8">
                <span className="absolute right-6 top-6 font-display text-5xl font-extrabold text-surface transition group-hover:text-brand-50">
                  0{index + 1}
                </span>
                <span className="icon-tile relative">
                  <step.icon className="h-6 w-6" />
                </span>
                <h3 className="relative mt-6 text-xl font-bold text-ink">
                  {step.title}
                </h3>
                <p className="relative mt-3 leading-7 text-muted">{step.desc}</p>
                <Link
                  to={step.path}
                  className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700"
                >
                  {step.cta}
                  <HiArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== About ========== */}
      <About />

      {/* ========== Services ========== */}
      <section className="bg-surface">
        <div className="container">
          <SectionHeader
            eyebrow="AI diagnostics"
            title="Our medical services"
            desc="Seven AI models trained on clinical data, each giving you a fast, informed first look at your health."
          />
          <ServiceList />
        </div>
      </section>

      {/* ========== Virtual treatment ========== */}
      <section>
        <div className="container">
          <div className="relative overflow-hidden rounded-[32px] bg-ink px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
            <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-600/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
            <div className="relative grid items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="eyebrow bg-white/10 text-white ring-white/15">
                  <HiOutlineVideoCamera className="h-3.5 w-3.5" />
                  Telehealth
                </span>
                <h2 className="mt-5 font-display text-[30px] font-bold leading-tight tracking-tight text-white md:text-[42px]">
                  Get virtual treatment, anytime
                </h2>
                <ul className="mt-8 space-y-4">
                  {[
                    "Schedule the appointment directly.",
                    "Search for your physician here and contact their office.",
                    "Meet your doctor online from wherever you are.",
                  ].map((item, index) => (
                    <li key={item} className="flex items-start gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white ring-1 ring-white/15">
                        {index + 1}
                      </span>
                      <span className="pt-1 text-[16px] leading-7 text-slate-300">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/doctors"
                  className="btn-primary mt-10 bg-white text-ink shadow-none hover:bg-brand-50"
                >
                  Find your doctor
                  <HiArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="relative mx-auto w-full max-w-[420px]">
                <img
                  src={featureimg}
                  className="w-full rounded-3xl object-cover ring-1 ring-white/10"
                  alt="Doctor available for a virtual consultation"
                />
                <div className="absolute -bottom-6 -left-4 w-[230px] rounded-2xl bg-white p-4 shadow-lift sm:-left-10">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">
                      <span className="font-semibold text-ink">Tue, 24</span>{" "}
                      <span className="text-muted">10:00 AM</span>
                    </p>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                      <HiOutlineVideoCamera className="h-4 w-4" />
                    </span>
                  </div>
                  <span className="badge mt-3 bg-accent-50 text-accent-600">
                    Consultation
                  </span>
                  <div className="mt-3 flex items-center gap-2.5">
                    <img src={avatarIcon} className="h-8 w-8 rounded-full" alt="" />
                    <p className="text-sm font-semibold text-ink">Abdul Wahab</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Doctors ========== */}
      <section className="pt-0 lg:pt-4">
        <div className="container">
          <SectionHeader
            eyebrow="Our specialists"
            title="Meet our great doctors"
            desc="Experienced, verified specialists ready to review your results and guide your care."
          />
          <DoctorList />
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="bg-surface">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <span className="eyebrow">FAQ</span>
              <h2 className="heading mt-4">
                Questions our patients ask most
              </h2>
              <p className="text__para">
                Can&apos;t find what you&apos;re looking for? Our team is happy
                to help.
              </p>
              <Link to="/contact" className="btn-secondary mt-8">
                Contact support
                <HiArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div>
              <FaqList />
            </div>
          </div>
        </div>
      </section>

      {/* ========== Testimonials ========== */}
      <section>
        <div className="container">
          <SectionHeader
            eyebrow="Testimonials"
            title="What our patients say"
            desc="Real stories from people who used DiagnoAI to take charge of their health."
          />
          <Testimonial />
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="pt-0 lg:pt-0">
        <div className="container">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 px-6 py-14 text-center sm:px-12 lg:py-20">
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-display text-[30px] font-bold leading-tight tracking-tight text-white md:text-[42px]">
                Your health check, in minutes
              </h2>
              <p className="mt-4 text-[17px] leading-8 text-brand-100">
                Create a free account to run AI screenings, save your results
                and book the right specialist.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="btn-primary bg-white px-7 py-3.5 text-brand-700 shadow-none hover:bg-brand-50"
                >
                  Create free account
                  <HiArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/symptomchk"
                  className="btn-primary bg-white/10 px-7 py-3.5 shadow-none ring-1 ring-white/25 hover:bg-white/20"
                >
                  Check your symptoms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
