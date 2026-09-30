import React, { useEffect } from "react";
import { BASE_URL, token } from "../config.js";
import useFetchData from "../hooks/useFetchData.jsx";
import defaultImg from "../assets/images/default.avif";
import { Link } from "react-router-dom";
import Loading from "../components/Loader/Loading.jsx";
import Error from "../components/Error/Error.jsx";
import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";

const AdminUsers = () => {
  const {
    data: users,
    loading,
    error,
  } = useFetchData(`${BASE_URL}/admin/users`);

  console.log("call users");

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
      // setUsers(data);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getAllUsersData();
  }, []);

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold leading-tight text-ink md:text-[30px]">
            Users
          </h1>
          <p className="mt-1 text-[15px] text-muted">All registered accounts on the platform.</p>
        </div>
        {!loading && !error && (
          <span className="badge bg-white text-ink-700 ring-1 ring-line">
            {users?.length || 0} total
          </span>
        )}
      </div>
      {loading && <Loading />}
      {error && <Error />}
      {!loading && !error && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-line bg-surface">
                <tr className="text-xs font-semibold uppercase tracking-wider text-muted">
                  <th scope="col" className="px-5 py-3.5">User</th>
                  <th scope="col" className="px-5 py-3.5">Role</th>
                  <th scope="col" className="px-5 py-3.5">Gender</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {users.map((user, index) => (
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
                    <td className="px-5 py-4">
                      <span className="badge bg-brand-50 capitalize text-brand-700 ring-1 ring-inset ring-brand-100">
                        {user.role || "Unknown"}
                      </span>
                    </td>
                    <td className="px-5 py-4 capitalize text-ink-700">
                      {user.gender || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          aria-label="Edit user"
                          className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
                        >
                          <HiOutlinePencilSquare className="h-5 w-5" />
                        </button>
                        <Link
                          to={`/delete/user/${user._id}`}
                          aria-label="Delete user"
                          className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-100"
                        >
                          <HiOutlineTrash className="h-5 w-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-muted">
                      No users found.
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

export default AdminUsers;
