import { type FC, useEffect, useRef } from "react";
import type { BlockObjects } from "@botpress/webchat";
import ClauseExtractionCard from "./ClauseExtractionCard";
import { useExtraction } from "../context/ExtractionContext";
import { useUpdateExtractionData, useExtractionMessage } from "../context/ExtractionDataContext";
import type { ExtractionData } from "../types/extraction";

type CustomBlockProps = BlockObjects["custom"];

interface CustomBlockWithExtraction extends CustomBlockProps {
  messageId?: string;
  data?: ExtractionData;
}

const CustomMessageRenderer: FC<CustomBlockProps> = (props) => {
  const { openPanel, isPanelOpen } = useExtraction();
  const updateExtractionData = useUpdateExtractionData();
  const hasAutoOpened = useRef<Set<string>>(new Set());

  const customProps = props as CustomBlockWithExtraction;
  const url = customProps.url || "";
  const data = customProps.data;
  const messageId = customProps.messageId;

  const cachedData = useExtractionMessage(messageId ?? null);

  useEffect(() => {
    if (messageId && data) {
      updateExtractionData(messageId, data);
    }
  }, [messageId, data, updateExtractionData]);

  useEffect(() => {
    if (
      messageId &&
      data &&
      data.status === "in_progress" &&
      !isPanelOpen &&
      !hasAutoOpened.current.has(messageId)
    ) {
      hasAutoOpened.current.add(messageId);
      openPanel(data, messageId);
    }
  }, [messageId, data, isPanelOpen, openPanel]);

  if (
    url === "custom://scalex_extraction_progress" ||
    url === "custom://extraction_progress" ||
    url === "custom://clause_extraction"
  ) {
    const currentData = cachedData || data;

    if (!currentData) {
      return (
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">Loading extraction data...</p>
        </div>
      );
    }

    const handleExpand = () => {
      if (messageId && currentData) {
        openPanel(currentData, messageId);
      }
    };

    return <ClauseExtractionCard data={currentData} onExpand={handleExpand} />;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <p className="text-sm text-gray-600">Unknown custom block: {url}</p>
    </div>
  );
};

export default CustomMessageRenderer;
