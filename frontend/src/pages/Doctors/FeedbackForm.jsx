import { useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { BASE_URL, token } from "../../config";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const handleSubmitReview = async (e) => {
    console.log("call");
    e.preventDefault();
    setLoading(true);

    try {
      if (!rating || !reviewText) {
        setLoading(false);
        return toast.error("Rating & Review Fields  are required");
      }
      const res = await fetch(`${BASE_URL}/doctors/${id}/reviews`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, reviewText }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }
      setLoading(false);
      toast.success(result.message);
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };
  return (
    <form
      action=""
      className="rounded-2xl bg-surface p-6 ring-1 ring-inset ring-line md:p-8"
    >
      <div>
        <h3 className="form__label mb-3 text-[15px]">
          How would you rate the overall experience?*
        </h3>

        <div className="flex gap-1">
          {[...Array(5).keys()].map((_, index) => {
            index += 1;

            return (
              <button
                key={index}
                type="button"
                aria-label={`${index} star${index > 1 ? "s" : ""}`}
                className={`${
                  index <= ((rating && hover) || hover)
                    ? "text-yellowColor"
                    : "text-slate-300"
                } cursor-pointer rounded-md border-none bg-transparent text-[26px] outline-none transition hover:scale-110 focus-visible:ring-4 focus-visible:ring-brand-100`}
                onClick={() => setRating(index)}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(rating)}
                onDoubleClick={() => {
                  setHover(0);
                  setRating(0);
                }}
              >
                <span>
                  <AiFillStar />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="review-text" className="form__label text-[15px]">
          Share your feedback and suggestions*
        </label>
        <textarea
          id="review-text"
          className="form__input resize-y"
          rows="5"
          placeholder="Tell us about your experience..."
          onChange={(e) => setReviewText(e.target.value)}
        ></textarea>
      </div>
      <button
        type="submit"
        onClick={handleSubmitReview}
        className="btn-primary mt-6 min-w-[180px]"
        disabled={loading}
      >
        {loading ? <HashLoader size={22} color="#fff" /> : "Submit Feedback"}
      </button>
    </form>
  );
};

export default FeedbackForm;
