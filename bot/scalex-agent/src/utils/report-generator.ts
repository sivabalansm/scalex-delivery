import {
  Document,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  HeadingLevel,
  AlignmentType,
  WidthType,
  BorderStyle,
  Packer,
  ShadingType,
  TableLayoutType,
} from "docx";
import type { ReportClause } from "./report-llm-analysis";

/**
 * Color map for risk levels
 */
const RISK_COLORS: Record<string, { bg: string; text: string }> = {
  high: { bg: "FF4444", text: "FFFFFF" },
  medium: { bg: "FFAA00", text: "000000" },
  low: { bg: "44BB44", text: "FFFFFF" },
};

/**
 * Shared thin border style for table cells
 */
const THIN_BORDER = {
  top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
  left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
  right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
} as const;

/**
 * Create a header cell with dark background
 */
function headerCell(text: string, widthPercent: number): TableCell {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.SOLID, color: "2B3A67" },
    borders: THIN_BORDER,
    children: [
      new Paragraph({
        children: [
          new TextRun({ text, bold: true, color: "FFFFFF", size: 20, font: "Calibri" }),
        ],
      }),
    ],
  });
}

/**
 * Create a standard body cell
 */
function bodyCell(text: string, widthPercent: number, options?: { bold?: boolean; color?: string; bgColor?: string }): TableCell {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    borders: THIN_BORDER,
    shading: options?.bgColor ? { type: ShadingType.SOLID, color: options.bgColor } : undefined,
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: options?.bold,
            color: options?.color || "333333",
            size: 18,
            font: "Calibri",
          }),
        ],
      }),
    ],
  });
}

interface RedlineRecommendation {
  clauseTitle: string;
  clauseType: string;
  originalExcerpt: string;
  suggestedChange: string;
}

export interface ReportParams {
  contractTitle: string;
  counterparty?: string;
  clauses: ReportClause[];
  summary: string;
  missingProtections: string[];
  redlineRecommendations: RedlineRecommendation[];
  negotiationPriorities: string[];
}

/**
 * Generate a Contract Review Summary DOCX document.
 * Returns a Buffer that can be uploaded via the Files API.
 */
export async function generateContractReport(params: ReportParams): Promise<Buffer> {
  const {
    contractTitle,
    counterparty,
    clauses,
    summary,
    missingProtections,
    redlineRecommendations,
    negotiationPriorities,
  } = params;

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Sort clauses by risk: high -> medium -> low
  const sortedClauses = [...clauses].sort((a, b) => {
    const riskOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
    return (riskOrder[a.riskLevel] ?? 3) - (riskOrder[b.riskLevel] ?? 3);
  });

  // ============================================================
  // Build Document Sections
  // ============================================================

  const children: Paragraph[] = [];

  // -- Title --
  children.push(
    new Paragraph({
      text: "Contract Review Summary",
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    })
  );

  // -- Subtitle: contract name, date, counterparty --
  const subtitleParts = [contractTitle];
  if (counterparty) subtitleParts.push(`Counterparty: ${counterparty}`);
  subtitleParts.push(`Date: ${today}`);

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: subtitleParts.join("  |  "),
          color: "666666",
          size: 22,
          font: "Calibri",
        }),
      ],
    })
  );

  // -- Executive Summary --
  if (summary) {
    children.push(
      new Paragraph({
        text: "Executive Summary",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 },
      })
    );
    children.push(
      new Paragraph({
        children: [new TextRun({ text: summary, size: 20, font: "Calibri" })],
        spacing: { after: 200 },
      })
    );
  }

  // -- Risk stats --
  const highCount = clauses.filter((c) => c.riskLevel === "high").length;
  const medCount = clauses.filter((c) => c.riskLevel === "medium").length;
  const lowCount = clauses.filter((c) => c.riskLevel === "low").length;

  children.push(
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({ text: "Risk Distribution: ", bold: true, size: 20, font: "Calibri" }),
        new TextRun({ text: `${highCount} High`, color: "FF4444", bold: true, size: 20, font: "Calibri" }),
        new TextRun({ text: "  |  ", size: 20, font: "Calibri" }),
        new TextRun({ text: `${medCount} Medium`, color: "CC8800", bold: true, size: 20, font: "Calibri" }),
        new TextRun({ text: "  |  ", size: 20, font: "Calibri" }),
        new TextRun({ text: `${lowCount} Low`, color: "228B22", bold: true, size: 20, font: "Calibri" }),
        new TextRun({ text: `  |  ${clauses.length} Total`, size: 20, font: "Calibri" }),
      ],
    })
  );

  // ============================================================
  // Section 1: Risk Summary Table
  // ============================================================

  children.push(
    new Paragraph({
      text: "1. Risk Summary Table",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 300, after: 150 },
    })
  );

  // Build table rows
  const tableHeaderRow = new TableRow({
    children: [
      headerCell("Clause Title", 20),
      headerCell("Type", 15),
      headerCell("Risk", 10),
      headerCell("Issue Summary", 30),
      headerCell("Recommendation", 25),
    ],
  });

  const tableDataRows = sortedClauses.map((clause) => {
    const risk = RISK_COLORS[clause.riskLevel] || RISK_COLORS.low;
    const issueSummary = clause.keyPoints.slice(0, 2).join("; ");
    const recommendation = clause.redlineRecommendation || (
      clause.riskLevel === "high" ? "Review and negotiate before signing" :
      clause.riskLevel === "medium" ? "Consider negotiating terms" :
      "Acceptable — standard language"
    );

    return new TableRow({
      children: [
        bodyCell(clause.title, 20, { bold: true }),
        bodyCell(clause.clauseType.replace(/_/g, " "), 15),
        bodyCell(clause.riskLevel.toUpperCase(), 10, {
          bold: true,
          color: risk.text,
          bgColor: risk.bg,
        }),
        bodyCell(issueSummary, 30),
        bodyCell(recommendation, 25),
      ],
    });
  });

  const riskTable = new Table({
    rows: [tableHeaderRow, ...tableDataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
  });

  // ============================================================
  // Section 2: Missing Standard Protections
  // ============================================================

  const section2Children: Paragraph[] = [
    new Paragraph({
      text: "2. Missing Standard Protections",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 300, after: 150 },
    }),
  ];

  if (missingProtections.length === 0) {
    section2Children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "All expected standard protections are present in this contract.",
            italics: true,
            color: "228B22",
            size: 20,
            font: "Calibri",
          }),
        ],
        spacing: { after: 200 },
      })
    );
  } else {
    for (const item of missingProtections) {
      section2Children.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun({ text: item, size: 20, font: "Calibri" })],
          spacing: { after: 60 },
        })
      );
    }
  }

  // ============================================================
  // Section 3: Recommended Redlines
  // ============================================================

  const section3Children: Paragraph[] = [
    new Paragraph({
      text: "3. Recommended Redlines",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 300, after: 150 },
    }),
  ];

  if (redlineRecommendations.length === 0) {
    section3Children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "No specific redline recommendations identified.",
            italics: true,
            size: 20,
            font: "Calibri",
          }),
        ],
        spacing: { after: 200 },
      })
    );
  } else {
    for (const rec of redlineRecommendations) {
      // Clause header
      section3Children.push(
        new Paragraph({
          spacing: { before: 150, after: 60 },
          children: [
            new TextRun({
              text: `${rec.clauseType.replace(/_/g, " ").toUpperCase()}: ${rec.clauseTitle}`,
              bold: true,
              size: 20,
              font: "Calibri",
            }),
          ],
        })
      );

      // Original text (strikethrough style)
      section3Children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: "Current: ", bold: true, color: "CC0000", size: 18, font: "Calibri" }),
            new TextRun({ text: rec.originalExcerpt, strike: true, color: "CC0000", size: 18, font: "Calibri" }),
          ],
        })
      );

      // Suggested change
      section3Children.push(
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({ text: "Suggested: ", bold: true, color: "006600", size: 18, font: "Calibri" }),
            new TextRun({ text: rec.suggestedChange, color: "006600", size: 18, font: "Calibri" }),
          ],
        })
      );
    }
  }

  // ============================================================
  // Section 4: Negotiation Priorities
  // ============================================================

  const section4Children: Paragraph[] = [
    new Paragraph({
      text: "4. Negotiation Priorities",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 300, after: 150 },
    }),
  ];

  if (negotiationPriorities.length === 0) {
    section4Children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "No specific negotiation priorities identified.",
            italics: true,
            size: 20,
            font: "Calibri",
          }),
        ],
        spacing: { after: 200 },
      })
    );
  } else {
    for (let i = 0; i < negotiationPriorities.length; i++) {
      section4Children.push(
        new Paragraph({
          numbering: { reference: "negotiation-priorities", level: 0 },
          children: [
            new TextRun({ text: negotiationPriorities[i], size: 20, font: "Calibri" }),
          ],
          spacing: { after: 80 },
        })
      );
    }
  }

  // -- Footer --
  const footerChildren: Paragraph[] = [
    new Paragraph({
      spacing: { before: 400 },
      children: [
        new TextRun({
          text: "Generated by MaxxBot Contract Analysis",
          italics: true,
          color: "999999",
          size: 16,
          font: "Calibri",
        }),
        new TextRun({
          text: `  |  ${today}`,
          italics: true,
          color: "999999",
          size: 16,
          font: "Calibri",
        }),
      ],
    }),
  ];

  // ============================================================
  // Assemble Document
  // ============================================================

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "negotiation-priorities",
          levels: [
            {
              level: 0,
              format: "decimal",
              text: "%1.",
              alignment: AlignmentType.START,
            },
          ],
        },
      ],
    },
    sections: [
      {
        children: [
          ...children,
          riskTable,
          ...section2Children,
          ...section3Children,
          ...section4Children,
          ...footerChildren,
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer);
}
