import { AiFillStar } from "react-icons/ai";
import { formateDate } from "../../utils/formatDate";
import defaultimg from "../../assets/images/avatar-icon.png";
import { useState } from "react";
import FeedbackForm from "./FeedbackForm";
import { LuMessageSquare } from "react-icons/lu";

const Feedback = ({ reviews, totalRating }) => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  console.log(reviews);

  return (
    <div>
      <div className="mb-10">
        <h4 className="mb-6 text-xl font-bold leading-8 text-ink">
          All reviews{" "}
          <span className="font-semibold text-muted">({totalRating})</span>
        </h4>

        {reviews?.length === 0 && (
          <p className="rounded-2xl bg-surface p-6 text-center text-[15px] text-muted ring-1 ring-inset ring-line">
            No reviews yet. Be the first to share your experience.
          </p>
        )}

        <div className="divide-y divide-line">
          {reviews?.map((review, index) => (
            <div
              key={index}
              className="flex flex-col justify-between gap-3 py-5 first:pt-0 sm:flex-row sm:gap-10"
            >
              <div className="flex gap-3">
                <figure className="h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-line">
                  <img
                    src={review.user?.photo || defaultimg}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </figure>

                <div>
                  <h5 className="text-[15px] font-semibold leading-6 text-ink">
                    {review.user?.name || "Unknown User"}
                  </h5>
                  <p className="text-sm leading-5 text-muted">
                    {formateDate(review?.createdAt)}
                  </p>
                  <p className="mt-3 text-[15px] leading-7 text-ink-700">
                    {review?.reviewText}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 gap-0.5 pl-[52px] sm:pl-0">
                {[...Array(review?.rating).keys()].map((_, index) => (
                  <AiFillStar key={index} className="h-4 w-4 text-yellowColor" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!showFeedbackForm && (
        <div className="text-center">
          <button
            className="btn-primary"
            onClick={() => setShowFeedbackForm(true)}
          >
            <LuMessageSquare className="h-4 w-4" />
            Give Feedback
          </button>
        </div>
      )}

      {showFeedbackForm && <FeedbackForm />}
    </div>
  );
};

export default Feedback;
