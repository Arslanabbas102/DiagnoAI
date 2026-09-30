import React from "react";
import aboutimg from "../../assets/images/about.png";
import { Link } from "react-router-dom";
import {
  LuArrowRight,
  LuBadgeCheck,
  LuShieldCheck,
  LuSparkles,
} from "react-icons/lu";

const highlights = [
  {
    icon: LuSparkles,
    title: "AI-assisted screening",
    text: "Validated models for seven major conditions.",
  },
  {
    icon: LuShieldCheck,
    title: "Private by design",
    text: "Your health data stays secure and confidential.",
  },
];

const About = () => {
  return (
    <div>
      <section>
        <div className="container">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
            {/* ========== about image ========== */}
            <div className="relative order-2 mx-auto w-full max-w-[560px] lg:order-1">
              <div
                aria-hidden="true"
                className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-50 via-white to-accent-50"
              />
              <div className="overflow-hidden rounded-3xl ring-1 ring-line">
                <img
                  src={aboutimg}
                  alt="Doctor consulting with a patient"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="card absolute -bottom-6 right-4 flex items-center gap-3 px-5 py-4 shadow-lift animate-float sm:right-8">
                <span className="icon-tile h-11 w-11 bg-accent-50 text-accent-600 ring-accent-100">
                  <LuBadgeCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-base font-bold leading-6 text-ink">
                    Trusted care
                  </p>
                  <p className="text-sm text-muted">From diagnosis to recovery</p>
                </div>
              </div>
            </div>

            {/* ========== About Content ========== */}
            <div className="order-1 lg:order-2">
              <span className="eyebrow">About us</span>
              <h2 className="heading mt-4">
                Proud to be one of the{" "}
                <span className="text-gradient">nation's best</span>
              </h2>
              <p className="text__para">
                We excel in addressing diverse healthcare challenges. Our
                comprehensive approach tackles issues from diagnosis to
                management, ensuring patients receive exceptional care and
                support throughout their treatment journey.
              </p>
              <p className="text__para">
                By integrating advanced medical practices with personalized
                care, we aim to improve patient outcomes and quality of life.
                Our commitment to excellence drives us to continuously innovate
                and provide solutions for even the most complex medical
                conditions.
              </p>

              <ul className="mt-8 grid gap-5 sm:grid-cols-2">
                {highlights.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-3">
                    <span className="icon-tile h-10 w-10 shrink-0">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{title}</p>
                      <p className="mt-0.5 text-sm leading-6 text-muted">
                        {text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <Link to="/" className="btn-primary mt-10">
                Learn more
                <LuArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
