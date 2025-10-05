import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { selectSelectedPlan } from "../../redux/nearbyMessSlice";
import { FiSend } from "react-icons/fi";

export const FeedbackComponent: React.FC = () => {
  const selectedPlan = useSelector(selectSelectedPlan);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const ratingLabel = (rate: number) =>
    rate === 5 ? "Excellent" :
    rate === 4 ? "Good" :
    rate === 3 ? "Average" :
    rate === 2 ? "Poor" :
    "Very Poor";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlan?.messId?._id) {
      alert("No mess selected for feedback!");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${BACKEND_URL}/api/v1/user/feedback/feedback`,
        {
          messId: selectedPlan.messId._id,
          feedback: `${feedback} | Rating: ${rating}`,
        },
        { headers: { token } }
      );

      alert(res.data?.message || "Feedback submitted successfully!");
      setFeedback("");
      setRating(5);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Share Your Feedback</h3>
        <p className="text-gray-500">We value your experience with this mess</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div className="text-center">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How would you rate your experience?
          </label>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className={`text-3xl transition-all duration-200 ${
                  star <= (hoverRating || rating) 
                    ? "text-yellow-400 transform scale-110" 
                    : "text-gray-300"
                }`}
              >
                {star <= (hoverRating || rating) ? "★" : "☆"}
              </button>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-500">{ratingLabel(rating)}</div>
        </div>

        {/* Feedback Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tell us more</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm"
            placeholder="What did you like or dislike about the food, service, or cleanliness?"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 text-white font-medium py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          {submitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <FiSend className="text-lg" />
              Submit Feedback
            </>
          )}
        </button>
      </form>
    </div>
  );
};
