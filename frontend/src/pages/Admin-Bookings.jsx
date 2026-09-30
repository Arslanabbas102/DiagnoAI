import React, { useEffect, useState } from "react";
import { BASE_URL, token } from "../config.js";
import useFetchData from "../hooks/useFetchData.jsx";
import Loading from "../components/Loader/Loading.jsx";
import Error from "../components/Error/Error.jsx";

const AdminBookings = () => {
  const [users, setUsers] = useState({});
  const [doctors, setDoctors] = useState({});

  const {
    data: bookings,
    loading,
    error,
  } = useFetchData(`${BASE_URL}/admin/bookings`);

  // console.log("call users");

  const getAllUsersData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Users data:", data);
      setUsers(data);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const getAllDoctorsData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/doctors`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Doctors data:", data);
      setDoctors(data);
    } catch (error) {
      console.log("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    getAllUsersData();
    getAllDoctorsData();
  }, []);

  const statusTone = (status) => {
    const v = String(status || "").toLowerCase();
    if (["approved", "completed", "paid"].includes(v))
      return "bg-accent-50 text-accent-600 ring-accent-100";
    if (["cancelled", "canceled", "rejected"].includes(v))
      return "bg-red-50 text-red-600 ring-red-100";
    return "bg-amber-50 text-amber-700 ring-amber-200";
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold leading-tight text-ink md:text-[30px]">
            Bookings
          </h1>
          <p className="mt-1 text-[15px] text-muted">Every appointment booked across the platform.</p>
        </div>
        {!loading && !error && (
          <span className="badge bg-white text-ink-700 ring-1 ring-line">
            {bookings?.length || 0} total
          </span>
        )}
      </div>
      {loading && <Loading />}
      {error && <Error />}
      {!loading && !error && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-line bg-surface">
                <tr className="text-xs font-semibold uppercase tracking-wider text-muted">
                  <th scope="col" className="px-5 py-3.5">Booking ID</th>
                  <th scope="col" className="px-5 py-3.5">Patient</th>
                  <th scope="col" className="px-5 py-3.5">Doctor</th>
                  <th scope="col" className="px-5 py-3.5">Ticket price</th>
                  <th scope="col" className="px-5 py-3.5">Status</th>
                  <th scope="col" className="px-5 py-3.5">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-ink-700">
                {bookings.map((booking, index) => (
                  <tr key={index} className="transition hover:bg-surface/70">
                    <td className="px-5 py-4 font-mono text-xs text-muted">
                      {booking._id || "Unknown"}
                    </td>
                    <td className="px-5 py-4 font-semibold text-ink">
                      {booking.user?.name || "Unknown User"}
                    </td>
                    <td className="px-5 py-4">
                      {booking.doctor?.name || "Unknown Doctor"}
                    </td>
                    <td className="px-5 py-4 font-medium text-ink">
                      {booking.ticketPrice || "Unknown"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`badge capitalize ring-1 ring-inset ${statusTone(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {booking.isPaid ? (
                        <span className="badge bg-accent-50 text-accent-600 ring-1 ring-inset ring-accent-100">
                          Paid
                        </span>
                      ) : (
                        <span className="badge bg-surface text-muted ring-1 ring-inset ring-line">
                          Unpaid
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-muted">
                      No bookings yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
