import { LuAlertTriangle } from "react-icons/lu";

const Error = ({ errMessage }) => {
  return (
    <div className="flex h-full min-h-[200px] w-full items-center justify-center px-5">
      <div
        role="alert"
        className="card flex max-w-md flex-col items-center p-8 text-center"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-100">
          <LuAlertTriangle className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-lg font-bold leading-7 text-ink">
          Something went wrong
        </h3>
        {errMessage && (
          <p className="mt-2 text-[15px] leading-6 text-muted">{errMessage}</p>
        )}
      </div>
    </div>
  );
};

export default Error;
