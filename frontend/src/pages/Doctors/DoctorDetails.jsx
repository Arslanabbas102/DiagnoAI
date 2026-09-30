import { useState } from "react";
import doctorImg from "../../assets/images/doctor-img02.png";
import { HiStar } from "react-icons/hi2";
import DoctorAbout from "./DoctorAbout";
import Feedback from "./Feedback";
import SidePanel from "./SidePanel";

import { BASE_URL } from "../../config";
import useFetchData from "../../hooks/useFetchData";
import Loader from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import { useParams } from "react-router-dom";

const DoctorDetails = () => {
  const [tab, setTab] = useState("about");
  const { id } = useParams();
  const {
    data: doctor,
    loading,
    error,
  } = useFetchData(`${BASE_URL}/doctors/${id}`);

  const {
    name,
    timeSlots,
    averageRating,
    totalRating,
    photo,
    bio,
    about,
    specialization,
    experiences,
    ticketPrice,
    reviews,
    qualifications,
  } = doctor;

  const tabClass = (key) =>
    `relative -mb-px border-b-2 px-1 pb-3 text-[15px] font-semibold transition-colors focus:outline-none focus-visible:text-brand-700 ${
      tab === key
        ? "border-brand-600 text-brand-700"
        : "border-transparent text-muted hover:text-ink"
    }`;

  return (
    <section className="bg-surface">
      <div className="container">
        {loading && <Loader />}
        {error && <Error />}
        {!loading && !error && (
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
            <div className="lg:col-span-2">
              <div className="card flex flex-col gap-6 p-6 sm:flex-row sm:items-center md:p-8">
                <figure className="h-36 w-36 shrink-0 overflow-hidden rounded-2xl bg-surface ring-1 ring-line sm:h-40 sm:w-40">
                  <img
                    src={photo}
                    alt={name}
                    className="h-full w-full object-cover object-top"
                  />
                </figure>
                <div>
                  {specialization && (
                    <span className="badge bg-accent-50 text-accent-600 ring-1 ring-inset ring-accent-100">
                      {specialization}
                    </span>
                  )}
                  <h1 className="mt-3 text-2xl font-bold leading-8 text-ink md:text-[28px] md:leading-9">
                    {name}
                  </h1>
                  <div className="mt-2 flex items-center gap-1.5 text-sm">
                    <HiStar className="h-4 w-4 text-yellowColor" />
                    <span className="font-semibold text-ink">
                      {averageRating}
                    </span>
                    <span className="text-muted">
                      ({totalRating} reviews)
                    </span>
                  </div>
                  <p className="mt-3 text-[15px] leading-7 text-muted lg:max-w-[440px]">
                    {bio ||
                      "Experienced specialist dedicated to accurate diagnosis and compassionate, patient-centred care."}
                  </p>
                </div>
              </div>

              <div className="card mt-6 p-6 md:p-8">
                <div
                  role="tablist"
                  className="flex gap-8 border-b border-line"
                >
                  <button
                    role="tab"
                    aria-selected={tab === "about"}
                    onClick={() => setTab("about")}
                    className={tabClass("about")}
                  >
                    About
                  </button>

                  <button
                    role="tab"
                    aria-selected={tab === "feedback"}
                    onClick={() => setTab("feedback")}
                    className={tabClass("feedback")}
                  >
                    Feedback
                  </button>
                </div>
                <div className="mt-8">
                  {tab === "about" && (
                    <DoctorAbout
                      name={name}
                      about={about}
                      qualifications={qualifications}
                      experiences={experiences}
                    />
                  )}
                  {tab === "feedback" && (
                    <Feedback reviews={reviews} totalRating={totalRating} />
                  )}
                </div>
              </div>
            </div>

            <div>
              <SidePanel
                doctorId={doctor._id}
                ticketPrice={ticketPrice}
                timeSlots={timeSlots}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorDetails;
