import React from "react";
import { Link } from "react-router-dom";
import {
  HiArrowLeft,
  HiOutlineBeaker,
  HiOutlineUserGroup,
  HiOutlineHeart,
} from "react-icons/hi2";

const shortcuts = [
  {
    to: "/services",
    icon: HiOutlineBeaker,
    title: "AI tests",
    desc: "Run a screening in seconds",
  },
  {
    to: "/symptomchk",
    icon: HiOutlineHeart,
    title: "Symptom checker",
    desc: "Find out what fits your symptoms",
  },
  {
    to: "/doctors",
    icon: HiOutlineUserGroup,
    title: "Find a doctor",
    desc: "Book a verified specialist",
  },
];

const NotFound = () => {
  return (
    <section className="relative overflow-hidden bg-hero">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]" />
      <div className="container relative text-center">
        <p className="font-display text-[96px] font-extrabold leading-none tracking-tight text-gradient sm:text-[140px]">
          404
        </p>
        <h1 className="heading mt-4">This page took a sick day</h1>
        <p className="text__para mx-auto max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Here
          are a few places to go instead.
        </p>

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
          {shortcuts.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="card card-hover group flex flex-col gap-3 p-5"
            >
              <span className="icon-tile h-10 w-10">
                <item.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-display font-bold text-ink">
                  {item.title}
                </span>
                <span className="mt-1 block text-sm text-muted">{item.desc}</span>
              </span>
            </Link>
          ))}
        </div>

        <Link to="/home" className="btn-primary mt-10">
          <HiArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
