import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  HiOutlineMagnifyingGlass,
  HiXMark,
  HiOutlineSparkles,
  HiChevronRight,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import {
  LuStethoscope,
  LuFileText,
  LuShieldCheck,
  LuPill,
  LuSalad,
  LuDumbbell,
  LuCheck,
} from "react-icons/lu";
import { BASE_URL } from "../config";

// Symptom vocabulary understood by the model (display data only).
const SYMPTOM_OPTIONS = ["itching", "skin_rash", "nodal_skin_eruptions", "continuous_sneezing", "shivering", "chills", "joint_pain", "stomach_pain", "acidity", "ulcers_on_tongue", "muscle_wasting", "vomiting", "burning_micturition", "spotting_ urination", "fatigue", "weight_gain", "anxiety", "cold_hands_and_feets", "mood_swings", "weight_loss", "restlessness", "lethargy", "patches_in_throat", "irregular_sugar_level", "cough", "high_fever", "sunken_eyes", "breathlessness", "sweating", "dehydration", "indigestion", "headache", "yellowish_skin", "dark_urine", "nausea", "loss_of_appetite", "pain_behind_the_eyes", "back_pain", "constipation", "abdominal_pain", "diarrhoea", "mild_fever", "yellow_urine", "yellowing_of_eyes", "acute_liver_failure", "fluid_overload", "swelling_of_stomach", "swelled_lymph_nodes", "malaise", "blurred_and_distorted_vision", "phlegm", "throat_irritation", "redness_of_eyes", "sinus_pressure", "runny_nose", "congestion", "chest_pain", "weakness_in_limbs", "fast_heart_rate", "pain_during_bowel_movements", "pain_in_anal_region", "bloody_stool", "irritation_in_anus", "neck_pain", "dizziness", "cramps", "bruising", "obesity", "swollen_legs", "swollen_blood_vessels", "puffy_face_and_eyes", "enlarged_thyroid", "brittle_nails", "swollen_extremeties", "excessive_hunger", "extra_marital_contacts", "drying_and_tingling_lips", "slurred_speech", "knee_pain", "hip_joint_pain", "muscle_weakness", "stiff_neck", "swelling_joints", "movement_stiffness", "spinning_movements", "loss_of_balance", "unsteadiness", "weakness_of_one_body_side", "loss_of_smell", "bladder_discomfort", "foul_smell_of urine", "continuous_feel_of_urine", "passage_of_gases", "internal_itching", "toxic_look_(typhos)", "depression", "irritability", "muscle_pain", "altered_sensorium", "red_spots_over_body", "belly_pain", "abnormal_menstruation", "dischromic _patches", "watering_from_eyes", "increased_appetite", "polyuria", "family_history", "mucoid_sputum", "rusty_sputum", "lack_of_concentration", "visual_disturbances", "receiving_blood_transfusion", "receiving_unsterile_injections", "coma", "stomach_bleeding", "distention_of_abdomen", "history_of_alcohol_consumption", "fluid_overload.1", "blood_in_sputum", "prominent_veins_on_calf", "palpitations", "painful_walking", "pus_filled_pimples", "blackheads", "scurring", "skin_peeling", "silver_like_dusting", "small_dents_in_nails", "inflammatory_nails", "blister", "red_sore_around_nose", "yellow_crust_ooze"].filter((s) => !/\.\d+$/.test(s));

const formatSymptom = (s) => {
  const text = s.replace(/\.\d+$/, "").replace(/[_]+/g, " ").replace(/\s+/g, " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Display-only: turn the stringified Python lists returned by the API into items.
const toList = (raw) => {
  if (!raw) return [];
  const str = String(raw);
  const quoted = [...str.matchAll(/'([^']+)'/g)].map((m) => m[1].trim());
  if (quoted.length) return quoted.filter(Boolean);
  return str
    .split("\n")
    .filter((line) => !/^\s*(Name:|dtype)/.test(line))
    .map((line) => line.replace(/^\s*\d+\s+/, "").replace(/^[[\]"'\s]+|[[\]"'\s]+$/g, "").trim())
    .filter(Boolean);
};

const Spinner = () => (
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
    <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const ResultCard = ({ icon: Icon, title, items, tone = "brand" }) => {
  const tones = {
    brand: "bg-brand-50 text-brand-600 ring-brand-100",
    accent: "bg-accent-50 text-accent-600 ring-accent-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
    violet: "bg-violet-50 text-violet-600 ring-violet-100",
  };
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset ${tones[tone]}`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="text-base font-semibold text-ink">{title}</h3>
      </div>
      {items.length ? (
        <ul className="mt-5 space-y-3">
          {items.map((item, i) => (
            <li key={`${item}-${i}`} className="flex gap-3 text-sm leading-6 text-muted">
              <LuCheck className="mt-1 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
              <span className="first-letter:uppercase">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted">No recommendations available.</p>
      )}
    </div>
  );
};

const Symptomchk = () => {
  const [symptoms, setSymptoms] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [description, setDescription] = useState("");
  const [precaution, setPrecaution] = useState("");
  const [medications, setMedications] = useState("");
  const [workout, setWorkout] = useState("");
  const [diets, setDiets] = useState("");
  const [disease, setDisease] = useState("");

  const [isDesVisible, setIsDesVisible] = useState(false);
  const [isPrecautionVisible, setIsPrecautionVisible] = useState(false);
  const [isMedicationsVisible, setIsMedicationsVisible] = useState(false);
  const [isWorkoutVisible, setIsWorkoutVisible] = useState(false);
  const [isDietsVisible, setIsDietsVisible] = useState(false);
  const [isDiseaseVisible, setIsDiseaseVisible] = useState(false);

  // Presentational only: filter text for the symptom picker.
  const [query, setQuery] = useState("");

  const toggleDescriptionVisibility = () => {
    setIsDesVisible(!isDesVisible);
  };

  const togglePrecautionVisibility = () => {
    setIsPrecautionVisible(!isPrecautionVisible);
  };
  const toggleMedicationVisibility = () => {
    setIsMedicationsVisible(!isMedicationsVisible);
  };
  const toggleWorkoutVisibility = () => {
    setIsWorkoutVisible(!isWorkoutVisible);
  };
  const toggleDietsVisibility = () => {
    setIsDietsVisible(!isDietsVisible);
  };
  const toggleDiseaseVisibility = () => {
    setIsDiseaseVisible(!isDiseaseVisible);
  };

  const handlePrediction = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(`${BASE_URL}/symptoms`, {
        data: symptoms
          .split(",")
          .map((symptom) => symptom.trim())
          .filter(Boolean),
      });
      console.log(response);
      setDescription(response.data.data.dis_des);
      setPrecaution(response.data.data.my_precautions);
      setMedications(response.data.data.medications);
      setWorkout(response.data.data.workout);
      setDiets(response.data.data.rec_diet);
      setDisease(response.data.data.predicted_disease);
    } catch (error) {
      setErrorMessage("Failed to fetch prediction. Please try again later.");
    }

    setIsLoading(false);
  };

  // The `symptoms` string stays the single source of truth (comma-separated).
  const selected = symptoms
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const toggleSymptom = (s) => {
    const next = selected.includes(s)
      ? selected.filter((x) => x !== s)
      : [...selected, s];
    setSymptoms(next.join(","));
  };
  const q = query.trim().toLowerCase();
  const filtered = SYMPTOM_OPTIONS.filter(
    (s) => !q || formatSymptom(s).toLowerCase().includes(q)
  );

  return (
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
              <LuStethoscope className="h-7 w-7" aria-hidden="true" />
            </div>
            <div className="animate-fade-up">
              <h1 className="text-[28px] font-bold leading-tight text-ink md:text-[36px]">
                Symptom Checker
              </h1>
              <p className="mt-2 max-w-2xl text-[15px] leading-7 text-muted md:text-base">
                Select the symptoms you are experiencing and our AI will suggest a
                likely condition with care recommendations.
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="!py-10 lg:!py-14">
        <div className="container">
          <form onSubmit={handlePrediction} className="card p-6 md:p-8">
            <div className="flex flex-col gap-1 border-b border-line pb-5">
              <h2 className="text-lg font-semibold text-ink">Select your symptoms</h2>
              <p className="text-sm text-muted">
                Choose all that apply — more symptoms lead to a more accurate result.
              </p>
            </div>

            {/* Selected tray */}
            <div className="mt-6">
              <div className="flex items-center justify-between gap-3">
                <span className="form__label mb-0">
                  Selected{" "}
                  <span className="ml-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
                    {selected.length}
                  </span>
                </span>
                {selected.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSymptoms("")}
                    className="text-sm font-semibold text-muted transition hover:text-rose-600"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="mt-3 flex min-h-[56px] flex-wrap gap-2 rounded-xl bg-surface p-3 ring-1 ring-inset ring-line">
                {selected.length === 0 ? (
                  <span className="self-center px-1 text-sm text-slate-400">
                    No symptoms selected yet.
                  </span>
                ) : (
                  selected.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => toggleSymptom(s)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 py-1.5 pl-3 pr-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
                      aria-label={`Remove ${formatSymptom(s)}`}
                    >
                      {formatSymptom(s)}
                      <HiXMark className="h-4 w-4 opacity-80" aria-hidden="true" />
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Search + options */}
            <div className="mt-6">
              <label htmlFor="symptoms" className="form__label">
                Search symptoms
              </label>
              <div className="relative">
                <HiOutlineMagnifyingGlass
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  className="form__input pl-11"
                  id="symptoms"
                  name="symptoms"
                  placeholder="e.g. itching, headache, fatigue"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div
                className="mt-4 flex max-h-72 flex-wrap gap-2 overflow-y-auto pr-1"
                role="group"
                aria-label="Symptom options"
              >
                {filtered.length === 0 && (
                  <p className="text-sm text-muted">No symptoms match “{query}”.</p>
                )}
                {filtered.map((s) => {
                  const active = selected.includes(s);
                  return (
                    <button
                      type="button"
                      key={s}
                      onClick={() => toggleSymptom(s)}
                      aria-pressed={active}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 ring-inset transition focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 ${
                        active
                          ? "bg-brand-50 text-brand-700 ring-brand-200"
                          : "bg-white text-ink-700 ring-line hover:bg-surface hover:ring-brand-200"
                      }`}
                    >
                      {active && <LuCheck className="h-3.5 w-3.5" aria-hidden="true" />}
                      {formatSymptom(s)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-muted">
                AI results are informational, not a diagnosis.
              </p>
              <button
                type="submit"
                className="btn-primary w-full sm:w-auto"
                disabled={isLoading || selected.length === 0}
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    Analysing…
                  </>
                ) : (
                  <>
                    <HiOutlineSparkles className="h-4 w-4" aria-hidden="true" />
                    Predict condition
                  </>
                )}
              </button>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-2.5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-inset ring-rose-100"
              >
                <HiOutlineExclamationTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {errorMessage}
              </div>
            )}
          </form>

          {description && (
            <div className="mt-12 animate-fade-up" aria-live="polite">
              <div className="flex items-center gap-3">
                <span className="eyebrow">Our AI system results</span>
              </div>

              <div className="mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 p-6 text-white shadow-brand md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-100">
                  Predicted condition
                </p>
                <h2 className="mt-2 text-[26px] font-bold leading-tight md:text-[34px]">
                  {disease}
                </h2>
                <div className="mt-5 flex items-start gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-inset ring-white/15">
                  <LuFileText className="mt-0.5 h-5 w-5 shrink-0 text-brand-100" aria-hidden="true" />
                  <p className="text-[15px] leading-7 text-white/90">{description}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <ResultCard icon={LuShieldCheck} title="Precautions" items={toList(precaution)} tone="accent" />
                <ResultCard icon={LuPill} title="Medications" items={toList(medications)} tone="brand" />
                <ResultCard icon={LuSalad} title="Recommended diet" items={toList(diets)} tone="amber" />
                <ResultCard icon={LuDumbbell} title="Workout & lifestyle" items={toList(workout)} tone="violet" />
              </div>

              <p className="mt-6 rounded-xl bg-surface px-4 py-3 text-xs leading-5 text-muted ring-1 ring-inset ring-line">
                AI results are informational, not a diagnosis. Always consult a
                qualified healthcare professional before taking any medication.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Symptomchk;
