import {
  createContext,
  useContext,
  useState,
  useCallback,
  type FC,
  type ReactNode,
} from "react";
import type { ExtractionData, Clause } from "../types/extraction";

type ExtractionContextType = {
  extractionData: ExtractionData | null;
  isPanelOpen: boolean;
  isPanelExpanded: boolean;
  currentMessageId: string | null;
  selectedClause: Clause | null;
  openPanel: (data: ExtractionData, messageId: string) => void;
  closePanel: () => void;
  selectClause: (clause: Clause | null) => void;
  clearSelection: () => void;
};

const ExtractionContext = createContext<ExtractionContextType | undefined>(
  undefined
);

export const useExtraction = () => {
  const context = useContext(ExtractionContext);
  if (!context) {
    throw new Error("useExtraction must be used within ExtractionProvider");
  }
  return context;
};

type Props = {
  children: ReactNode;
};

export const ExtractionProvider: FC<Props> = ({ children }) => {
  const [extractionData, setExtractionData] = useState<ExtractionData | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);

  const isPanelExpanded = selectedClause !== null;

  const openPanel = useCallback((data: ExtractionData, messageId: string) => {
    setExtractionData(data);
    setCurrentMessageId(messageId);
    setIsPanelOpen(true);
    setSelectedClause(null);
  }, []);

  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
    setTimeout(() => {
      setExtractionData(null);
      setCurrentMessageId(null);
      setSelectedClause(null);
    }, 300);
  }, []);

  const selectClause = useCallback((clause: Clause | null) => {
    setSelectedClause(clause);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedClause(null);
  }, []);

  return (
    <ExtractionContext.Provider
      value={{
        extractionData,
        isPanelOpen,
        isPanelExpanded,
        currentMessageId,
        selectedClause,
        openPanel,
        closePanel,
        selectClause,
        clearSelection,
      }}
    >
      {children}
    </ExtractionContext.Provider>
  );
};
