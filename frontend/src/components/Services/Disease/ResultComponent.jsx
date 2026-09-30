import React from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { ResultPanel } from "./TestLayout";

const ResultComponent = ({ prediction }) => {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate("/"); // Navigate to the home page
  };

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-xl">
        {prediction === 1 ? (
          <ResultPanel
            risk
            title="Pneumonia likely — consult a doctor"
            message="This X-Ray is predicted to have Pneumonia, Please Consult Doctor."
          />
        ) : (
          <ResultPanel
            risk={false}
            title="No pneumonia detected"
            message="This X-Ray does not have Pneumonia."
          />
        )}
        <div className="mt-6 flex justify-center">
          <button type="button" onClick={handleNavigateHome} className="btn-secondary">
            <HiOutlineArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultComponent;
