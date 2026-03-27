import type { IntegrationMessage } from "@botpress/webchat";
import {
  Composer,
  Container,
  MessageList,
  StylesheetProvider,
  useWebchat,
  enrichMessage,
} from "@botpress/webchat";
import * as React from "react";
import "./App.css";
import CustomMessageRenderer from "./components/CustomMessageRenderer";
import ClauseDetailPanel from "./components/ClauseDetailPanel";
import PostSessionSurvey from "./components/PostSessionSurvey";
import { BOT_CONFIG, CLIENT_ID } from "./config/constants";
import {
  ExtractionProvider,
  useExtraction,
} from "./context/ExtractionContext";
import { ExtractionDataProvider } from "./context/ExtractionDataContext";
import { AnalyticsProvider, useAnalytics } from "./context/AnalyticsContext";
import { useExtractionPolling } from "./hooks/useExtractionPolling";
import { useSessionTracker } from "./hooks/useSessionTracker";
import { useInlineFeedback } from "./hooks/useInlineFeedback";

/** Filter out analytics prefix messages from the visible message list */
function containsAnalyticsPrefix(obj: unknown): boolean {
  if (typeof obj === "string") {
    return obj.startsWith("__FEEDBACK__:") || obj.startsWith("__SURVEY__:");
  }
  if (obj && typeof obj === "object") {
    return Object.values(obj).some(containsAnalyticsPrefix);
  }
  return false;
}

function filterAnalyticsMessages(messages: any[]) {
  return messages.filter((msg) => !containsAnalyticsPrefix(msg.block));
}

/** Inner component that uses analytics context for inline feedback */
function InlineFeedbackInjector() {
  const { submitFeedback, hasRated } = useAnalytics();
  useInlineFeedback(submitFeedback, hasRated);
  return null;
}

function AppContent() {
  const {
    client,
    messages,
    isTyping,
    user,
    clientState,
    newConversation,
    conversationId,
    participants,
  } = useWebchat({
    clientId: CLIENT_ID,
  });

  const isLoading = clientState === "connecting" || clientState === "disconnected";
  const filtered = filterAnalyticsMessages(messages);

  // Enrich messages with direction (incoming/outgoing) so MessageList renders correctly
  const visibleMessages = React.useMemo(
    () => enrichMessage(filtered, participants ?? [], user?.userId ?? "", BOT_CONFIG.name),
    [filtered, participants, user?.userId]
  );
  const hasMessages = visibleMessages.length > 0;

  const { shouldShowSurvey, markSurveyShown, resetSession } =
    useSessionTracker(visibleMessages.length);

  const [surveyOpen, setSurveyOpen] = React.useState(false);
  const pendingNewConversation = React.useRef(false);

  useExtractionPolling({
    messages,
    conversationId,
    clientId: CLIENT_ID,
    userId: user?.userToken,
  });

  const { extractionData, isPanelOpen, isPanelExpanded, closePanel } =
    useExtraction();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const composerInput = document.querySelector(
        'textarea[placeholder*="Upload"]'
      ) as HTMLTextAreaElement;
      if (composerInput) {
        composerInput.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const sendMessage = React.useCallback(
    async (payload: IntegrationMessage["payload"]) => {
      if (!client) return;

      try {
        await client.sendMessage(payload);
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    },
    [client]
  );

  const sendTextMessage = React.useCallback(
    async (payload: { type: "text"; text: string }) => {
      await sendMessage(payload);
    },
    [sendMessage]
  );

  const handleNewConversation = () => {
    if (shouldShowSurvey) {
      pendingNewConversation.current = true;
      setSurveyOpen(true);
    } else {
      startNewConversation();
    }
  };

  const startNewConversation = () => {
    resetSession();
    newConversation();
    setTimeout(() => {
      const composerInput = document.querySelector(
        'textarea[placeholder*="Upload"]'
      ) as HTMLTextAreaElement;
      if (composerInput) {
        composerInput.focus();
      }
    }, 100);
  };

  const handleSurveyComplete = () => {
    markSurveyShown();
    setSurveyOpen(false);
    if (pendingNewConversation.current) {
      pendingNewConversation.current = false;
      startNewConversation();
    }
  };

  const handleSurveySkip = () => {
    markSurveyShown();
    setSurveyOpen(false);
    if (pendingNewConversation.current) {
      pendingNewConversation.current = false;
      startNewConversation();
    }
  };

  const getPanelMargin = () => {
    if (!isPanelOpen) return "0";
    if (isPanelExpanded) return "min(700px, 70vw)";
    return "min(420px, 50vw)";
  };

  return (
    <AnalyticsProvider sendMessage={sendTextMessage}>
      <InlineFeedbackInjector />
      <div
        style={{
          display: "flex",
          width: "100vw",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className={`chat-wrapper ${isLoading ? "is-loading" : hasMessages ? "has-messages" : "empty-state"}`}
          style={{
            flex: 1,
            display: "flex",
            position: "relative",
            transition: "margin-right 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            marginRight: getPanelMargin(),
            minWidth: 0,
          }}
        >
          <Container
            connected={clientState !== "disconnected"}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
            }}
          >
            {/* Restart conversation button */}
            <button
              onClick={handleNewConversation}
              className="restart-button"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              New
            </button>
            {/* Loading spinner */}
            {isLoading && (
              <div className="loading-spinner">
                <div className="spinner" />
              </div>
            )}
            {/* Empty state */}
            <div className="empty-state-title">
              <div className="scalex-logo-mark">M</div>
              <h1>MaxxBot Contract Analysis</h1>
              <p className="empty-state-subtitle">AI Procurement Intelligence Assistant</p>
            </div>
            <MessageList
              botName={BOT_CONFIG.name}
              botDescription={BOT_CONFIG.description}
              isTyping={isTyping}
              showMessageStatus={true}
              showMarquee={true}
              messages={visibleMessages}
              sendMessage={sendMessage}
              renderers={{
                custom: CustomMessageRenderer,
              }}
            />
            <Composer
              disableComposer={false}
              isReadOnly={false}
              allowFileUpload={true}
              uploadFile={client?.uploadFile}
              connected={clientState !== "disconnected"}
              sendMessage={sendMessage}
              composerPlaceholder="Upload a contract or ask about vendors..."
            />
          </Container>
          <div className="composer-footer-text">
            <span>
              Powered by{" "}
              <a
                href="https://botpress.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Botpress
              </a>
            </span>
          </div>
          <StylesheetProvider
            radius={1.5}
            fontFamily="Inter"
            variant="solid"
            color="#ef3e34"
          />
        </div>

        {/* Side Panel for extraction details */}
        {extractionData && (
          <ClauseDetailPanel
            data={extractionData}
            isOpen={isPanelOpen}
            onClose={closePanel}
          />
        )}
      </div>

      {/* Post-session survey modal */}
      <PostSessionSurvey
        isOpen={surveyOpen}
        onComplete={handleSurveyComplete}
        onSkip={handleSurveySkip}
      />
    </AnalyticsProvider>
  );
}

function App() {
  return (
    <ExtractionDataProvider>
      <ExtractionProvider>
        <AppContent />
      </ExtractionProvider>
    </ExtractionDataProvider>
  );
}

export default App;
