import React, { useEffect, useState } from "react";
import useFetchData from "../../hooks/useFetchData";
import { BASE_URL } from "../../config";
import Loader from "../../components/Loader/Loading";
import Error from "../Error/Error";
import axios from "axios";
import { toast } from "react-toastify";
import {
  LuArrowLeft,
  LuCalendarCheck,
  LuChevronDown,
  LuStethoscope,
} from "react-icons/lu";

function DoctorsDropDown({ testName, testResult = null }) {
  const loginUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token"); // Assuming you store your token in localStorage
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const { data: doctors, loading, error } = useFetchData(`${BASE_URL}/doctors`);

  const handleSelectChange = (event) => {
    setSelectedDoctor(event.target.value);
  };

  const bookAppointment = async () => {
    console.log({ testResult });
    const payload = {
      doctorId: selectedDoctor,
      testName: testName.testName,
      testResult: testResult.testResult,
      payment: "Pending",
      price: "100",
      patientGender: loginUser.gender,
      patientName: loginUser.name,
      bookedOn: `${new Date()}`,
    };

    try {
      await axios.post(
        `${BASE_URL}/users/appointments/create-appointment`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );
      toast.success("Appointment booking done");
    } catch (error) {
      toast.error("Failed to book appointment");
      console.error(error);
    }
  };

  const selected = doctors?.find?.((doctor) => doctor._id === selectedDoctor);

  return (
    <div className="mx-auto mt-10 w-full max-w-[640px]">
      {loading && <Loader />}
      {error && <Error />}

      <div className="card p-6 md:p-8">
        <div className="flex items-start gap-4">
          <span className="icon-tile shrink-0">
            <LuStethoscope className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-xl font-bold text-ink">
              Consult a specialist
            </h3>
            <p className="mt-1 text-[15px] leading-6 text-muted">
              Share your result with a doctor and book an appointment.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="doctor-select" className="form__label">
            Select a doctor
          </label>
          <div className="relative">
            <select
              id="doctor-select"
              value={selectedDoctor}
              onChange={handleSelectChange}
              className="form__input cursor-pointer appearance-none pr-11"
            >
              <option value="" disabled>
                Select a doctor
              </option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name}
                </option>
              ))}
            </select>
            <LuChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </div>
          {selectedDoctor && (
            <p className="mt-2 text-sm text-muted">
              Selected:{" "}
              <span className="font-semibold text-ink">
                {selected?.name || selectedDoctor}
              </span>
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <a href="/home" className="btn-secondary">
            <LuArrowLeft className="h-4 w-4" />
            Back to Home
          </a>
          <button onClick={bookAppointment} className="btn-primary">
            <LuCalendarCheck className="h-4 w-4" />
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

export default DoctorsDropDown;
