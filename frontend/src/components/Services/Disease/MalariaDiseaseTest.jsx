import React, { useRef, useState } from "react";
import axios from "axios";
import { LuMicroscope } from "react-icons/lu";
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

const MalariaDiseaseTest = () => {
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
        `"${file.name}" isn't an image. Please choose a PNG or JPG cell image.`
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
        `${BASE_URL}/predict-malaria`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // The model returns [p(uninfected), p(infected)] as a string, e.g. "[0.97, 0.03]\n".
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
      title="Malaria Predictor"
      description="Detect Plasmodium parasites in a microscopic image of a thin blood-smear cell."
      icon={LuMicroscope}
      badge="Image analysis"
      form={
        <FormCard
          ref={formRef}
          title="Upload cell image"
          subtitle="Use a single, well-focused, segmented red blood cell image."
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <ImageDropzone
            label="Blood-smear cell image"
            hint="PNG or JPG · one cell per image"
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
              title={isRisk ? "Infected cell detected" : "No infection detected"}
              message={
                isRisk
                  ? "The model found parasite structures typical of malaria in this cell — please see a doctor for a confirmatory blood test."
                  : "The model found no signs of malaria parasites in this cell."
              }
              confidence={confidence}
              onReset={resetTest}
              autoScroll
            />
          ) : (
            <AwaitingResult text="Upload a cell image and run the prediction to see your result here." />
          )}
          <InfoCard
            items={[
              "Stained red blood cell morphology",
              "Presence of Plasmodium parasite structures",
              "Classified by a convolutional neural network",
            ]}
          />
        </>
      }
    >
      <DoctorSection>
        <DcotorsDropDown
          testName={"Malaria Disease"}
          testResult={prediction === 1 ? "Unhealthy" : "Healthy"}
        />
      </DoctorSection>
    </TestLayout>
  );
};

export default MalariaDiseaseTest;
