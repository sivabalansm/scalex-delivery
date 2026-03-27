import {
  createContext,
  useContext,
  useRef,
  useCallback,
  useSyncExternalStore,
  type FC,
  type ReactNode,
} from "react";
import type { ExtractionData } from "../types/extraction";

type ExtractionStore = {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => Map<string, ExtractionData>;
  getData: (messageId: string) => ExtractionData | undefined;
  setData: (messageId: string, data: ExtractionData) => void;
};

function createExtractionStore(): ExtractionStore {
  const data = new Map<string, ExtractionData>();
  const listeners = new Set<() => void>();

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot() {
      return data;
    },
    getData(messageId: string) {
      return data.get(messageId);
    },
    setData(messageId: string, newData: ExtractionData) {
      const existing = data.get(messageId);
      if (
        !existing ||
        existing.progress !== newData.progress ||
        existing.status !== newData.status ||
        existing.clausesFound !== newData.clausesFound ||
        existing.summary !== newData.summary
      ) {
        data.set(messageId, newData);
        listeners.forEach((listener) => listener());
      }
    },
  };
}

type ExtractionDataContextType = {
  store: ExtractionStore;
};

const ExtractionDataContext = createContext<ExtractionDataContextType | undefined>(
  undefined
);

export const useExtractionMessage = (messageId: string | null): ExtractionData | undefined => {
  const context = useContext(ExtractionDataContext);
  if (!context) {
    throw new Error("useExtractionMessage must be used within ExtractionDataProvider");
  }

  const { store } = context;

  const data = useSyncExternalStore(
    store.subscribe,
    useCallback(() => (messageId ? store.getData(messageId) : undefined), [store, messageId])
  );

  return data;
};

export const useUpdateExtractionData = () => {
  const context = useContext(ExtractionDataContext);
  if (!context) {
    throw new Error("useUpdateExtractionData must be used within ExtractionDataProvider");
  }

  return context.store.setData;
};

type Props = {
  children: ReactNode;
};

export const ExtractionDataProvider: FC<Props> = ({ children }) => {
  const storeRef = useRef<ExtractionStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = createExtractionStore();
  }

  return (
    <ExtractionDataContext.Provider value={{ store: storeRef.current }}>
      {children}
    </ExtractionDataContext.Provider>
  );
};
