import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiArrowRight,
  HiOutlineClipboardDocumentList,
  HiOutlineCpuChip,
  HiOutlineUserGroup,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi2";
import { services } from "../assets/data/services";
import ServiceCard from "../components/Services/ServiceCard";

const IMAGE_TESTS = ["6", "7"];

const filters = [
  { key: "all", label: "All tests" },
  { key: "lab", label: "Lab values" },
  { key: "image", label: "Image scans" },
];

const steps = [
  {
    icon: HiOutlineClipboardDocumentList,
    title: "Enter your values",
    desc: "Type in results from a lab report, or upload a scan. Sample values are available to try it out.",
  },
  {
    icon: HiOutlineCpuChip,
    title: "Get an AI assessment",
    desc: "A trained model analyses your data and returns a clear low-risk or review result in seconds.",
  },
  {
    icon: HiOutlineUserGroup,
    title: "Talk to a specialist",
    desc: "Share the result with a verified doctor and book a consultation from the same page.",
  },
];

const Services = () => {
  const [filter, setFilter] = useState("all");

  const visible = services.filter((item) => {
    if (filter === "image") return IMAGE_TESTS.includes(item.id);
    if (filter === "lab") return !IMAGE_TESTS.includes(item.id);
    return true;
  });

  return (
    <>
      <section className="bg-hero pb-10 lg:pb-14">
        <div className="container text-center">
          <span className="eyebrow">Diagnostic services</span>
          <h1 className="heading mx-auto mt-4 max-w-[720px]">
            AI-powered screening for{" "}
            <span className="text-gradient">seven major conditions</span>
          </h1>
          <p className="text__para mx-auto max-w-[620px]">
            Choose a test, enter your clinical values and get an instant,
            model-driven assessment. No account needed.
          </p>

          <div
            className="mx-auto mt-8 inline-flex rounded-full bg-white p-1 shadow-soft ring-1 ring-line"
            role="tablist"
            aria-label="Filter tests"
          >
            {filters.map((item) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={filter === item.key}
                onClick={() => setFilter(item.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition sm:px-5 ${
                  filter === item.key
                    ? "bg-brand-600 text-white shadow-brand"
                    : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-4 lg:pt-6">
        <div className="container">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((item) => (
              <ServiceCard item={item} key={item.id} />
            ))}

            {/* Not sure which test? */}
            <Link
              to="/symptomchk"
              className="group flex h-full flex-col justify-between rounded-2xl bg-gradient-to-br from-brand-700 to-brand-500 p-6 text-white shadow-brand transition hover:-translate-y-1 lg:p-7"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 ring-1 ring-inset ring-white/20">
                <HiOutlineQuestionMarkCircle className="h-6 w-6" />
              </span>
              <div className="mt-6">
                <h3 className="text-xl font-bold leading-7">
                  Not sure which test?
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-brand-100">
                  Tell our symptom checker how you feel and it will suggest
                  the most likely condition.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold">
                Check your symptoms
                <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>

          {/* How it works */}
          <div className="mt-16 rounded-3xl bg-surface p-6 ring-1 ring-line sm:p-10">
            <h2 className="text-center font-display text-2xl font-bold text-ink">
              How a test works
            </h2>
            <ol className="mt-8 grid gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="relative">
                    <span className="icon-tile bg-white">
                      <step.icon className="h-6 w-6" />
                    </span>
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white ring-2 ring-surface">
                      {index + 1}
                    </span>
                  </span>
                  <span>
                    <span className="block font-display font-bold text-ink">
                      {step.title}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-muted">
                      {step.desc}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
