import HashLoader from "react-spinners/HashLoader";
const Loading = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-4"
    >
      <HashLoader color="#2A4BDB" size={40} />
      <span className="text-sm font-medium text-muted">Loading…</span>
    </div>
  );
};

export default Loading;
