import * as React from "react";

interface AnalyticsContextValue {
  submitFeedback: (messageId: string, rating: number, comment?: string, messagePreview?: string) => void;
  submitSurvey: (data: SurveyData) => void;
  hasRated: (messageId: string) => boolean;
  ratedMessages: Set<string>;
}

export interface SurveyData {
  overallRating: number;
  bestFeature?: string;
  improvementSuggestion?: string;
  expectedCapabilities?: string;
  wouldRecommend?: number;
}

const AnalyticsContext = React.createContext<AnalyticsContextValue | null>(null);

interface AnalyticsProviderProps {
  children: React.ReactNode;
  sendMessage: (payload: { type: "text"; text: string }) => Promise<void>;
}

export function AnalyticsProvider({ children, sendMessage }: AnalyticsProviderProps) {
  const [ratedMessages, setRatedMessages] = React.useState<Set<string>>(new Set());

  const submitFeedback = React.useCallback(
    (messageId: string, rating: number, comment?: string, messagePreview?: string) => {
      if (ratedMessages.has(messageId)) return;

      const payload = {
        messageId,
        rating,
        ...(comment && { comment }),
        ...(messagePreview && { messagePreview }),
      };

      sendMessage({
        type: "text",
        text: `__FEEDBACK__:${JSON.stringify(payload)}`,
      });

      setRatedMessages((prev) => new Set(prev).add(messageId));
    },
    [ratedMessages, sendMessage]
  );

  const submitSurvey = React.useCallback(
    (data: SurveyData) => {
      sendMessage({
        type: "text",
        text: `__SURVEY__:${JSON.stringify(data)}`,
      });
    },
    [sendMessage]
  );

  const hasRated = React.useCallback(
    (messageId: string) => ratedMessages.has(messageId),
    [ratedMessages]
  );

  const value = React.useMemo(
    () => ({ submitFeedback, submitSurvey, hasRated, ratedMessages }),
    [submitFeedback, submitSurvey, hasRated, ratedMessages]
  );

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = React.useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
}
