import { doctors } from "./../../assets/data/doctors";
import DoctorCard from "./DoctorCard";

import { BASE_URL } from "../../config";
import useFetchData from "../../hooks/useFetchData";
import Loader from "../../components/Loader/Loading";
import Error from "../Error/Error";

const DoctorList = () => {
  const { data: doctors, loading, error } = useFetchData(`${BASE_URL}/doctors`);
  return (
    <>
      {loading && <Loader />}
      {error && <Error />}

      {!loading && !error && doctors.length === 0 && (
        <div className="card mx-auto mt-10 max-w-md px-6 py-10 text-center lg:mt-14">
          <p className="font-display text-lg font-bold text-ink">
            No doctors listed yet
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Specialists will appear here once they join and are approved.
          </p>
        </div>
      )}

      {!loading && !error && doctors.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      )}
    </>
  );
};

export default DoctorList;
