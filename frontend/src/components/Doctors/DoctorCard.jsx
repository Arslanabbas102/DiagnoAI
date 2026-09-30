import React from "react";
import { Link } from "react-router-dom";
import { HiStar } from "react-icons/hi2";
import { LuArrowRight, LuMapPin } from "react-icons/lu";

const DoctorCard = ({ doctor }) => {
  const {
    name,
    avgRating,
    totalRating,
    photo,
    specialization,
    experiences,
    // totalPatients,
    // hospital,
  } = doctor;
  const hospital = experiences && experiences[0]?.hospital;

  return (
    <div className="card card-hover group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        <img
          src={photo}
          className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
          alt={name}
        />
        {specialization && (
          <span className="badge absolute left-4 top-4 bg-white/90 text-accent-600 ring-1 ring-inset ring-accent-100 backdrop-blur">
            {specialization}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 lg:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold leading-7 text-ink lg:text-xl">
            {name}
          </h3>
          <span className="flex shrink-0 items-center gap-1 pt-1 text-sm font-semibold text-ink">
            <HiStar className="h-4 w-4 text-yellowColor" />
            {avgRating}
            <span className="font-normal text-muted">({totalRating})</span>
          </span>
        </div>

        {/* <h3 className="text-[16px] leading-7 lg:text-[18px] lg:leading-[30px] font-semibold text-textColor">
          {totalPatients} + patients
        </h3> */}

        <div className="mt-auto flex items-center justify-between gap-4 pt-5">
          <p className="flex min-w-0 items-center gap-1.5 text-sm text-muted">
            {hospital && (
              <>
                <LuMapPin className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="truncate">{hospital}</span>
              </>
            )}
          </p>
          <Link
            to={`/doctors/${doctor._id}`}
            aria-label={`View profile of ${name}`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 transition group-hover:bg-brand-600 group-hover:text-white group-hover:ring-brand-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
          >
            <LuArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
