import React, { useEffect, useId, useRef, useState } from "react";
import {
  HiOutlineBeaker,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineInformationCircle,
  HiOutlineCloudArrowUp,
  HiOutlinePhoto,
  HiOutlineSparkles,
  HiOutlineXMark,
  HiOutlineArrowPath,
  HiOutlineCalendarDays,
  HiChevronRight,
} from "react-icons/hi2";

/* -------------------------------------------------------------------------- */
/*  Shared building blocks for the AI diagnostic test pages.                  */
/*  Components here are presentational: pages pass their own state,           */
/*  handlers and prediction results in. A few small pure helpers (parsing,    */
/*  scrolling) live here too so every test behaves the same way.              */
/* -------------------------------------------------------------------------- */

/** Id of the doctor-booking section; "Book a specialist" scrolls here. */
export const SPECIALIST_SECTION_ID = "book-specialist";

/** Smoothly scrolls to the doctor-booking section below the test. */
export const scrollToSpecialist = () => {
  const el = document.getElementById(SPECIALIST_SECTION_ID);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

/** Smoothly scrolls an element into view (used by "Run another test"). */
export const scrollToElement = (el) => {
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

/** Returns a copy of `obj` with every value set to "" (keys untouched). */
export const emptyValues = (obj) =>
  Object.fromEntries(Object.keys(obj).map((key) => [key, ""]));

/** Number of non-empty string values in a form-state object. */
export const countFilled = (obj) =>
  Object.values(obj).filter((value) => String(value).trim() !== "").length;

/**
 * Parses the image-model output. The API returns the class probabilities as a
 * string such as "[0.97, 0.03]\n" (index 0 = normal, index 1 = pneumonia /
 * infected). Returns `{ probs }` on success or `{ error }` with a friendly
 * message when the model failed or the output cannot be read.
 */
export const parseImagePrediction = (pred) => {
  const fail = {
    error:
      "We couldn't analyse this image. Please try a clearer image or run the test again.",
  };
  let probs = null;
  if (Array.isArray(pred)) {
    probs = pred;
  } else if (typeof pred === "string") {
    const text = pred.trim();
    if (!text || text.startsWith("Error")) return fail;
    try {
      probs = JSON.parse(text);
    } catch {
      // Tolerate extra log lines around the list: use the last "[a, b]" found.
      const matches = text.match(/\[[-+\d.eE,\s]+\]/g);
      if (!matches) return fail;
      try {
        probs = JSON.parse(matches[matches.length - 1]);
      } catch {
        return fail;
      }
    }
  }
  if (
    !Array.isArray(probs) ||
    probs.length < 2 ||
    !probs.every((p) => typeof p === "number" && Number.isFinite(p))
  ) {
    return fail;
  }
  return { probs };
};

/**
 * Splits a human-readable state key such as "Glucose (mg/dL) eg. 80" into a
 * display label ("Glucose (mg/dL)") and an example ("80"). The key itself is
 * never modified; this is display-only.
 */
export const parseFieldKey = (key) => {
  const match = key.match(/^(.*?)\s+eg\.\s*(.+)$/i);
  if (match) return { label: match[1].trim(), example: match[2].trim() };
  return { label: key, example: "" };
};

/** Page shell: header band + two-column body (form | sticky aside). */
export const TestLayout = ({
  title,
  description,
  icon: Icon = HiOutlineBeaker,
  badge,
  form,
  aside,
  children,
}) => (
  <div className="bg-white">
    <header className="bg-hero border-b border-line">
      <div className="container py-10 md:py-14">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs font-medium text-muted"
        >
          <span>Services</span>
          <HiChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-brand-700">AI Diagnostics</span>
        </nav>
        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-soft ring-1 ring-line">
            <Icon className="h-7 w-7" aria-hidden="true" />
          </div>
          <div className="animate-fade-up">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[28px] font-bold leading-tight text-ink md:text-[36px]">
                {title}
              </h1>
              {badge && (
                <span className="badge bg-accent-50 text-accent-600 ring-1 ring-inset ring-accent-100">
                  {badge}
                </span>
              )}
            </div>
            <p className="mt-2 max-w-2xl text-[15px] leading-7 text-muted md:text-base">
              {description}
            </p>
          </div>
        </div>
      </div>
    </header>

    <section className="!py-10 lg:!py-14">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div className="min-w-0">{form}</div>
          <aside className="min-w-0 space-y-6 lg:sticky lg:top-24">{aside}</aside>
        </div>
      </div>
    </section>

    {children && (
      <div className="border-t border-line bg-surface">
        <div className="container py-10">{children}</div>
      </div>
    )}
  </div>
);

/** Slim "X of N filled" progress indicator. */
export const FormProgress = ({ filled, total }) => {
  const pct = total ? Math.round((filled / total) * 100) : 0;
  const done = total > 0 && filled === total;
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs font-medium">
        <span className={done ? "text-accent-600" : "text-muted"}>
          {done ? `All ${total} fields filled` : `${filled} of ${total} filled`}
        </span>
        <span className="tabular-nums text-muted">{pct}%</span>
      </div>
      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface ring-1 ring-inset ring-line"
        role="progressbar"
        aria-label="Form completion"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={filled}
        aria-valuetext={`${filled} of ${total} fields filled`}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-300 ease-out ${
            done ? "bg-accent-500" : "bg-brand-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

/** "Fill sample values" + "Clear" buttons for the form header. */
export const SampleActions = ({ onFill, onClear, canClear = true, disabled }) => (
  <div className="flex flex-wrap items-center gap-2">
    <button
      type="button"
      onClick={onFill}
      disabled={disabled}
      className="btn-secondary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
    >
      <HiOutlineSparkles className="h-4 w-4" aria-hidden="true" />
      Fill sample values
    </button>
    <button
      type="button"
      onClick={onClear}
      disabled={disabled || !canClear}
      className="btn-ghost px-3 py-2 text-sm text-muted hover:text-ink disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
    >
      Clear
    </button>
  </div>
);

/** White form card with a title row, optional header actions and progress. */
export const FormCard = React.forwardRef(
  ({ title, subtitle, actions, progress, children, onSubmit, ...rest }, ref) => (
    <form
      ref={ref}
      onSubmit={onSubmit}
      noValidate
      className="card scroll-mt-24 p-5 sm:p-6 md:p-8"
      {...rest}
    >
      <div className="mb-6 border-b border-line pb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="text-lg font-semibold text-ink">{title}</h2>
            {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
        {progress && <FormProgress filled={progress.filled} total={progress.total} />}
      </div>
      {children}
    </form>
  )
);
FormCard.displayName = "FormCard";

/** Responsive grid for inputs. */
export const FieldGrid = ({ children, cols = 2 }) => (
  <div
    className={`grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 ${
      cols === 3 ? "xl:grid-cols-3" : ""
    }`}
  >
    {children}
  </div>
);

/** Labeled numeric input. `name` is the untouched state key; value stays a string. */
export const Field = ({
  name,
  value,
  onChange,
  label,
  hint,
  placeholder,
  invalid,
  min = "0",
  max,
}) => {
  const id = useId();
  const parsed = parseFieldKey(name);
  const displayLabel = label || parsed.label;
  const ph = placeholder || (parsed.example ? `e.g. ${parsed.example}` : "Enter value");
  const describedBy = [hint && `${id}-hint`, invalid && `${id}-error`]
    .filter(Boolean)
    .join(" ");
  return (
    <div>
      <label htmlFor={id} className="form__label">
        {displayLabel}
      </label>
      <input
        id={id}
        className={`form__input [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
          invalid
            ? "border-rose-300 bg-rose-50/40 focus:border-rose-400 focus:ring-rose-100"
            : ""
        }`}
        type="number"
        inputMode="decimal"
        step="any"
        min={min}
        max={max}
        autoComplete="off"
        name={name}
        placeholder={ph}
        value={value}
        onChange={onChange}
        // Prevent the mouse wheel from silently changing a focused value.
        onWheel={(e) => e.currentTarget.blur()}
        aria-required="true"
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy || undefined}
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs leading-5 text-muted">
          {hint}
        </p>
      )}
      {invalid && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-rose-600">
          Required
        </p>
      )}
    </div>
  );
};

export const FormError = ({ children }) =>
  children ? (
    <div
      role="alert"
      className="mt-6 flex items-start gap-2.5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-inset ring-rose-100"
    >
      <HiOutlineExclamationTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  ) : null;

export const Spinner = ({ className = "h-4 w-4" }) => (
  <svg
    className={`animate-spin ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
    <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/** Footer row of a form with the primary submit button. */
export const SubmitRow = ({ loading, label = "Run prediction", note }) => (
  <div className="mt-8 flex flex-col-reverse gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
    <p className="text-xs leading-5 text-muted">
      {note || "Your values are only used to run this prediction and are not saved."}
    </p>
    <button
      type="submit"
      className="btn-primary w-full sm:w-auto"
      disabled={loading}
      aria-busy={loading || undefined}
    >
      {loading ? (
        <>
          <Spinner />
          Analysing…
        </>
      ) : (
        label
      )}
    </button>
  </div>
);

/** Info card shown in the aside before (and below) a result. */
export const InfoCard = ({ title = "What this test analyses", items = [], compact }) => (
  <div className="card p-6">
    <div className="flex items-center gap-3">
      <span className="icon-tile h-10 w-10">
        <HiOutlineInformationCircle className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
    </div>
    {!compact && items.length > 0 && (
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-muted">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            {item}
          </li>
        ))}
      </ul>
    )}
    <p className="mt-5 rounded-xl bg-surface px-4 py-3 text-xs leading-5 text-muted ring-1 ring-inset ring-line">
      AI results are informational, not a diagnosis. Always consult a
      qualified healthcare professional.
    </p>
  </div>
);

/** Placeholder shown before a prediction is available. */
export const AwaitingResult = ({ text = "Fill in the form and run the prediction to see your result here." }) => (
  <div className="card flex flex-col items-center px-6 py-10 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-slate-400 ring-1 ring-inset ring-line">
      <HiOutlineBeaker className="h-6 w-6" aria-hidden="true" />
    </div>
    <p className="mt-4 text-sm font-semibold text-ink">Awaiting input</p>
    <p className="mt-1 max-w-[16rem] text-sm leading-6 text-muted">{text}</p>
  </div>
);

/** Skeleton shown in the result area while the model is working. */
export const AnalysingResult = ({ text = "This usually takes a second or two." }) => (
  <div role="status" aria-live="polite" aria-busy="true" className="card p-6">
    <div className="flex items-center gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
        <Spinner className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">Analysing…</p>
        <p className="mt-0.5 text-xs leading-5 text-muted">{text}</p>
      </div>
    </div>
    <div className="mt-6 animate-pulse space-y-3" aria-hidden="true">
      <div className="h-3 w-2/3 rounded-full bg-surface ring-1 ring-inset ring-line" />
      <div className="h-3 w-full rounded-full bg-surface ring-1 ring-inset ring-line" />
      <div className="h-3 w-5/6 rounded-full bg-surface ring-1 ring-inset ring-line" />
      <div className="flex gap-2 pt-2">
        <div className="h-9 w-32 rounded-full bg-surface ring-1 ring-inset ring-line" />
        <div className="h-9 w-28 rounded-full bg-surface ring-1 ring-inset ring-line" />
      </div>
    </div>
  </div>
);

/**
 * Result panel: emerald for healthy, rose for elevated risk. When `onReset` is
 * given it also shows next-step actions. With `autoScroll`, the panel scrolls
 * itself into view on small screens (where it sits below the form).
 */
export const ResultPanel = ({
  risk,
  title,
  message,
  confidence,
  onReset,
  onBook = scrollToSpecialist,
  autoScroll,
}) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!autoScroll || !ref.current) return;
    if (window.matchMedia && window.matchMedia("(max-width: 1023px)").matches) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [autoScroll]);

  const Icon = risk ? HiOutlineExclamationTriangle : HiOutlineCheckCircle;
  const tone = risk
    ? "bg-rose-50 ring-rose-200 text-rose-900"
    : "bg-emerald-50 ring-emerald-200 text-emerald-900";
  const iconTone = risk
    ? "bg-rose-100 text-rose-600 ring-rose-200"
    : "bg-emerald-100 text-emerald-600 ring-emerald-200";
  const barTone = risk ? "bg-rose-500" : "bg-emerald-500";
  const hasConfidence = typeof confidence === "number" && Number.isFinite(confidence);

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className={`animate-fade-up scroll-mt-24 rounded-2xl p-6 ring-1 ring-inset shadow-soft ${tone}`}
    >
      <div className="flex items-start gap-4">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${iconTone}`}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-70">
            Prediction result
          </p>
          <h3 className="mt-1 text-lg font-bold leading-snug">
            {title || (risk ? "Elevated risk — consult a doctor" : "Low risk / Healthy")}
          </h3>
          {message && <p className="mt-2 text-sm leading-6 opacity-80">{message}</p>}
        </div>
      </div>

      {hasConfidence && (
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="opacity-70">Model confidence</span>
            <span className="tabular-nums">{confidence}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/80 ring-1 ring-inset ring-black/5">
            <div className={`h-full rounded-full ${barTone}`} style={{ width: `${confidence}%` }} />
          </div>
        </div>
      )}

      {onReset && (
        <div className="mt-6 flex flex-col gap-2 sm:flex-row lg:flex-col">
          <button
            type="button"
            onClick={onBook}
            className="btn-primary flex-1 whitespace-nowrap px-4 py-2.5 text-sm"
          >
            <HiOutlineCalendarDays className="h-4 w-4" aria-hidden="true" />
            Book a specialist
          </button>
          <button
            type="button"
            onClick={onReset}
            className="btn-secondary flex-1 whitespace-nowrap px-4 py-2.5 text-sm"
          >
            <HiOutlineArrowPath className="h-4 w-4" aria-hidden="true" />
            Run another test
          </button>
        </div>
      )}

      <p className="mt-5 border-t border-black/5 pt-4 text-xs leading-5 opacity-70">
        Screening estimate only — not a diagnosis. Please confirm with a
        qualified healthcare professional.
      </p>
    </div>
  );
};

const formatBytes = (bytes) => {
  if (typeof bytes !== "number") return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Drag-and-drop / click-to-browse image picker with the preview shown inside
 * the drop area. `onFile(file)` receives the chosen File (from the dialog or a
 * drop); validation and state live in the page.
 */
export const ImageDropzone = ({
  onFile,
  onRemove,
  preview,
  file,
  label,
  hint,
  invalid,
  disabled,
}) => {
  const id = useId();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const openDialog = () => {
    if (!disabled && inputRef.current) inputRef.current.click();
  };

  const handleInputChange = (e) => {
    const picked = e.target.files && e.target.files[0];
    if (picked) onFile(picked);
    // Reset so choosing the same file again still fires onChange.
    e.target.value = "";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openDialog();
    }
  };

  const dragProps = {
    onDragEnter: (e) => {
      e.preventDefault();
      if (!disabled) setDragging(true);
    },
    onDragOver: (e) => {
      e.preventDefault();
      if (!disabled) {
        e.dataTransfer.dropEffect = "copy";
        setDragging(true);
      }
    },
    onDragLeave: (e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
    },
    onDrop: (e) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      const dropped = e.dataTransfer.files && e.dataTransfer.files[0];
      if (dropped) onFile(dropped);
    },
  };

  const frame = dragging
    ? "border-brand-400 bg-brand-50/60 ring-4 ring-brand-100"
    : invalid
    ? "border-rose-300 bg-rose-50/40"
    : "border-line bg-surface";

  return (
    <div>
      <p id={`${id}-label`} className="form__label">
        {label}
      </p>
      <input
        ref={inputRef}
        id={id}
        onChange={handleInputChange}
        type="file"
        name="image"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      {preview ? (
        <div
          {...dragProps}
          className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition ${frame}`}
        >
          <div className="flex items-center justify-center p-3">
            <img
              src={preview}
              alt={file?.name ? `Preview of ${file.name}` : "Uploaded image preview"}
              className="max-h-[340px] w-auto max-w-full rounded-xl object-contain shadow-soft"
            />
          </div>
          <div className="flex flex-col gap-3 border-t border-line bg-white px-4 py-3 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span className="icon-tile h-9 w-9 shrink-0 rounded-lg">
                <HiOutlinePhoto className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink" title={file?.name}>
                  {file?.name || "Selected image"}
                </p>
                <p className="text-xs text-muted">
                  {file ? `${formatBytes(file.size)} · ` : ""}Drop a new image to replace
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={openDialog}
                disabled={disabled}
                className="btn-secondary flex-1 px-4 py-2 text-sm sm:flex-none"
              >
                <HiOutlineArrowPath className="h-4 w-4" aria-hidden="true" />
                Replace
              </button>
              {onRemove && (
                <button
                  type="button"
                  onClick={onRemove}
                  disabled={disabled}
                  aria-label="Remove image"
                  title="Remove image"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted ring-1 ring-line transition hover:bg-rose-50 hover:text-rose-600 hover:ring-rose-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 disabled:opacity-50"
                >
                  <HiOutlineXMark className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
          {dragging && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-brand-50/85 text-sm font-semibold text-brand-700">
              Drop to replace image
            </div>
          )}
        </div>
      ) : (
        <div
          {...dragProps}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-labelledby={`${id}-label ${id}-cta`}
          aria-describedby={`${id}-hint`}
          aria-disabled={disabled || undefined}
          onClick={openDialog}
          onKeyDown={handleKeyDown}
          className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition hover:border-brand-300 hover:bg-brand-50/40 focus:outline-none focus-visible:border-brand-400 focus-visible:ring-4 focus-visible:ring-brand-100 ${frame}`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-600 shadow-soft ring-1 ring-line transition group-hover:scale-105">
            <HiOutlineCloudArrowUp className="h-6 w-6" aria-hidden="true" />
          </span>
          <span id={`${id}-cta`} className="mt-4 text-sm font-semibold text-ink">
            {dragging ? (
              <span className="text-brand-700">Drop your image here</span>
            ) : (
              <>
                <span className="text-brand-700">Click to upload</span> or drag and drop
              </>
            )}
          </span>
          <span id={`${id}-hint`} className="mt-1 text-xs text-muted">
            {hint || "PNG or JPG image"}
          </span>
        </div>
      )}
    </div>
  );
};

/** Wrapper for the doctor-booking dropdown below each test. */
export const DoctorSection = ({ children }) => (
  <div id={SPECIALIST_SECTION_ID} className="scroll-mt-24">
    <h2 className="text-xl font-semibold text-ink">Discuss your result with a specialist</h2>
    <p className="mt-1 text-sm text-muted">
      Book an appointment with one of our doctors and share this test result.
    </p>
    <div className="mt-6">{children}</div>
  </div>
);

export default TestLayout;
