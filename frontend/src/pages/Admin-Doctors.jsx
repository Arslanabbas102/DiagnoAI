import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL, token } from "../config.js";
import useFetchData from "../hooks/useFetchData.jsx";
import defaultImg from "../assets/images/default.avif";
import { Link } from "react-router-dom";
import Loading from "../components/Loader/Loading.jsx";
import Error from "../components/Error/Error.jsx";
import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";

const AdminDoctors = () => {
  const navigate = useNavigate();
  const {
    data: doctors,
    loading,
    error,
  } = useFetchData(`${BASE_URL}/admin/doctors`);

  console.log("call users");

  const getAllUsersData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/doctors`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Users data:", data);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const updateApprovalStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/doctors/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isApproved: newStatus }),
      });
      const data = await response.json();
      console.log("Updated user:", data);

      if (response.ok) {
        navigate(`/admin/doctors`);
        getAllUsersData();
      }
    } catch (error) {
      console.log("Error updating approval status:", error);
    }
  };

  useEffect(() => {
    getAllUsersData();
  }, []);

  const approvalTone = (status) =>
    status === "approved"
      ? "bg-accent-50 text-accent-600 ring-accent-100"
      : status === "cancelled"
      ? "bg-red-50 text-red-600 ring-red-100"
      : "bg-amber-50 text-amber-700 ring-amber-200";

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold leading-tight text-ink md:text-[30px]">
            Doctors
          </h1>
          <p className="mt-1 text-[15px] text-muted">Review doctor profiles and manage approval status.</p>
        </div>
        {!loading && !error && (
          <span className="badge bg-white text-ink-700 ring-1 ring-line">
            {doctors?.length || 0} total
          </span>
        )}
      </div>
      {loading && <Loading />}
      {error && <Error />}
      {!loading && !error && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-line bg-surface">
                <tr className="text-xs font-semibold uppercase tracking-wider text-muted">
                  <th scope="col" className="px-5 py-3.5">Doctor</th>
                  <th scope="col" className="px-5 py-3.5">Role</th>
                  <th scope="col" className="px-5 py-3.5">Gender</th>
                  <th scope="col" className="px-5 py-3.5">Approval</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {doctors.map((user, index) => (
                  <tr key={index} className="transition hover:bg-surface/70">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-line"
                          src={user.photo || `${defaultImg}`}
                          alt={user._id}
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-ink">{user.name}</p>
                          <p className="truncate text-xs text-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 capitalize text-ink-700">
                      {user.role || "Unknown"}
                    </td>
                    <td className="px-5 py-4 capitalize text-ink-700">
                      {user.gender || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <label htmlFor={`approvalStatus-${user._id}`} className="sr-only">
                        Approval status
                      </label>
                      <select
                        id={`approvalStatus-${user._id}`}
                        value={user.isApproved}
                        onChange={(e) =>
                          updateApprovalStatus(user._id, e.target.value)
                        }
                        className={`cursor-pointer rounded-full border-0 py-1.5 pl-3 pr-8 text-xs font-semibold ring-1 ring-inset focus:outline-none focus:ring-4 focus:ring-brand-100 ${approvalTone(
                          user.isApproved
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          aria-label="Edit doctor"
                          className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
                        >
                          <HiOutlinePencilSquare className="h-5 w-5" />
                        </button>
                        <Link
                          to={`/delete/doctor/${user._id}`}
                          aria-label="Delete doctor"
                          className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-100"
                        >
                          <HiOutlineTrash className="h-5 w-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {doctors.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-muted">
                      No doctors found.
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

export default AdminDoctors;
