import React from "react";
import convertTime from "../../utils/convertTime.js";
import { LuCalendarCheck, LuClock, LuShieldCheck } from "react-icons/lu";

import { BASE_URL, token } from "./../../config.js";
import { toast } from "react-toastify";

const SidePanel = ({ doctorId, ticketPrice, timeSlots }) => {
  const bookingHandler = async () => {
    console.log("call");
    try {
      const res = await fetch(
        `${BASE_URL}/bookings/checkout-session/${doctorId}`,
        {
          method: "post",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Booking failed. Please try again.");
      }

      if (data.session.url) {
        window.location.href = data.session.url;
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="card p-6 lg:sticky lg:top-28 md:p-7">
      <div className="flex items-end justify-between gap-4">
        <p className="text-sm font-semibold text-muted">Consultation fee</p>
        <span className="font-display text-2xl font-bold leading-8 text-ink">
          {ticketPrice}{" "}
          <span className="text-base font-semibold text-muted">USD</span>
        </span>
      </div>

      <div className="mt-6 border-t border-line pt-6">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
          <LuClock className="h-4 w-4 text-brand-600" />
          Available time slots
        </p>

        <ul className="mt-4 space-y-2">
          {timeSlots?.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-between rounded-xl bg-surface px-4 py-2.5 ring-1 ring-inset ring-line"
            >
              <p className="text-sm font-semibold text-ink">
                {item.day.charAt(0).toUpperCase() + item.day.slice(1)}
              </p>
              <p className="text-sm text-muted">
                {convertTime(item.startingTime)} –{" "}
                {convertTime(item.endingTime)}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={bookingHandler} className="btn-primary mt-6 w-full">
        <LuCalendarCheck className="h-4 w-4" />
        Book Appointment
      </button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
        <LuShieldCheck className="h-3.5 w-3.5 text-accent-600" />
        Secure checkout
      </p>
    </div>
  );
};

export default SidePanel;
