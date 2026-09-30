import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import uploadImageToCloudinary from "../../utils/uploadCloudinary.js";
import { BASE_URL, token } from "../../config.js";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";
import { HiOutlineCamera, HiOutlineUserCircle } from "react-icons/hi2";
const Profile = ({ user }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Inside Profile component
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    password: user.password || "",
    photo: user.photo || null,
    gender: user.gender || "",
    bloodType: user.bloodType || "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      photo: user.photo,
      gender: user.gender,
      bloodType: user.bloodType,
    });
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    const data = await uploadImageToCloudinary(file);

    setSelectedFile(data.url);
    setFormData((prevFormData) => ({
      ...prevFormData,
      photo: data.url || prevFormData.photo,
    }));
  };
  const submitHandler = async (event) => {
    // console.log(formData);
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/users/${user._id}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const { message } = await res.json();
      if (!res.ok) {
        throw new Error(message);
      }

      setLoading(false);
      toast.success(message);
      navigate("/users/profile/me");
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="user-name" className="form__label">
              Full name
            </label>
            <input
              id="user-name"
              type="text"
              placeholder="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form__input"
              required
            />
          </div>
          <div>
            <label htmlFor="user-email" className="form__label">
              Email address
            </label>
            <input
              id="user-email"
              type="email"
              placeholder="Enter Your Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form__input cursor-not-allowed bg-surface text-muted"
              aria-readonly
              readOnly
            />
          </div>
          <div>
            <label htmlFor="user-password" className="form__label">
              Password
            </label>
            <input
              id="user-password"
              type="password"
              placeholder="Leave blank to keep current"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form__input"
            />
          </div>
          <div>
            <label htmlFor="user-blood" className="form__label">
              Blood type
            </label>
            <input
              id="user-blood"
              type="text"
              placeholder="e.g. O+"
              name="bloodType"
              value={formData.bloodType}
              onChange={handleInputChange}
              className="form__input"
              required
            />
          </div>
          <div>
            <label htmlFor="user-gender" className="form__label">
              Gender
            </label>
            <select
              id="user-gender"
              name="gender"
              className="form__input cursor-pointer"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="select">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <span className="form__label">Profile photo</span>
          <div className="flex items-center gap-4 rounded-xl border border-dashed border-line bg-surface p-4">
            {formData.photo ? (
              <figure className="h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-brand-500 ring-offset-2">
                <img
                  src={formData.photo}
                  className="h-full w-full object-cover"
                  alt="Profile preview"
                />
              </figure>
            ) : (
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-slate-400 ring-1 ring-line">
                <HiOutlineUserCircle className="h-8 w-8" aria-hidden="true" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink-700">
                {selectedFile ? "New photo uploaded" : "Your profile photo"}
              </p>
              <p className="text-xs text-muted">JPG or PNG</p>
            </div>
            <div className="relative">
              <input
                type="file"
                name="photo"
                id="customFile"
                accept=".jpg,.png"
                className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
                onChange={handleFileInputChange}
              />
              <label
                htmlFor="customFile"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-700 ring-1 ring-line transition hover:ring-brand-300 peer-focus-visible:ring-4 peer-focus-visible:ring-brand-100"
              >
                <HiOutlineCamera className="h-4 w-4" aria-hidden="true" />
                {formData.photo ? "Change" : "Upload"}
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-line pt-6">
          <button
            disabled={loading && true}
            type="submit"
            className="btn-primary w-full sm:w-auto sm:min-w-[160px]"
          >
            {loading ? <HashLoader size={22} color="#ffffff" /> : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
