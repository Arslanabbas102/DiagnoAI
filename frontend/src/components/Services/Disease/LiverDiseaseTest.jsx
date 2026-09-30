import React, { useRef, useState } from "react";
import axios from "axios";
import { LuFlaskConical } from "react-icons/lu";
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

// Display-only labels; the state keys below are sent unchanged.
const FIELD_META = {
  Age: { label: "Age (years)", placeholder: "e.g. 45" },
  "Total Bilirubin": { label: "Total bilirubin (mg/dL)", placeholder: "e.g. 0.7" },
  "Direct Bilirubin": { label: "Direct bilirubin (mg/dL)", placeholder: "e.g. 0.1" },
  "Alkaline Phosphotase": { label: "Alkaline phosphatase (IU/L)", placeholder: "e.g. 187" },
  "Alamine Aminotransferase": { label: "Alanine aminotransferase — ALT (IU/L)", placeholder: "e.g. 16" },
  "Aspartate Aminotransferase": { label: "Aspartate aminotransferase — AST (IU/L)", placeholder: "e.g. 18" },
  "Total Protiens": { label: "Total proteins (g/dL)", placeholder: "e.g. 6.8" },
  Albumin: { label: "Albumin (g/dL)", placeholder: "e.g. 3.3" },
  "Albumin and Globulin Ratio": { label: "Albumin / globulin ratio", placeholder: "e.g. 0.9" },
  "Gender(Male: 1, Female: 0)": { label: "Sex", hint: "1 = male, 0 = female", max: "1" },
};

// A realistic example row (Indian Liver Patient dataset), keyed like the state.
const SAMPLE_VALUES = {
  Age: "65",
  "Total Bilirubin": "0.7",
  "Direct Bilirubin": "0.1",
  "Alkaline Phosphotase": "187",
  "Alamine Aminotransferase": "16",
  "Aspartate Aminotransferase": "18",
  "Total Protiens": "6.8",
  Albumin: "3.3",
  "Albumin and Globulin Ratio": "0.9",
  "Gender(Male: 1, Female: 0)": "0",
};

const LiverDiseaseTest = () => {
  const [inputData, setInputData] = useState({
    Age: "",
    "Total Bilirubin": "",
    "Direct Bilirubin": "",
    "Alkaline Phosphotase": "",
    "Alamine Aminotransferase": "",
    "Aspartate Aminotransferase": "",
    "Total Protiens": "",
    Albumin: "",
    "Albumin and Globulin Ratio": "",
    "Gender(Male: 1, Female: 0)": "",
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
      const response = await axios.post(`${BASE_URL}/liver`, {
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
      title="Liver Disease Predictor"
      description="Evaluate liver health from a standard liver function test (LFT) panel."
      icon={LuFlaskConical}
      badge="10 inputs"
      form={
        <FormCard
          ref={formRef}
          title="Liver function panel"
          subtitle="Enter the values from your most recent LFT report."
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
          ) : prediction !== null ? (
            <ResultPanel
              risk={isRisk}
              title={isRisk ? "Possible liver disease" : "Low liver disease risk"}
              message={
                isRisk
                  ? "Your panel resembles patterns seen in liver disease — a hepatologist can confirm with further tests or imaging."
                  : "Your panel is consistent with healthy liver function — keep up regular check-ups."
              }
              onReset={resetTest}
              autoScroll
            />
          ) : (
            <AwaitingResult />
          )}
          <InfoCard
            items={[
              "Total and direct bilirubin",
              "Liver enzymes: ALP, ALT and AST",
              "Total proteins, albumin and A/G ratio",
              "Age and sex",
            ]}
          />
        </>
      }
    >
      <DoctorSection>
        <DcotorsDropDown
          testName={"Liver Disease Predictor"}
          testResult={prediction?.includes("[1]") ? "Unhealthy" : "Healthy"}
        />
      </DoctorSection>
    </TestLayout>
  );
};

export default LiverDiseaseTest;
