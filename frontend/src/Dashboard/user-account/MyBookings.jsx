import useFetchData from "../../hooks/useFetchData";
import { BASE_URL } from "../../config.js";
import DoctorCard from "./../../components/Doctors/DoctorCard";
import Loading from "../../components/Loader/Loading.jsx";
import Error from "../../components/Error/Error.jsx";

const MyBookings = () => {
  const {
    data: appointments,
    error,
    loading,
  } = useFetchData(`${BASE_URL}/users/appointments/my-appointments`);
  return (
    <div>
      {loading && !error && <Loading />}
      {error && !loading && <Error errMessage={error} />}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {appointments.map((doctor) => (
            <DoctorCard doctor={doctor} key={doctor._id} />
          ))}
        </div>
      )}
      {!loading && !error && appointments.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-12 text-center">
          <h3 className="text-[18px] font-semibold text-ink">
            No bookings yet
          </h3>
          <p className="mt-1 text-sm text-muted">
            You have not booked any doctor yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
