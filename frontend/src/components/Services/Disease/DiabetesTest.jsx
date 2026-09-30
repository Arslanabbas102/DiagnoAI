import React, { useRef, useState } from "react";
import axios from "axios";
import { LuDroplet } from "react-icons/lu";
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

// A realistic example row (Pima Indians diabetes dataset), keyed like the state.
const SAMPLE_VALUES = {
  "Number of Pregnancies eg. 0": "6",
  "Glucose (mg/dL) eg. 80": "148",
  "Blood Pressure (mmHg) eg. 80": "72",
  "Skin Thickness (mm) eg. 20": "35",
  "Insulin Level (IU/mL) eg. 80": "0",
  "Body Mass Index (kg/m²) eg. 23.1": "33.6",
  "Diabetes Pedigree Function eg. 0.52": "0.627",
  "Age (years) eg. 34": "50",
};

const DiabetesTest = () => {
  const [inputData, setInputData] = useState({
    "Number of Pregnancies eg. 0": "",
    "Glucose (mg/dL) eg. 80": "",
    "Blood Pressure (mmHg) eg. 80": "",
    "Skin Thickness (mm) eg. 20": "",
    "Insulin Level (IU/mL) eg. 80": "",
    "Body Mass Index (kg/m²) eg. 23.1": "",
    "Diabetes Pedigree Function eg. 0.52": "",
    "Age (years) eg. 34": "",
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
      const response = await axios.post(`${BASE_URL}/diabetes`, {
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
      title="Diabetes Predictor"
      description="Estimate your risk of type 2 diabetes from routine clinical measurements."
      icon={LuDroplet}
      badge="8 inputs"
      form={
        <FormCard
          ref={formRef}
          title="Patient measurements"
          subtitle="Enter the values from your most recent lab report."
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
              title={isRisk ? "Elevated diabetes risk" : "Low diabetes risk"}
              message={
                isRisk
                  ? "Your values resemble people who went on to develop diabetes — a doctor can confirm with an HbA1c or fasting glucose test."
                  : "Your values are consistent with a healthy profile — keep up regular check-ups."
              }
              onReset={resetTest}
              autoScroll
            />
          ) : (
            <AwaitingResult />
          )}
          <InfoCard
            items={[
              "Plasma glucose, insulin level and blood pressure",
              "Body mass index and skin-fold thickness",
              "Hereditary risk via the diabetes pedigree function",
              "Age and number of pregnancies",
            ]}
          />
        </>
      }
    >
      <DoctorSection>
        <DcotorsDropDown
          testName={"Diabetes Disease Predictor"}
          testResult={prediction?.includes("[1]") ? "Unhealthy" : "Healthy"}
        />
      </DoctorSection>
    </TestLayout>
  );
};

export default DiabetesTest;
