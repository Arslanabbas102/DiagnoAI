import React, { useRef, useState } from "react";
import axios from "axios";
import { LuBean } from "react-icons/lu";
import { BASE_URL } from "../../../config";
import DcotorsDropDown from "../../DoctorDropDown/DoctorDropDown";
import TestLayout, {
  FormCard,
  FieldGrid,
  Field,
  FormError,
  SubmitRow,
  InfoCard,
  AwaitingResult,
  AnalysingResult,
  ResultPanel,
  SampleActions,
  DoctorSection,
  countFilled,
  emptyValues,
  scrollToElement,
} from "./TestLayout";

// Display-only labels for the abbreviated state keys (keys are sent unchanged).
const FIELD_META = {
  Age: { label: "Age (years)", placeholder: "e.g. 48" },
  BP: { label: "Blood pressure (mm Hg)", placeholder: "e.g. 80" },
  AL: { label: "Albumin (0–5)", placeholder: "e.g. 1", max: "5" },
  SU: { label: "Sugar (0–5)", placeholder: "e.g. 0", max: "5" },
  RBC: { label: "Red blood cells", hint: "Coded: normal / abnormal", max: "1" },
  PC: { label: "Pus cells", hint: "Coded: normal / abnormal", max: "1" },
  PCC: { label: "Pus cell clumps", hint: "Coded: present / not present", max: "1" },
  BA: { label: "Bacteria", hint: "Coded: present / not present", max: "1" },
  BGR: { label: "Blood glucose random (mg/dL)", placeholder: "e.g. 121" },
  BU: { label: "Blood urea (mg/dL)", placeholder: "e.g. 36" },
  SC: { label: "Serum creatinine (mg/dL)", placeholder: "e.g. 1.2" },
  POT: { label: "Potassium (mEq/L)", placeholder: "e.g. 4.6" },
  WC: { label: "White blood cell count (cells/cmm)", placeholder: "e.g. 7800" },
  HTN: { label: "Hypertension", hint: "1 = yes, 0 = no", max: "1" },
  DM: { label: "Diabetes mellitus", hint: "1 = yes, 0 = no", max: "1" },
  CAD: { label: "Coronary artery disease", hint: "1 = yes, 0 = no", max: "1" },
  PE: { label: "Pedal edema", hint: "1 = yes, 0 = no", max: "1" },
  ANE: { label: "Anemia", hint: "1 = yes, 0 = no", max: "1" },
};

// A realistic example row (UCI chronic kidney disease dataset), keyed like the
// state. Coded fields use 0 = normal / not present / no, 1 = abnormal / present / yes.
const SAMPLE_VALUES = {
  Age: "48",
  BP: "80",
  AL: "1",
  SU: "0",
  RBC: "0",
  PC: "0",
  PCC: "0",
  BA: "0",
  BGR: "121",
  BU: "36",
  SC: "1.2",
  POT: "4.6",
  WC: "7800",
  HTN: "1",
  DM: "1",
  CAD: "0",
  PE: "0",
  ANE: "0",
};

const KidneyDiseaseTest = () => {
  const [inputData, setInputData] = useState({
    Age: "",
    BP: "",
    AL: "",
    SU: "",
    RBC: "",
    PC: "",
    PCC: "",
    BA: "",
    BGR: "",
    BU: "",
    SC: "",
    POT: "",
    WC: "",
    HTN: "",
    DM: "",
    CAD: "",
    PE: "",
    ANE: "",
  });
  const [prediction, setPrediction] = useState(null);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
    setFormError("");
  };

  const fillSample = () => {
    setInputData({ ...inputData, ...SAMPLE_VALUES });
    setFormError("");
  };

  const clearForm = () => {
    setInputData(emptyValues(inputData));
    setFormError("");
  };

  const resetTest = () => {
    clearForm();
    setPrediction(null);
    scrollToElement(formRef.current);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if any field is empty
    const isFormFilled = Object.values(inputData).every(
      (value) => value.trim() !== ""
    );
    if (!isFormFilled) {
      setFormError("Please fill out all fields.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/kidney`, {
        data: inputData,
      });
      const pred = response.data.prediction;
      if (typeof pred === "string" && /\[[01]\]/.test(pred)) {
        setPrediction(pred);
      } else {
        setFormError("The model couldn't produce a result. Please check your values and try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setFormError("We couldn't reach the prediction service. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const isRisk = prediction?.includes("[1]");
  const filled = countFilled(inputData);
  const total = Object.keys(inputData).length;

  return (
    <TestLayout
      title="Kidney Disease Predictor"
      description="Screen for chronic kidney disease using blood, urine and medical-history markers."
      icon={LuBean}
      badge="18 inputs"
      form={
        <FormCard
          ref={formRef}
          title="Renal panel & history"
          subtitle="Enter your urinalysis, blood chemistry and history values."
          onSubmit={handleSubmit}
          progress={{ filled, total }}
          actions={
            <SampleActions
              onFill={fillSample}
              onClear={clearForm}
              canClear={filled > 0}
              disabled={loading}
            />
          }
        >
          <FieldGrid cols={3}>
            {Object.entries(inputData).map(([name, value]) => (
              <Field
                key={name}
                name={name}
                value={value}
                onChange={handleInputChange}
                label={FIELD_META[name]?.label}
                hint={FIELD_META[name]?.hint}
                placeholder={FIELD_META[name]?.placeholder}
                max={FIELD_META[name]?.max}
                invalid={!!formError && value.trim() === ""}
              />
            ))}
          </FieldGrid>
          <FormError>{formError}</FormError>
          <SubmitRow loading={loading} />
        </FormCard>
      }
      aside={
        <>
          {loading ? (
            <AnalysingResult />
          ) : prediction !== null ? (
            <ResultPanel
              risk={isRisk}
              title={isRisk ? "Signs of kidney disease" : "Low kidney disease risk"}
              message={
                isRisk
                  ? "Your markers resemble chronic kidney disease — a nephrologist can confirm with an eGFR and urine albumin test."
                  : "Your markers are consistent with healthy kidney function — keep up regular check-ups."
              }
              onReset={resetTest}
              autoScroll
            />
          ) : (
            <AwaitingResult />
          )}
          <InfoCard
            items={[
              "Urinalysis: albumin, sugar, cells and bacteria",
              "Blood chemistry: urea, creatinine, potassium, glucose",
              "Blood pressure and white cell count",
              "History of hypertension, diabetes, CAD and anemia",
            ]}
          />
        </>
      }
    >
      <DoctorSection>
        <DcotorsDropDown
          testName={"Kidney Disease Predictor"}
          testResult={prediction?.includes("[1]") ? "Unhealthy" : "Healthy"}
        />
      </DoctorSection>
    </TestLayout>
  );
};

export default KidneyDiseaseTest;
