import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HiOutlineExclamationTriangle, HiOutlineTrash } from "react-icons/hi2";
import { toast } from "react-toastify";
import { BASE_URL, token } from "../config";

const DeleteUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDelete = () => {
    axios
      .delete(`${BASE_URL}/admin/users/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast("User Deleted successfully");
        navigate("/admin/users");
      })
      .catch((err) => {
        toast("Error", { variant: "error" });
        console.log(err);
      });
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="card w-full max-w-md p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 ring-8 ring-red-50/50">
          <HiOutlineExclamationTriangle className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-[22px] font-bold text-ink">Delete User</h1>
        <p className="mt-2 text-[15px] leading-6 text-muted">
          Are you sure you want to delete this user? This action cannot
          be undone.
        </p>
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
          <Link to="/admin/users" className="btn-secondary flex-1">
            Cancel
          </Link>
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-red-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-200"
            onClick={handleDelete}
          >
            <HiOutlineTrash className="h-5 w-5" aria-hidden="true" />
            Yes, delete it
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUser;
