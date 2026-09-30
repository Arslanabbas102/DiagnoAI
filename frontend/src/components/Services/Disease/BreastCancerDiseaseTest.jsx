import React, { useRef, useState } from "react";
import axios from "axios";
import { HiOutlineHeart } from "react-icons/hi2";
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

// Display-only helpers: group the snake_case keys by suffix and humanise them.
const GROUPS = [
  { suffix: "_mean", title: "Mean values", note: "Average of each nucleus feature" },
  { suffix: "_se", title: "Standard error", note: "Variation across nuclei" },
  { suffix: "_worst", title: "Worst values", note: "Mean of the three largest values" },
];
const humanise = (key, suffix) => {
  const base = key.slice(0, -suffix.length).replace(/_/g, " ");
  return base.charAt(0).toUpperCase() + base.slice(1);
};

// A realistic example row (Wisconsin diagnostic breast cancer dataset, case
// 842302), keyed like the state.
const SAMPLE_VALUES = {
  radius_mean: "17.99",
  texture_mean: "10.38",
  perimeter_mean: "122.8",
  area_mean: "1001",
  smoothness_mean: "0.1184",
  compactness_mean: "0.2776",
  concavity_mean: "0.3001",
  concave_points_mean: "0.1471",
  symmetry_mean: "0.2419",
  radius_se: "1.095",
  perimeter_se: "8.589",
  area_se: "153.4",
  compactness_se: "0.04904",
  concavity_se: "0.05373",
  concave_points_se: "0.01587",
  fractal_dimension_se: "0.006193",
  radius_worst: "25.38",
  texture_worst: "17.33",
  perimeter_worst: "184.6",
  area_worst: "2019",
  smoothness_worst: "0.1622",
  compactness_worst: "0.6656",
  concavity_worst: "0.7119",
  concave_points_worst: "0.2654",
  symmetry_worst: "0.4601",
  fractal_dimension_worst: "0.1189",
};

const BreastCancerPredictor = () => {
  const [inputData, setInputData] = useState({
    radius_mean: "",
    texture_mean: "",
    perimeter_mean: "",
    area_mean: "",
    smoothness_mean: "",
    compactness_mean: "",
    concavity_mean: "",
    concave_points_mean: "",
    symmetry_mean: "",
    radius_se: "",
    perimeter_se: "",
    area_se: "",
    compactness_se: "",
    concavity_se: "",
    concave_points_se: "",
    fractal_dimension_se: "",
    radius_worst: "",
    texture_worst: "",
    perimeter_worst: "",
    area_worst: "",
    smoothness_worst: "",
    compactness_worst: "",
    concavity_worst: "",
    concave_points_worst: "",
    symmetry_worst: "",
    fractal_dimension_worst: "",
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
      const response = await axios.post(`${BASE_URL}/breast-cancer`, {
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
      title="Breast Cancer Predictor"
      description="Classify a breast mass as benign or malignant from fine-needle aspirate (FNA) cell measurements."
      icon={HiOutlineHeart}
      badge="26 inputs"
      form={
        <FormCard
          ref={formRef}
          title="Cell nucleus measurements"
          subtitle="Values are taken from a digitised FNA image report."
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
          <div className="space-y-8">
            {GROUPS.map((group) => (
              <fieldset key={group.suffix}>
                <legend className="mb-4 flex w-full items-baseline justify-between gap-3">
                  <span className="text-sm font-semibold uppercase tracking-[0.1em] text-brand-700">
                    {group.title}
                  </span>
                  <span className="text-xs text-muted">{group.note}</span>
                </legend>
                <FieldGrid cols={3}>
                  {Object.entries(inputData)
                    .filter(([name]) => name.endsWith(group.suffix))
                    .map(([name, value]) => (
                      <Field
                        key={name}
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        label={humanise(name, group.suffix)}
                        placeholder="0.00"
                        invalid={!!formError && value.trim() === ""}
                      />
                    ))}
                </FieldGrid>
              </fieldset>
            ))}
          </div>
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
              title={isRisk ? "Resembles a malignant profile" : "Resembles a benign profile"}
              message={
                isRisk
                  ? "These cell measurements look like those of malignant masses — an oncologist can confirm with a biopsy review."
                  : "These cell measurements look like those of benign masses — keep up your routine screening."
              }
              onReset={resetTest}
              autoScroll
            />
          ) : (
            <AwaitingResult />
          )}
          <InfoCard
            items={[
              "Size of the nuclei: radius, perimeter and area",
              "Texture and smoothness of the cell surface",
              "Shape: compactness, concavity and symmetry",
              "Mean, standard error and worst-case values",
            ]}
          />
        </>
      }
    >
      <DoctorSection>
        <DcotorsDropDown
          testName={"Breast Cancer Predictor"}
          testResult={prediction?.includes("[1]") ? "Unhealthy" : "Healthy"}
        />
      </DoctorSection>
    </TestLayout>
  );
};

export default BreastCancerPredictor;
