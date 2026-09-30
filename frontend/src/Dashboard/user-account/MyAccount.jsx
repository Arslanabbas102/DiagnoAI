import React, { useContext, useState } from "react";

import { authContext } from "./../../context/AuthContext.jsx";

import MyBookings from "./MyBookings.jsx";
import Profile from "./Profile.jsx";

import useGetProfile from "../../hooks/useFetchData.jsx";
import { BASE_URL } from "../../config.js";
import Loading from "../../components/Loader/Loading.jsx";
import Error from "../../components/Error/Error.jsx";
import {
  HiOutlineCalendarDays,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiOutlineTrash,
} from "react-icons/hi2";

const MyAccount = () => {
  const { dispatch } = useContext(authContext);
  const [tab, setTab] = useState("bookings");

  const {
    data: userData,
    loading,
    error,
  } = useGetProfile(`${BASE_URL}/users/profile/me`);
  // console.log(userData, " :userData");

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const tabs = [
    { key: "bookings", label: "My Bookings", icon: HiOutlineCalendarDays },
    { key: "settings", label: "Profile Settings", icon: HiOutlineCog6Tooth },
  ];

  return (
    <section className="bg-surface">
      <div className="container">
        {loading && !error && <Loading />}
        {error && !loading && <Error errMessage={error} />}
        {!loading && !error && (
          <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
            <aside className="card h-fit p-6 lg:sticky lg:top-24">
              <div className="flex flex-col items-center text-center">
                <figure className="h-24 w-24 overflow-hidden rounded-full ring-4 ring-brand-50">
                  <img
                    src={userData.photo}
                    alt={userData.name || "Profile photo"}
                    className="h-full w-full object-cover"
                  />
                </figure>
                <h3 className="mt-4 text-[18px] font-bold leading-7 text-ink">
                  {userData.name}
                </h3>
                <p className="mt-0.5 break-all text-sm text-muted">
                  {userData.email}
                </p>
                <span className="badge mt-3 bg-accent-50 text-accent-600 ring-1 ring-inset ring-accent-100">
                  Blood type
                  <span className="font-bold">{userData.bloodType || "—"}</span>
                </span>
              </div>

              <nav className="mt-6 space-y-1 border-t border-line pt-6" aria-label="Account sections">
                {tabs.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key)}
                    aria-current={tab === key ? "page" : undefined}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-[15px] font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 ${
                      tab === key
                        ? "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100"
                        : "text-ink-700 hover:bg-surface"
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    {label}
                  </button>
                ))}
              </nav>

              <div className="mt-6 space-y-2 border-t border-line pt-6">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn-secondary w-full py-2.5"
                >
                  <HiOutlineArrowRightOnRectangle className="h-5 w-5" aria-hidden="true" />
                  Logout
                </button>
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-2.5 text-[15px] font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-100"
                >
                  <HiOutlineTrash className="h-5 w-5" aria-hidden="true" />
                  Delete Account
                </button>
              </div>
            </aside>

            <div className="card min-w-0 p-6 sm:p-8">
              <div className="mb-6 border-b border-line pb-5">
                <h2 className="text-[22px] font-bold text-ink">
                  {tab === "bookings" ? "My bookings" : "Profile settings"}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {tab === "bookings"
                    ? "Doctors you have booked appointments with."
                    : "Update your personal details and profile photo."}
                </p>
              </div>
              {tab === "bookings" && <MyBookings />}
              {tab === "settings" && <Profile user={userData} />}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyAccount;
