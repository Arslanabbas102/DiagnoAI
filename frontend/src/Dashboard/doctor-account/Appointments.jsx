import React from "react";
import { formateDate } from "../../utils/formatDate.js";

const Appointments = ({ appointments }) => {
  console.log("appointments: ", appointments);
  const statusClass = (status) => {
    const value = String(status || "").toLowerCase();
    if (["approved", "paid", "completed", "success"].includes(value))
      return "bg-accent-50 text-accent-600 ring-accent-100";
    if (["cancelled", "canceled", "failed", "rejected"].includes(value))
      return "bg-red-50 text-red-600 ring-red-100";
    return "bg-amber-50 text-amber-700 ring-amber-200";
  };

  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-line">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max text-left text-sm">
          <thead className="bg-surface">
            <tr className="text-xs font-semibold uppercase tracking-wider text-muted">
              <th scope="col" className="px-5 py-3.5">Name</th>
              <th scope="col" className="px-5 py-3.5">Gender</th>
              <th scope="col" className="px-5 py-3.5">Payment</th>
              <th scope="col" className="px-5 py-3.5">Price</th>
              <th scope="col" className="px-5 py-3.5">Booked on</th>
              <th scope="col" className="px-5 py-3.5">Test name</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white text-ink-700">
            {appointments?.map((item) => (
              <tr key={item._id} className="transition hover:bg-surface/70">
                <td className="whitespace-nowrap px-5 py-4 font-semibold text-ink">
                  {item.user.name}
                </td>
                <td className="px-5 py-4 capitalize">{item.user.gender}</td>
                <td className="px-5 py-4">
                  <span
                    className={`badge capitalize ring-1 ring-inset ${statusClass(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-5 py-4 font-medium text-ink">
                  {item.ticketPrice}
                </td>
                <td className="px-5 py-4 text-muted">
                  {formateDate(item.updatedAt)}
                </td>
                <td className="px-5 py-4">{item.testName || "Pneumonia"}</td>
              </tr>
            ))}
            {(!appointments || appointments.length === 0) && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-muted">
                  No appointments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;
