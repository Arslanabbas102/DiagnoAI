import React, { useState } from "react";
import Loader from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import useGetProfile from "../../hooks/useFetchData.jsx";
import { BASE_URL } from "../../config.js";
import Tabs from "./Tabs.jsx";
import starIcon from "../../assets/images/Star.png";
import DoctorAbout from "../../pages/Doctors/DoctorAbout.jsx";
import Profile from "./Profile.jsx";
import Appointments from "./Appointments.jsx";
import { HiOutlineInformationCircle } from "react-icons/hi2";

const Dashboard = () => {
  const { data, loading, error } = useGetProfile(
    `${BASE_URL}/doctors/profile/me`
  );
  console.log("data: ", data);
  const [tab, setTab] = useState("overview");

  const titles = {
    overview: ["Overview", "How your profile appears to patients."],
    appointments: ["Appointments", "Patients who have booked with you."],
    settings: ["Profile settings", "Keep your professional details up to date."],
  };

  return (
    <section className="bg-surface">
      <div className="container">
        {loading && !error && <Loader />}
        {error && !loading && <Error />}

        {!loading && !error && (
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <Tabs tab={tab} setTab={setTab} />
            <div className="min-w-0 space-y-6">
              {data.isApproved === "pending" && (
                <div
                  role="status"
                  className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-amber-800 ring-1 ring-inset ring-amber-200"
                >
                  <HiOutlineInformationCircle
                    className="mt-0.5 h-5 w-5 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Info</span>
                  <p className="text-sm font-medium leading-6">
                    To get approval please complete your profile. We&apos;ll
                    review manually and approve within 3 days.
                  </p>
                </div>
              )}

              <div className="card p-6 sm:p-8">
                {titles[tab] && (
                  <div className="mb-6 border-b border-line pb-5">
                    <h2 className="text-[22px] font-bold text-ink">
                      {titles[tab][0]}
                    </h2>
                    <p className="mt-1 text-sm text-muted">{titles[tab][1]}</p>
                  </div>
                )}

                {tab === "overview" && (
                  <div>
                    <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center">
                      <figure className="h-40 w-40 shrink-0 overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
                        <img
                          src={data?.photo}
                          alt={data?.name || "Doctor photo"}
                          className="h-full w-full object-cover"
                        />
                      </figure>

                      <div>
                        {data.specialization && (
                          <span className="badge bg-accent-50 text-accent-600 ring-1 ring-inset ring-accent-100">
                            {data.specialization}
                          </span>
                        )}

                        <h3 className="mt-3 text-[24px] font-bold leading-8 text-ink">
                          {data.name}
                        </h3>

                        <div className="mt-1 flex items-center gap-2 text-sm">
                          <span className="flex items-center gap-1.5 font-semibold text-ink">
                            <img src={starIcon} alt="" className="h-4 w-4" />
                            {data.averageRating}
                          </span>
                          <span className="text-muted">
                            ({data.totalRating})
                          </span>
                        </div>
                        <p className="mt-3 text-[15px] leading-6 text-muted lg:max-w-[420px]">
                          {data?.bio}
                        </p>
                      </div>
                    </div>
                    <DoctorAbout
                      name={data.name}
                      about={data.about}
                      qualifications={data.qualifications}
                      experiences={data.experiences}
                    />
                  </div>
                )}
                {tab === "appointments" && (
                  <div>
                    <Appointments appointments={data.appointments} />
                  </div>
                )}
                {tab === "settings" && (
                  <div>
                    <Profile doctorData={data} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
