import React, { useRef, useState } from "react";
import axios from "axios";
import { LuScanLine } from "react-icons/lu";
import { BASE_URL } from "../../../config";
import DcotorsDropDown from "../../DoctorDropDown/DoctorDropDown";
import TestLayout, {
  FormCard,
  FormError,
  SubmitRow,
  InfoCard,
  AwaitingResult,
  AnalysingResult,
  ResultPanel,
  ImageDropzone,
  DoctorSection,
  parseImagePrediction,
  scrollToElement,
} from "./TestLayout";

const PneumoniaDiseaseTest = () => {
  const [imagePreview, setImagePreview] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  // Shared by the file dialog and drag-and-drop.
  const handleFile = (file) => {
    if (!file) return;
    if (!file.type || !file.type.startsWith("image/")) {
      setFormError(
        `"${file.name}" isn't an image. Please choose a PNG or JPG chest X-ray.`
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      setImagePreview(e.target.result);
      setSelectedImage(file);
      setPrediction(null);
      setConfidence(null);
      setFormError("");
    };
    reader.onerror = () => {
      setFormError("We couldn't read that file. Please try another image.");
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview("");
    setSelectedImage(null);
    setPrediction(null);
    setConfidence(null);
    setFormError("");
  };

  const resetTest = () => {
    removeImage();
    scrollToElement(formRef.current);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      setFormError("Please select an image.");
      return;
    }
    setLoading(true);
    setFormError("");
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      const response = await axios.post(
        `${BASE_URL}/predict-pneumonia`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // The model returns [p(normal), p(pneumonia)] as a string, e.g. "[0.97, 0.03]\n".
      const { probs, error } = parseImagePrediction(response.data.prediction);
      if (error) {
        setPrediction(null);
        setConfidence(null);
        setFormError(error);
        return;
      }
      const risk = probs[1] > probs[0];
      setConfidence(Math.round(Math.max(...probs) * 100));
      setPrediction(risk ? 1 : 0);
    } catch (error) {
      console.error("Error:", error);
      setFormError("We couldn't reach the prediction service. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const isRisk = prediction == 1;

  return (
    <TestLayout
      title="Pneumonia Predictor"
      description="Screen a chest X-ray for radiographic signs of pneumonia."
      icon={LuScanLine}
      badge="Image analysis"
      form={
        <FormCard
          ref={formRef}
          title="Upload chest X-ray"
          subtitle="A frontal (PA or AP) chest radiograph works best."
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <ImageDropzone
            label="Chest X-ray image"
            hint="PNG or JPG · frontal chest view"
            onFile={handleFile}
            onRemove={removeImage}
            preview={imagePreview}
            file={selectedImage}
            invalid={!!formError && !selectedImage}
            disabled={loading}
          />
          <FormError>{formError}</FormError>
          <SubmitRow
            loading={loading}
            note="Your image is uploaded to our server so the model can analyse it."
          />
        </FormCard>
      }
      aside={
        <>
          {loading ? (
            <AnalysingResult text="Image analysis usually takes 5–10 seconds." />
          ) : prediction !== null ? (
            <ResultPanel
              risk={isRisk}
              title={isRisk ? "Pneumonia likely — consult a doctor" : "No pneumonia detected"}
              message={
                isRisk
                  ? "The model found lung patterns typical of pneumonia on this X-ray — a doctor should review it soon."
                  : "The model found no radiographic signs of pneumonia on this X-ray."
              }
              confidence={confidence}
              onReset={resetTest}
              autoScroll
            />
          ) : (
            <AwaitingResult text="Upload an X-ray and run the prediction to see your result here." />
          )}
          <InfoCard
            items={[
              "Lung opacity and consolidation patterns",
              "Distribution of infiltrates across lung fields",
              "Classified by a convolutional neural network",
            ]}
          />
        </>
      }
    >
      <DoctorSection>
        <DcotorsDropDown
          testName={"Pneumonia Predictor"}
          testResult={prediction === 1 ? "Unhealthy" : "Healthy"}
        />
      </DoctorSection>
    </TestLayout>
  );
};

export default PneumoniaDiseaseTest;
