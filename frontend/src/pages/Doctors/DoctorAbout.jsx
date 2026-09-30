import { formateDate } from "../../utils/formatDate";
import { LuBriefcase, LuGraduationCap } from "react-icons/lu";

const DoctorAbout = ({ name, about, qualifications, experiences }) => {
  return (
    <div>
      <div>
        <h3 className="text-xl font-bold leading-8 text-ink">
          About <span className="text-brand-600">{name}</span>
        </h3>
        <p className="text__para">{about}</p>
      </div>

      <div className="mt-10">
        <h3 className="flex items-center gap-2 text-lg font-bold text-ink">
          <LuGraduationCap className="h-5 w-5 text-brand-600" />
          Education
        </h3>
        <ul className="mt-5 space-y-3">
          {qualifications?.map((item, index) => (
            <li
              key={index}
              className="flex flex-col gap-1 rounded-2xl bg-surface p-4 ring-1 ring-inset ring-line sm:flex-row sm:items-center sm:justify-between sm:gap-5"
            >
              <div>
                <span className="text-sm font-semibold text-brand-600">
                  {formateDate(item.startingDate)} –{" "}
                  {formateDate(item.endingDate)}
                </span>
                <p className="mt-0.5 text-[15px] font-semibold leading-6 text-ink">
                  {item.degree}
                </p>
              </div>
              <p className="text-sm leading-5 text-muted">{item.university}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <h3 className="flex items-center gap-2 text-lg font-bold text-ink">
          <LuBriefcase className="h-5 w-5 text-brand-600" />
          Experience
        </h3>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {experiences?.map((item, index) => (
            <li
              key={index}
              className="rounded-2xl bg-accent-50/60 p-4 ring-1 ring-inset ring-accent-100"
            >
              <span className="text-sm font-semibold text-accent-600">
                {formateDate(item.startingDate)} –{" "}
                {formateDate(item.endingDate)}
              </span>
              <p className="mt-1 text-[15px] font-semibold leading-6 text-ink">
                {item.position}
              </p>
              <p className="text-sm leading-5 text-muted">{item.hospital}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DoctorAbout;
