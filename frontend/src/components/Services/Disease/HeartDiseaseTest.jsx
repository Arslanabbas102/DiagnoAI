import React, { useRef, useState } from "react";
import axios from "axios";
import { LuHeartPulse } from "react-icons/lu";
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

// Display-only labels and hints; the state keys below are sent unchanged.
const FIELD_META = {
  Age: { label: "Age (years)", placeholder: "e.g. 52" },
  "Sex (Male:1, Female:0)": { label: "Sex", hint: "1 = male, 0 = female", max: "1" },
  "Chest Pain Type": { label: "Chest pain type", hint: "0–3 (typical angina to asymptomatic)", max: "3" },
  "Resting Blood Pressure (mm Hg)": { label: "Resting blood pressure (mm Hg)", placeholder: "e.g. 125" },
  "Serum Cholestoral (mg/dl)": { label: "Serum cholesterol (mg/dL)", placeholder: "e.g. 212" },
  "Fasting Blood Sugar (1 = true; 0 = false)": { label: "Fasting blood sugar > 120 mg/dL", hint: "1 = true, 0 = false", max: "1" },
  "Resting Electrocardiographic Results": { label: "Resting ECG result", hint: "0 = normal, 1 = ST-T abnormality, 2 = LV hypertrophy", max: "2" },
  "Maximum heart rate achieved": { label: "Maximum heart rate (bpm)", placeholder: "e.g. 168" },
  "Exercise Induced Angina (1 = yes; 0 = no)": { label: "Exercise-induced angina", hint: "1 = yes, 0 = no", max: "1" },
  "ST Depression Induced by Exercise Relative to Rest": { label: "ST depression (oldpeak)", placeholder: "e.g. 1.0" },
  "Slope of the Peak Exercise ST Segment": { label: "Slope of peak ST segment", hint: "0 = up, 1 = flat, 2 = down", max: "2" },
  "Number of Major Vessels (0-3) Colored by Flourosopy": { label: "Major vessels coloured (0–3)", hint: "Counted by fluoroscopy", max: "3" },
  "3 = Normal; 6 = Fixed Defect; 7 = Reversable Defect": { label: "Thalassemia", hint: "3 = normal, 6 = fixed defect, 7 = reversible defect", max: "7" },
};

// A realistic example row (UCI heart disease dataset), keyed like the state.
const SAMPLE_VALUES = {
  Age: "52",
  "Sex (Male:1, Female:0)": "1",
  "Chest Pain Type": "0",
  "Resting Blood Pressure (mm Hg)": "125",
  "Serum Cholestoral (mg/dl)": "212",
  "Fasting Blood Sugar (1 = true; 0 = false)": "0",
  "Resting Electrocardiographic Results": "1",
  "Maximum heart rate achieved": "168",
  "Exercise Induced Angina (1 = yes; 0 = no)": "0",
  "ST Depression Induced by Exercise Relative to Rest": "1.0",
  "Slope of the Peak Exercise ST Segment": "2",
  "Number of Major Vessels (0-3) Colored by Flourosopy": "2",
  "3 = Normal; 6 = Fixed Defect; 7 = Reversable Defect": "3",
};

const HeartDiseaseTest = () => {
  const [inputData, setInputData] = useState({
    Age: "",
    "Sex (Male:1, Female:0)": "",
    "Chest Pain Type": "",
    "Resting Blood Pressure (mm Hg)": "",
    "Serum Cholestoral (mg/dl)": "",
    "Fasting Blood Sugar (1 = true; 0 = false)": "",
    "Resting Electrocardiographic Results": "",
    "Maximum heart rate achieved": "",
    "Exercise Induced Angina (1 = yes; 0 = no)": "",
    "ST Depression Induced by Exercise Relative to Rest": "",
    "Slope of the Peak Exercise ST Segment": "",
    "Number of Major Vessels (0-3) Colored by Flourosopy": "",
    "3 = Normal; 6 = Fixed Defect; 7 = Reversable Defect": "",
  });
  const [prediction, setPrediction] = useState("[0]");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  // Presentational only: show the result panel once a prediction has been run.
  const [hasRun, setHasRun] = useState(false);
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
    setPrediction("[0]");
    setHasRun(false);
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
      const response = await axios.post(`${BASE_URL}/heart`, {
        data: inputData,
      });
      const pred = response.data.prediction;
      if (typeof pred === "string" && /\[[01]\]/.test(pred)) {
        setPrediction(pred);
        setHasRun(true);
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
      title="Heart Disease Predictor"
      description="Assess the likelihood of coronary heart disease from cardiac and exercise-test indicators."
      icon={LuHeartPulse}
      badge="13 inputs"
      form={
        <FormCard
          ref={formRef}
          title="Cardiac indicators"
          subtitle="Use the coded values shown under each field where applicable."
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
          <FieldGrid>
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
          ) : hasRun && prediction !== null ? (
            <ResultPanel
              risk={isRisk}
              title={isRisk ? "Elevated heart disease risk" : "Low heart disease risk"}
              message={
                isRisk
                  ? "Your indicators match patterns seen in coronary heart disease — a cardiologist can confirm with an ECG or stress test."
                  : "Your indicators are consistent with a healthy heart profile — keep up regular check-ups."
              }
              onReset={resetTest}
              autoScroll
            />
          ) : (
            <AwaitingResult />
          )}
          <InfoCard
            items={[
              "Blood pressure, cholesterol and fasting blood sugar",
              "Resting ECG and exercise stress-test response",
              "Chest pain characteristics and angina",
              "Fluoroscopy and thalassemia findings",
            ]}
          />
        </>
      }
    >
      <DoctorSection>
        <DcotorsDropDown
          testName={"Heart Disease Predictor"}
          testResult={prediction?.includes("[1]") ? "Unhealthy" : "Healthy"}
        />
      </DoctorSection>
    </TestLayout>
  );
};

export default HeartDiseaseTest;
