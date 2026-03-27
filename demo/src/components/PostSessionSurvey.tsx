import * as React from "react";
import { Star, X } from "lucide-react";
import { useAnalytics, type SurveyData } from "../context/AnalyticsContext";

interface PostSessionSurveyProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export default function PostSessionSurvey({ isOpen, onComplete, onSkip }: PostSessionSurveyProps) {
  const { submitSurvey } = useAnalytics();
  const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [bestFeature, setBestFeature] = React.useState("");
  const [improvement, setImprovement] = React.useState("");
  const [expectedCapabilities, setExpectedCapabilities] = React.useState("");
  const [nps, setNps] = React.useState<number | null>(null);

  const handleSubmit = () => {
    if (rating === 0) return;

    const data: SurveyData = {
      overallRating: rating,
      ...(bestFeature && { bestFeature }),
      ...(improvement && { improvementSuggestion: improvement }),
      ...(expectedCapabilities && { expectedCapabilities }),
      ...(nps !== null && { wouldRecommend: nps }),
    };

    submitSurvey(data);
    resetForm();
    onComplete();
  };

  const handleSkip = () => {
    resetForm();
    onSkip();
  };

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setBestFeature("");
    setImprovement("");
    setExpectedCapabilities("");
    setNps(null);
  };

  if (!isOpen) return null;

  return (
    <div className="survey-overlay" onClick={handleSkip}>
      <div className="survey-modal" onClick={(e) => e.stopPropagation()}>
        <button className="survey-close" onClick={handleSkip} aria-label="Close">
          <X size={18} />
        </button>

        <h2 className="survey-title">How was your experience?</h2>
        <p className="survey-subtitle">Help us improve MaxxBot before you go.</p>

        {/* Star Rating */}
        <div className="survey-section">
          <label className="survey-label">Overall Rating</label>
          <div className="survey-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="survey-star-btn"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
              >
                <Star
                  size={28}
                  className={
                    star <= (hoverRating || rating)
                      ? "survey-star-filled"
                      : "survey-star-empty"
                  }
                />
              </button>
            ))}
          </div>
        </div>

        {/* Text Areas */}
        <div className="survey-section">
          <label className="survey-label">What did MaxxBot do well?</label>
          <textarea
            className="survey-textarea"
            value={bestFeature}
            onChange={(e) => setBestFeature(e.target.value)}
            placeholder="e.g., accurate rates, fast vendor lookups..."
            rows={2}
          />
        </div>

        <div className="survey-section">
          <label className="survey-label">What should MaxxBot do differently?</label>
          <textarea
            className="survey-textarea"
            value={improvement}
            onChange={(e) => setImprovement(e.target.value)}
            placeholder="e.g., more detail on SLAs, better formatting..."
            rows={2}
          />
        </div>

        <div className="survey-section">
          <label className="survey-label">What did you expect MaxxBot could help with?</label>
          <textarea
            className="survey-textarea"
            value={expectedCapabilities}
            onChange={(e) => setExpectedCapabilities(e.target.value)}
            placeholder="e.g., draft RFPs, compare vendors side-by-side..."
            rows={2}
          />
        </div>

        {/* NPS Slider */}
        <div className="survey-section">
          <label className="survey-label">
            How likely are you to recommend MaxxBot? (1-10)
          </label>
          <div className="survey-nps">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={`survey-nps-btn ${nps === n ? "survey-nps-btn-selected" : ""}`}
                onClick={() => setNps(n)}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="survey-nps-labels">
            <span>Not likely</span>
            <span>Very likely</span>
          </div>
        </div>

        {/* Actions */}
        <div className="survey-actions">
          <button className="survey-btn-skip" onClick={handleSkip}>
            Skip
          </button>
          <button
            className="survey-btn-submit"
            onClick={handleSubmit}
            disabled={rating === 0}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
