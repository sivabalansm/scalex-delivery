import * as React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useAnalytics } from "../context/AnalyticsContext";

interface FeedbackBarProps {
  lastBotMessageId: string | null;
}

export default function FeedbackBar({ lastBotMessageId }: FeedbackBarProps) {
  const { submitFeedback, hasRated } = useAnalytics();
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);
  const [showComment, setShowComment] = React.useState(false);
  const [comment, setComment] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const prevMessageIdRef = React.useRef<string | null>(null);

  // Reset state when the last bot message changes
  React.useEffect(() => {
    if (lastBotMessageId !== prevMessageIdRef.current) {
      prevMessageIdRef.current = lastBotMessageId;
      setSelectedRating(null);
      setShowComment(false);
      setComment("");
      // Check if this message was already rated in a previous render
      setSubmitted(lastBotMessageId ? hasRated(lastBotMessageId) : false);
    }
  }, [lastBotMessageId, hasRated]);

  if (!lastBotMessageId) return null;

  const handleRate = (rating: number) => {
    if (submitted) return;
    setSelectedRating(rating);
    setShowComment(true);
  };

  const handleSubmit = () => {
    if (!lastBotMessageId || selectedRating === null) return;
    submitFeedback(lastBotMessageId, selectedRating, comment || undefined);
    setSubmitted(true);
    setShowComment(false);
  };

  const handleSkip = () => {
    if (!lastBotMessageId || selectedRating === null) return;
    submitFeedback(lastBotMessageId, selectedRating);
    setSubmitted(true);
    setShowComment(false);
  };

  if (submitted) {
    return (
      <div className="feedback-bar feedback-bar-thanks">
        <span className="feedback-thanks-text">Thanks for your feedback!</span>
      </div>
    );
  }

  return (
    <div className="feedback-bar">
      <div className="feedback-buttons">
        <span className="feedback-label">How was this response?</span>
        <button
          className={`feedback-btn ${selectedRating === 1 ? "feedback-btn-selected" : ""}`}
          onClick={() => handleRate(1)}
          aria-label="Thumbs up"
        >
          <ThumbsUp size={14} />
        </button>
        <button
          className={`feedback-btn ${selectedRating === -1 ? "feedback-btn-selected" : ""}`}
          onClick={() => handleRate(-1)}
          aria-label="Thumbs down"
        >
          <ThumbsDown size={14} />
        </button>
      </div>
      {showComment && (
        <div className="feedback-comment">
          <input
            type="text"
            className="feedback-comment-input"
            placeholder="Any additional thoughts? (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
          <div className="feedback-comment-actions">
            <button className="feedback-comment-skip" onClick={handleSkip}>
              Skip
            </button>
            <button className="feedback-comment-submit" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
