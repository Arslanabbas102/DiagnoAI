import React, { useEffect, useState } from "react";
import { doctors } from "./../../assets/data/doctors";
import DoctorCard from "./../../components/Doctors/DoctorCard";
import Testimonial from "./../../components/Testimonial/Testimonial";
import { LuSearch } from "react-icons/lu";

import { BASE_URL } from "../../config";
import useFetchData from "../../hooks/useFetchData";
import Loader from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";

const Doctors = () => {
  const [query, setQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useState("");

  const handleSearch = () => {
    setQuery(query.trim());
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebounceQuery(query);
    }, 700);

    return () => clearTimeout(timeOut);
  }, [query]);
  const {
    data: doctors,
    loading,
    error,
  } = useFetchData(`${BASE_URL}/doctors?query=${debounceQuery}`);

  return (
    <>
      <section className="bg-hero">
        <div className="container text-center">
          <span className="eyebrow">Our specialists</span>
          <h1 className="heading mt-4">
            Find the right <span className="text-gradient">doctor</span>
          </h1>
          <p className="text__para mx-auto max-w-[560px]">
            Search our network of verified specialists by name or
            specialization and book a consultation in minutes.
          </p>

          <div className="mx-auto mt-8 flex max-w-[600px] items-center gap-2 rounded-full bg-white p-1.5 shadow-soft ring-1 ring-line transition focus-within:ring-4 focus-within:ring-brand-100">
            <LuSearch className="ml-4 h-5 w-5 shrink-0 text-slate-400" />
            <input
              type="search"
              aria-label="Search doctors"
              className="w-full bg-transparent py-2.5 pl-1 pr-2 text-[15px] text-ink placeholder:text-slate-400 focus:outline-none"
              placeholder="Search by doctor name or specialization"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn-primary shrink-0 px-5 py-2.5" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </section>

      <section>
        {loading && <Loader />}
        {error && <Error />}
        {!loading && !error && (
          <div className="container">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="bg-surface">
        <div className="container">
          <div className="mx-auto max-w-[560px] text-center">
            <span className="eyebrow">Testimonials</span>
            <h2 className="heading mt-4">What our patients say</h2>
            <p className="text__para">
              World-class care for everyone. Our health system offers
              unmatched, expert health care.
            </p>
          </div>
          <Testimonial />
        </div>
      </section>
    </>
  );
};

export default Doctors;
