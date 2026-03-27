import * as React from "react";

interface SessionTrackerState {
  messageCount: number;
  surveyShown: boolean;
  shouldShowSurvey: boolean;
  markSurveyShown: () => void;
  resetSession: () => void;
}

export function useSessionTracker(messageCount: number): SessionTrackerState {
  const [surveyShown, setSurveyShown] = React.useState(false);

  // Survey should show when user has had at least 1 exchange (2+ messages = 1 user + 1 bot)
  const shouldShowSurvey = messageCount >= 2 && !surveyShown;

  const markSurveyShown = React.useCallback(() => {
    setSurveyShown(true);
  }, []);

  const resetSession = React.useCallback(() => {
    setSurveyShown(false);
  }, []);

  return {
    messageCount,
    surveyShown,
    shouldShowSurvey,
    markSurveyShown,
    resetSession,
  };
}
