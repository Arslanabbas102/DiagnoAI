import { useEffect, useState } from "react";
import { HiOutlineTrash, HiOutlinePlus, HiOutlineCamera, HiOutlineUserCircle } from "react-icons/hi2";
import uploadImageToCloudinary from "../../utils/uploadCloudinary";
import { BASE_URL, token } from "../../config.js";
import { toast } from "react-toastify";

const Profile = ({ doctorData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    bio: "",
    gender: "",
    specialization: "",
    ticketPrice: 0,
    qualifications: [],
    experiences: [],
    timeSlots: [],
    about: "",
    photo: "" || null,
  });

  useEffect(() => {
    setFormData({
      name: doctorData?.name,
      email: doctorData?.email,
      phone: doctorData?.phone,
      bio: doctorData?.bio,
      gender: doctorData?.gender,
      specialization: doctorData?.specialization,
      ticketPrice: doctorData?.ticketPrice,
      qualifications: doctorData?.qualifications,
      experiences: doctorData?.experiences,
      timeSlots: doctorData?.timeSlots,
      about: doctorData?.about,
      photo: doctorData?.photo,
    });
  }, [doctorData]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    const data = await uploadImageToCloudinary(file);

    setFormData({ ...formData, photo: data?.url });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/doctors/${doctorData._id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!res.ok) {
        throw Error(result.message);
      }

      // If the update was successful, show a toast message
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  //reuseable function for adding item
  const addItem = (key, item) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: [...prevFormData[key], item],
    }));
  };

  //reuseable input change function
  const handleReuseableInputChange = (key, index, event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => {
      const updateItems = [...prevFormData[key]];

      updateItems[index][name] = value;

      return {
        ...prevFormData,
        [key]: updateItems,
      };
    });
  };

  //reuseable function for deleting item
  const deleteItem = (key, index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: prevFormData[key].filter((_, i) => i !== index),
    }));
  };

  const addQualification = (e) => {
    e.preventDefault();

    addItem("qualifications", {
      startingDate: "",
      endingDate: "",
      degree: "BS-CS",
      university: "University of Gujrat",
    });
  };

  const handleQualificationChange = (event, index) => {
    handleReuseableInputChange("qualifications", index, event);
  };

  const deleteQualification = (e, index) => {
    e.preventDefault();
    deleteItem("qualifications", index);
  };

  const addExperience = (e) => {
    e.preventDefault();

    addItem("experiences", {
      startingDate: "",
      endingDate: "",
      position: "Senior Surgeon",
      hospital: "City Hospital",
    });
  };

  const handleExperienceChange = (event, index) => {
    handleReuseableInputChange("experiences", index, event);
  };

  const deleteExperience = (e, index) => {
    e.preventDefault();
    deleteItem("experiences", index);
  };

  const addTimeSlot = (e) => {
    e.preventDefault();

    addItem("timeSlots", {
      day: "Sunday",
      staringTime: "10:00",
      endingTime: "04:30",
    });
  };

  const handleTimeSlotChange = (event, index) => {
    handleReuseableInputChange("timeSlots", index, event);
  };

  const deleteTimeSlot = (e, index) => {
    e.preventDefault();
    deleteItem("timeSlots", index);
  };

  const sectionHead = (title, text) => (
    <div className="mb-5">
      <h3 className="text-[17px] font-semibold text-ink">{title}</h3>
      {text && <p className="mt-0.5 text-sm text-muted">{text}</p>}
    </div>
  );
  const addBtn =
    "inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-700 ring-1 ring-line transition hover:ring-brand-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-100";
  const deleteBtn =
    "inline-flex h-10 w-10 items-center justify-center rounded-full text-red-600 ring-1 ring-red-100 transition hover:bg-red-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-100";
  const itemCard = "relative rounded-2xl bg-surface p-5 ring-1 ring-inset ring-line";

  return (
    <div>
      <form className="divide-y divide-line">
        <div className="pb-8">
          {sectionHead("Basic information", "Shown on your public doctor profile.")}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="doc-name" className="form__label">Name*</label>
              <input
                id="doc-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="form__input"
              />
            </div>
            <div>
              <label htmlFor="doc-email" className="form__label">Email*</label>
              <input
                id="doc-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="form__input cursor-not-allowed bg-surface text-muted"
                readOnly
                aria-readonly
                disabled={true}
              />
            </div>
            <div>
              <label htmlFor="doc-phone" className="form__label">Phone*</label>
              <input
                id="doc-phone"
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="form__input"
              />
            </div>
            <div>
              <label htmlFor="doc-bio" className="form__label">Bio*</label>
              <input
                id="doc-bio"
                type="text"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Bio"
                className="form__input"
                maxLength={100}
              />
            </div>
            <div>
              <label htmlFor="doc-gender" className="form__label">Gender*</label>
              <select
                id="doc-gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="form__input cursor-pointer"
              >
                <option value="select">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="doc-specialization" className="form__label">
                Specialization*
              </label>
              <select
                id="doc-specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="form__input cursor-pointer"
              >
                <option value="select">Select</option>
                <option value="Surgeon">Surgeon</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Dermatologist">Dermatologist</option>
              </select>
            </div>
            <div>
              <label htmlFor="doc-price" className="form__label">Ticket Price</label>
              <input
                id="doc-price"
                type="number"
                placeholder="100"
                name="ticketPrice"
                value={formData.ticketPrice}
                onChange={handleInputChange}
                className="form__input"
              />
            </div>
          </div>
        </div>

        <div className="py-8">
          {sectionHead("Qualifications*", "Degrees and certifications.")}
          <div className="space-y-4">
            {formData.qualifications?.map((item, index) => (
              <div key={index} className={itemCard}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="form__label">Starting Date*</label>
                    <input
                      type="date"
                      name="startingDate"
                      value={item.startingDate}
                      className="form__input"
                      onChange={(e) => handleQualificationChange(e, index)}
                    />
                  </div>
                  <div>
                    <label className="form__label">Ending Date*</label>
                    <input
                      type="date"
                      name="endingDate"
                      value={item.endingDate}
                      className="form__input"
                      onChange={(e) => handleQualificationChange(e, index)}
                    />
                  </div>
                  <div>
                    <label className="form__label">Degree*</label>
                    <input
                      type="text"
                      name="degree"
                      value={item.degree}
                      className="form__input"
                      onChange={(e) => handleQualificationChange(e, index)}
                    />
                  </div>
                  <div>
                    <label className="form__label">University*</label>
                    <input
                      type="text"
                      name="university"
                      value={item.university}
                      className="form__input"
                      onChange={(e) => handleQualificationChange(e, index)}
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={(e) => deleteQualification(e, index)}
                    className={deleteBtn}
                    aria-label="Remove qualification"
                  >
                    <HiOutlineTrash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={addQualification} className={`${addBtn} mt-4`}>
            <HiOutlinePlus className="h-4 w-4" aria-hidden="true" />
            Add Qualification
          </button>
        </div>

        <div className="py-8">
          {sectionHead("Experience*", "Positions you have held.")}
          <div className="space-y-4">
            {formData.experiences?.map((item, index) => (
              <div key={index} className={itemCard}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="form__label">Starting Date*</label>
                    <input
                      type="date"
                      name="startingDate"
                      value={item.startingDate}
                      className="form__input"
                      onChange={(e) => handleExperienceChange(e, index)}
                    />
                  </div>
                  <div>
                    <label className="form__label">Ending Date*</label>
                    <input
                      type="date"
                      name="endingDate"
                      value={item.endingDate}
                      className="form__input"
                      onChange={(e) => handleExperienceChange(e, index)}
                    />
                  </div>
                  <div>
                    <label className="form__label">Position*</label>
                    <input
                      type="text"
                      name="position"
                      value={item.position}
                      className="form__input"
                      onChange={(e) => handleExperienceChange(e, index)}
                    />
                  </div>
                  <div>
                    <label className="form__label">Hospital*</label>
                    <input
                      type="text"
                      name="hospital"
                      value={item.hospital}
                      className="form__input"
                      onChange={(e) => handleExperienceChange(e, index)}
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={(e) => deleteExperience(e, index)}
                    className={deleteBtn}
                    aria-label="Remove experience"
                  >
                    <HiOutlineTrash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={addExperience} className={`${addBtn} mt-4`}>
            <HiOutlinePlus className="h-4 w-4" aria-hidden="true" />
            Add Experience
          </button>
        </div>

        <div className="py-8">
          {sectionHead("Time slots*", "When patients can book you.")}
          <div className="space-y-4">
            {formData.timeSlots?.map((item, index) => (
              <div key={index} className={itemCard}>
                <div className="grid items-end gap-4 sm:grid-cols-[1fr_1fr_1fr_auto]">
                  <div>
                    <label className="form__label">Day*</label>
                    <select
                      name="day"
                      value={item.day}
                      className="form__input cursor-pointer"
                      onChange={(e) => handleTimeSlotChange(e, index)}
                    >
                      <option value="select">Select</option>
                      <option value="saturday">Saturday</option>
                      <option value="sunday">Sunday</option>
                      <option value="monday">Monday</option>
                      <option value="tuesday">Tuesday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="thursday">Thursday</option>
                      <option value="friday">Friday</option>
                    </select>
                  </div>
                  <div>
                    <label className="form__label">Starting Time*</label>
                    <input
                      type="time"
                      name="startingTime"
                      value={item.startingTime}
                      className="form__input"
                      onChange={(e) => handleTimeSlotChange(e, index)}
                    />
                  </div>
                  <div>
                    <label className="form__label">Ending Time*</label>
                    <input
                      type="time"
                      name="endingTime"
                      value={item.endingTime}
                      className="form__input"
                      onChange={(e) => handleTimeSlotChange(e, index)}
                    />
                  </div>
                  <div className="flex justify-end pb-1">
                    <button
                      onClick={(e) => deleteTimeSlot(e, index)}
                      className={deleteBtn}
                      aria-label="Remove time slot"
                    >
                      <HiOutlineTrash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={addTimeSlot} className={`${addBtn} mt-4`}>
            <HiOutlinePlus className="h-4 w-4" aria-hidden="true" />
            Add Time Slot
          </button>
        </div>

        <div className="py-8">
          {sectionHead("About*", null)}
          <textarea
            name="about"
            aria-label="About"
            rows={5}
            value={formData.about}
            placeholder="Write about yourself..."
            onChange={handleInputChange}
            className="form__input resize-y"
          ></textarea>
        </div>

        <div className="py-8">
          {sectionHead("Profile photo", null)}
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
              <p className="text-sm font-semibold text-ink-700">Your profile photo</p>
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

        <div className="flex justify-end pt-8">
          <button
            type="submit"
            onClick={handleUpdateProfile}
            className="btn-primary w-full sm:w-auto sm:min-w-[180px]"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
