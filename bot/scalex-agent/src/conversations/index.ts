import { Conversation, z, Autonomous, Reference } from "@botpress/runtime";
import queryTableTool from "../tools/queryTableTool";
import narrativeAdvisoryContext from "../knowledge";
import { processFileMessage } from "../utils/file-upload";
import { createQueryClausesTool, createSummarizeClausesTool } from "../tools/clauseTools";
import ExtractClausesWorkflow from "../workflows/extractClauses";
import { createExtractionProgressComponent } from "../utils/progress-component";
import messageFeedbackTable from "../tables/messageFeedbackTable";
import sessionSurveyTable from "../tables/sessionSurveyTable";
import usageTrackingTable from "../tables/usageTrackingTable";
import conversationalFeedbackTable from "../tables/conversationalFeedbackTable";
import { createGenerateReportTool } from "../tools/reportTool";

const customPrompt = `You are MaxxBot, a professional, data-driven procurement intelligence assistant.

You answer using ONLY:

1. the configured knowledge-base tables accessed via queryTableTool, and
2. the attached RAG knowledge base markdown files (narrative/advisory KBs).

Never invent data, prices, vendors, capabilities, contract terms, or compliance requirements.
If required data is missing, say so clearly and ask for the minimum clarification needed.

========================
AVAILABLE SOURCES (v3)
========================

A) STRUCTURED TABLES (query via queryTableTool)

* base_rates
  Hourly rate benchmarks by service, role/tier, and location. Filter on Frontline_Agent_Type + Location_Code + Tier. For staff aug use directly; for managed service multiply by TBL-017 load multiplier.

* towers
  Top-level service domains (HR, IT, Finance, etc.).

* categories
  Category taxonomy under each tower.

* service_types
  Canonical service definitions, pricing models, delivery channels. Note: SLA data has moved to the sla and service_type_sla tables. Frontline_Agent_Type is NULL for taxonomy-only towers (ENG, FR, MK, RC).

* service_aliases
  Maps user terms (e.g. "help desk", "call center") to standard Service_Type_IDs.

* service_vendor_map
  Which vendors provide which service types, including ranking tier.

* vendors
  Vendor profiles including strengths, weaknesses, and red flags.

* vendor_id_mapping
  Normalizes vendor names (e.g. "IBM" → canonical Vendor_ID).

* vendor_locations
  Vendor delivery locations.

* locations
  Location metadata (country, city, region, cost index, currency).

* modifiers
  Required and optional clarifying questions that affect pricing or scope.

* risk_rules
  Risk scoring rules and thresholds for vendor/spend analysis.

* treatment_recommendations
  Recommended actions for procurement findings.

* contract_benchmarks
  Contract term benchmarks and standard clauses.

* modifier_adjustments
  Pricing adjustment multipliers by modifier.

* taxonomy_crosswalks
  Maps external system codes to Maxx taxonomy.

* managed_service_load
  Service complexity load multipliers.

* sla
  SLA definitions (11 rows: timeliness & quality targets).

* service_type_sla
  Junction: maps each service type to its SLAs with target overrides (828 rows). Use this instead of TBL-004 SLA columns (removed in v3).

* base_rates_ext
  Extended rate data (per-unit rates, methodology, confidence scores). Join with base_rates on Rate_ID.

* service_types_ext
  Extended service type data (complexity tiers, volumes, AHT, Managed_Service_Load). Join with service_types on Service_Type_ID.

* vendors_ext
  Extended vendor data (Maxx tier, risk score, numeric financials). Join with vendors on vendorId.

B) RAG KNOWLEDGE BASE (markdown files)
Use for advisory/contextual guidance, definitions, checklists, templates, and frameworks:

* Commercial Intelligence (cost drivers, pricing model tradeoffs, labor arbitrage logic, negotiation levers)
* How Maxx Reasons & Responds (internal behavior guidance)
* Operational & Compliance Frameworks (GDPR/SOC2/HIPAA/PCI requirements, insurance requirements, risk framework, SOP/escalations, financial/payment frameworks)
* Procurement & Vendor Management Strategy (negotiation, evaluation, vendor management best practices, tools/checklists, glossary)
* RFP & Contract Templates (RFP structure, SOW guidance by tower, key provisions guide, current state documentation needs, transition/transform phases, Q&A pairs)

========================
NON-NEGOTIABLE RULES
========================

1. For ANY quantitative/structured question (rates, vendor lists, locations, mappings), ALWAYS use queryTableTool.
2. For "how-to / best practice / template / definition" questions, use the KB markdown content (RAG). Do not invent beyond it.
3. NEVER hallucinate numbers, rates, vendors, rankings, contract terms, or compliance requirements.
4. If multiple records match, present the best options and ask the user to choose.
5. If data is incomplete, explicitly state the limitation before proceeding.
6. Ask ONLY ONE clarifying question, and only if required to answer correctly.
7. Be concise, confident, and consultative.

========================
INTENT ROUTING
========================

A) Use TABLES when the user asks:

* "What's the rate for…"
* "Compare rates across countries/cities/tiers…"
* "Which vendors offer X…"
* "Does vendor Y operate in Z…"
* "What services exist under tower/category…"
* "What are the SLAs for service type X…" → use service_type_sla + sla tables (NOT service_types)
* "What's the blended/managed service rate for…" → use base_rates × managed_service_load (via service_types_ext)
* "What's the unblended/staff aug rate for…" → use base_rates directly
* "What risk rules apply to…" → use risk_rules table
* "What are the contract benchmarks for…" → use contract_benchmarks table
* "What treatment is recommended for…" → use treatment_recommendations table
* "What adjustment applies for modifier…" → use modifier_adjustments table
* "Map this external code to Maxx taxonomy…" → use taxonomy_crosswalks table
* "What is the managed service load for…" → use managed_service_load table

B) Use KB MARKDOWN when the user asks:

* "How should I structure an RFP / what should be included…"
* "What clauses / provisions / service credits are standard…"
* "What certifications / compliance requirements should I require…"
* "What insurance should I require from vendors…"
* "How do I assess vendor risk…"
* "How do I negotiate better rates / evaluate vendors / vendor management best practices…"
* "Define procurement/outsourcing terms…"

C) HYBRID ANSWERS (TABLES + KB)
When the user asks for both facts + rationale (e.g., "why is X cheaper?" or "how should I negotiate given these rates?"):

* Pull the numbers from tables (base_rates, locations, etc.)
* Use KB to explain cost drivers, pricing model tradeoffs, and negotiation levers
* Clearly separate "data from tables" vs "context/framework from KB"

========================
DELIVERY MODEL GATE (MANDATORY)
========================

Before answering ANY rate question, determine the delivery model:

A) STAFF AUGMENTATION (Time & Materials / Unblended)
   - Use TBL-003 rates DIRECTLY (Rate_Low_USD / Rate_Median_USD / Rate_High_USD)
   - Filter: Frontline_Agent_Type + Location_Code + Tier
   - Do NOT apply TBL-017 multiplier
   - Do NOT use local currency columns

B) MANAGED SERVICE (Blended)
   Blended Rate = Unblended Rate (TBL-003) × TBL-017.Multiplier_Median
   Where Load_Level = service_types_ext.Managed_Service_Load for the service type.

   TBL-017 multipliers:
   - Light: 1.20x
   - Standard: 1.45x
   - Premium: 1.65x

C) PRICE PER RESOURCE UNIT (PPU)
   Per-Unit Cost = Blended Hourly Rate × (AHT_minutes / 60)
   Monthly Cost = Per-Unit Cost × Volume
   Annual Contract Value = Monthly Cost × 12

If the user doesn't specify, ASK which model before quoting rates. Default assumption is staff augmentation if context suggests T&M engagement.

========================
SLA LOOKUP (v3 Pattern)
========================

SLA columns were REMOVED from service_types in v3. Use this pattern instead:

1. Query service_type_sla with filter {Service_Type_ID: "<id>"} to get SLA mappings
2. For each SLA_ID returned, query sla table to get SLA_Name, SLA_Type, Default_Target
3. If Target_Override exists in service_type_sla, use it instead of Default_Target

Each service type typically has ~2 SLAs (one timeliness, one quality).

========================
MODIFIER APPLICATION (8-Step Sequence)
========================

When applying modifiers to a base rate, follow this EXACT order:

Step 1: Start with base rate from TBL-003 (unblended)
Step 2: Location modifiers (LOC_PREMIUM, ONSHORE_PREMIUM, etc.) — MULTIPLICATIVE
Step 3: Specialization modifiers (CLINICAL_SPEC, AI_ML_SPEC, etc.) — MULTIPLICATIVE
Step 4: Complexity adjustment — MULTIPLICATIVE
Step 5: Regulatory (GDPR, HIPAA, PCI_DSS, etc.) — ADDITIVE
Step 6: Volume/term + Quality/SLA — ADDITIVE
Step 7: Automation (AUTOMATION_DISC, TOOL_PROVISION) — ADDITIVE
Step 8: Contract structure (TRANSITION_PREMIUM, GOVERNANCE_OVERHEAD) — ADDITIVE

Steps 2-4 MULTIPLY the running total. Steps 5-8 ADD to the post-Step-4 result.
For PERCENTAGE type with MULTIPLICATIVE application: multiplier = 1 + (Adjustment_Pct / 100)

Query modifier_adjustments for the specific multiplier values.
Query modifiers for required vs optional modifier questions per service type.

========================
RISK ASSESSMENT & TREATMENT
========================

When user provides spend data, contract details, or asks about risk:

1. RISK SCORING (TBL-012):
   - Extract from user: spend_amount, contract_age_years, vendor_count, concentration_pct
   - Evaluate each risk_rules row: extracted_value [Operator] Threshold_Value
   - If condition fires, include Rule_Name, Description, Mitigation_Text
   - Sort by Severity_Weight (highest first)

2. TREATMENT RECOMMENDATIONS (TBL-013):
   - Evaluate Condition_Metric against user data
   - Calculate savings: Spend × (Savings_Rate_Low_Pct / 100) to Spend × (Savings_Rate_High_Pct / 100)
   - Present prioritized action list

3. LOCKED SAVINGS VALUES (do NOT modify):
   - Negotiation: 8-15% (competitive RFP, benchmarking, renegotiation)
   - Contract Optimization: 5% (terms, clauses, payment terms, SLAs)
   - MIMO (Invoice Management): 3% (pre-payment invoice validation)
   - VMO (Vendor Management): 2% (QBRs, SLA enforcement, governance)
   - Total addressable: 20-26% compound

   Compound formula:
   Future Spend = Baseline × (1 - Negotiation) × (1 - Contract) × (1 - MIMO) × (1 - VMO)
   Example: $1M → ~$205K savings (20.5% compound, NOT 23% additive)

4. GAP TO BENCHMARK:
   Gap_pct = (Current_Rate - Rate_Median_USD) / Rate_Median_USD × 100
   Display as "X% above/below median"

========================
TOWER COVERAGE STATUS
========================

Towers WITH rates (full rate lookup path via service_aliases → service_types → base_rates):
  AI, CO, COP, FA, HR, IT, SC

Towers with taxonomy but NO rates (Frontline_Agent_Type = NULL, no TBL-003 rows):
  ENG, FR, MK, RC
  → For these, you can describe services, vendors, and SLAs but CANNOT quote rates.
  → Say: "Rate benchmarks are not yet available for [tower]. I can provide service taxonomy, vendor coverage, and SLA information."

Retired towers (legacy rows may exist in TBL-003 but no TBL-004 path):
  PS, CL, ME, EN, MO — folded into other towers

=============================
STANDARD TABLE REASONING FLOW
=============================

1. Identify intent

   * Rate benchmarking
   * Vendor intelligence
   * Service taxonomy / SLAs / pricing models
   * Vendor footprint by location

2. Normalize terminology

   * For services: query service_aliases using the user phrase.
   * For vendors: query vendor_id_mapping or vendors to resolve canonical Vendor_ID.
   * For locations: query locations using city/country/region terms.

3. Retrieve canonical records

   * service_aliases → service_types
   * service_types → categories → towers (only if context is useful)
   * service_types → service_vendor_map → vendors
   * vendors → vendor_locations → locations
   * service_types + locations + tier → base_rates

4. Check modifiers

   * After identifying Service_Type_ID, query modifiers.
   * Ask REQUIRED modifiers first, in priority order.
   * If modifiers are missing, caveat pricing confidence.

5. Respond clearly

   * Direct answer first.
   * Then list:

     * Sources used (tables and/or KB)
     * Key assumptions
     * Confidence level (HIGH / MEDIUM / LOW)

========================
KB (RAG) ANSWERING RULES
========================

* Use KB markdown for frameworks/templates/checklists/definitions.
* Quote or paraphrase faithfully; do not add "standard practice" claims unless supported by the KB content.
* If the KB provides a framework (e.g., risk domains), present it as a framework, not as a computed score.
* If the user asks for an output (e.g., "draft RFP outline"), produce a structured template based on KB guidance.

========================
RATE BENCHMARKING RULES
========================

* Determine delivery model FIRST (staff aug vs managed service)
* Filter base_rates on: Frontline_Agent_Type + Location_Code + Tier
* Always return: Low / Median / High in USD
* For managed service: multiply by TBL-017 load multiplier
* For per-unit pricing: multiply blended rate by (AHT_minutes / 60)
* If exact match missing: use closest proxy and explain assumption
* NEVER return point estimates — always return ranges (low/median/high)
* Use base_rates_ext for methodology confidence and source details when user asks about data quality

========================
TOP VENDOR LOGIC
========================

* When asked for "top" or "best" vendors:

  * Query service_vendor_map with limit ≥ 20.
  * Rank by Ranking_Tier (1 = best).
  * Present the top 3–5 with short rationale pulled from vendors table fields.
* Never claim endorsement — state this is based on available ranking data.

========================
WHAT v3 DOES NOT DO
========================

Do NOT claim the following capabilities unless explicit data/tables exist:

* Automated contract redlining (future scripted workflow)
* Real-time market rate feeds (static benchmark data only)
* Savings calculations with custom modifier stacking (8-step sequence is guidance, not auto-computed)
* Certifications a vendor has unless present in vendors table or KB
* Rate quotes for taxonomy-only towers (ENG, FR, MK, RC)
* TBL-004 SLA columns — use sla + service_type_sla tables instead

Note: Contract analysis is available. Users can upload contract documents (PDF/DOCX) for clause extraction, risk assessment, and benchmark comparison. Use the contract analysis tools when a user uploads a document.

========================
RESPONSE FORMAT
========================

1. Answer (1–3 sentences)
2. Supporting detail (bulleted or short table)
3. Sources used

   * Tables queried (which ones)
   * KB consulted (which KB topic area, if used)
4. Assumptions / limitations (if any)
5. One clarifying question only if required

========================
TONE
========================

Professional. Analytical. Calm.
Sound like a procurement advisor, not a chatbot.
`;

/**
 * Contract analysis mode addendum - appended to instructions when files are uploaded
 */
const contractAnalysisAddendum = `

========================
CONTRACT ANALYSIS MODE
========================

The user has uploaded a contract document for analysis. You now have additional tools available:

**analyze_contract**: Start clause extraction and risk analysis on the uploaded document.
- You MUST ask which party the user represents (Party A = service provider/vendor, Party B = client/customer) BEFORE starting analysis
- Risk assessment is perspective-dependent: clauses favorable to the other party = higher risk
- The extraction runs as a background workflow with real-time progress updates

**query_extracted_clauses**: Search and filter extracted clauses after analysis completes.
- Filter by: clauseType, riskLevel, benchmarkDeviation (above_high/below_low/within_range), searchText
- Returns clause text, key points, risk level, and benchmark comparison data

**summarize_extracted_clauses**: Deep analysis of extracted clauses.
- Pass clauses from query_extracted_clauses for expert analysis
- Returns procurement-focused insights with clause citations

**check_extraction_status**: Check progress of the running extraction workflow.

**generate_contract_report**: Generate a Contract Review Summary Word document (DOCX) for a completed contract analysis.
- Pass the contractId from the extraction
- Returns a download link for the DOCX report
- Report includes: risk summary table, missing protections, recommended redlines, negotiation priorities

WORKFLOW:
1. User uploads contract → Ask which party they represent
2. Call analyze_contract with their party selection
3. Extraction runs automatically (progress shown via custom message)
4. Once complete, use query/summarize tools to answer questions about the clauses
5. Highlight benchmark deviations and provide negotiation recommendations
6. When the user asks for a report/summary document, use generate_contract_report to create a downloadable DOCX

You can still use queryTableTool and KB for general procurement questions alongside contract analysis.

Cross-reference extracted clause terms against contract_benchmarks table (TBL-014) for industry standard comparison.
Use the locked savings values (Negotiation 8-15%, Contract Optimization 5%, MIMO 3%, VMO 2%) when recommending potential savings from contract optimization findings.
`;

/**
 * Summarize tool output for logging without flooding console with full clause text
 */
function summarizeToolOutput(toolName: string, output: any): string {
  try {
    if (!output) return JSON.stringify({ result: null });

    switch (toolName) {
      case "queryTableTool": {
        const count = output.results?.length ?? output.count ?? "?";
        return JSON.stringify({ results: count, query_type: output.query_type ?? "unknown" });
      }
      case "query_extracted_clauses": {
        const clauses = Array.isArray(output.clauses) ? output.clauses : [];
        const types = [...new Set(clauses.map((c: any) => c.clauseType).filter(Boolean))];
        return JSON.stringify({ count: clauses.length, types });
      }
      case "summarize_extracted_clauses": {
        const answerLen = typeof output.answer === "string" ? output.answer.length : 0;
        const citedIds = Array.isArray(output.citedClauses)
          ? output.citedClauses.map((c: any) => c.id).filter(Boolean)
          : [];
        return JSON.stringify({ answerLength: answerLen, citedClauseIds: citedIds });
      }
      case "analyze_contract": {
        return JSON.stringify({ success: output.success ?? false });
      }
      case "check_extraction_status": {
        return JSON.stringify({ status: output.status, progress: output.progress });
      }
      default: {
        // Log key names and array lengths for unknown tools
        const summary: Record<string, any> = {};
        for (const [key, value] of Object.entries(output)) {
          summary[key] = Array.isArray(value) ? `[${value.length} items]` : typeof value;
        }
        return JSON.stringify(summary);
      }
    }
  } catch {
    return "[summarize error]";
  }
}

export default new Conversation({
  channel: "*",
  state: z.object({
    messageId: z.string().optional(),
    extraction: Reference.Workflow("extract_clauses").optional(),
    userParty: z.enum(["party_a", "party_b"]).optional(),
    uploadedFiles: z
      .array(
        z.object({
          fileId: z.string(),
          fileName: z.string(),
          source: z.enum(["files-api", "webchat-reupload"]),
          uploadedAt: z.string(),
        })
      )
      .default([]),
    exchangeCount: z.number().default(0),
    perceptionAsked: z.boolean().default(false),
  }),
  handler: async ({ execute, message, conversation, state, client }) => {
    // Get userId - webchat provides via tag, fallback to conversation.id
    const userId =
      (conversation.tags?.["webchat:userId"] as string) || conversation.id;

    // Initialize uploadedFiles array if not present
    if (!state.uploadedFiles) {
      state.uploadedFiles = [];
    }

    console.debug("[CONVERSATION] Handler invoked", {
      userId,
      messageType: message?.type,
      hasExtraction: !!state.extraction,
      uploadedFilesCount: state.uploadedFiles.length,
    });

    // ---- Analytics message interceptors ----
    // Intercept __FEEDBACK__ and __SURVEY__ prefix messages from frontend
    if (message?.type === "text") {
      const text = (message as any).payload?.text ?? (message as any).text ?? "";

      if (text.startsWith("__FEEDBACK__:")) {
        try {
          const data = JSON.parse(text.slice("__FEEDBACK__:".length));
          await messageFeedbackTable.createRows({
            rows: [
              {
                userId,
                conversationId: conversation.id,
                messageId: data.messageId ?? "",
                rating: data.rating ?? 0,
                comment: data.comment,
                messagePreview: data.messagePreview,
                timestamp: new Date().toISOString(),
              },
            ],
          });
          console.info("[ANALYTICS] Feedback recorded", { messageId: data.messageId, rating: data.rating });
        } catch (error) {
          console.error("[ANALYTICS] Failed to parse feedback:", error);
        }
        return;
      }

      if (text.startsWith("__SURVEY__:")) {
        try {
          const data = JSON.parse(text.slice("__SURVEY__:".length));
          await sessionSurveyTable.createRows({
            rows: [
              {
                userId,
                conversationId: conversation.id,
                overallRating: data.overallRating ?? 0,
                bestFeature: data.bestFeature,
                improvementSuggestion: data.improvementSuggestion,
                expectedCapabilities: data.expectedCapabilities,
                wouldRecommend: data.wouldRecommend,
                timestamp: new Date().toISOString(),
              },
            ],
          });
          console.info("[ANALYTICS] Survey recorded", { overallRating: data.overallRating });
        } catch (error) {
          console.error("[ANALYTICS] Failed to parse survey:", error);
        }
        return;
      }
    }

    // ---- Increment exchange counter ----
    state.exchangeCount = (state.exchangeCount ?? 0) + 1;

    // Handle file uploads - add to array (persists across workflow failures)
    if (message?.type === "file" || message?.type === "bloc") {
      try {
        const processed = await processFileMessage(client, message);
        if (processed) {
          state.uploadedFiles.push({
            ...processed,
            uploadedAt: new Date().toISOString(),
          });
          console.info("[FILE] Added to uploadedFiles array:", {
            fileId: processed.fileId,
            fileName: processed.fileName,
            totalFiles: state.uploadedFiles.length,
          });
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error("[FILE] Processing failed:", { error: errorMsg });

        await conversation.send({
          type: "text",
          payload: {
            text: `I couldn't process your file upload. ${errorMsg.includes("unsupported") ? "Please try a PDF or text document." : "Please try again."}`,
          },
        });
      }
    }

    // Get the most recent uploaded file
    const latestFile = state.uploadedFiles.at(-1);
    const hasUploadedFiles = state.uploadedFiles.length > 0;

    // ---- Define clause extraction tools ----

    // Tool: Analyze Contract
    const analyzeContractTool = new Autonomous.Tool({
      name: "analyze_contract",
      description:
        "Start analyzing the uploaded contract document to extract and assess all contractual clauses with benchmark comparison. You MUST ask the user which party they represent before calling this tool.",
      input: z.object({
        userParty: z
          .enum(["party_a", "party_b"])
          .describe("Which party the user represents: party_a (service provider/vendor) or party_b (client/customer). REQUIRED - ask the user first."),
        documentName: z
          .string()
          .optional()
          .describe("Optional custom name for the document (defaults to uploaded file name)"),
      }),
      output: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
      handler: async ({ userParty, documentName }) => {
        if (!latestFile) {
          return {
            success: false,
            message: "No file has been uploaded. Please upload a contract document first.",
          };
        }

        const fileId = latestFile.fileId;
        const finalDocName = documentName || latestFile.fileName;

        // Store party selection in state
        state.userParty = userParty;

        console.debug("[TOOL] analyze_contract called", {
          fileId,
          documentName: finalDocName,
          userParty,
        });

        // Create initial progress message
        const progressMsg = await createExtractionProgressComponent({
          progress: 0,
          status: "in_progress",
          topic: finalDocName,
          clausesFound: 0,
          sources: [{ fileId, fileName: finalDocName }],
          activities: [],
        });

        console.debug("[TOOL] Created progress message:", progressMsg.id);

        // Start the extraction workflow
        const workflowInstance = await ExtractClausesWorkflow.start({
          conversationId: conversation.id,
          userId,
          messageId: progressMsg.id,
          fileId,
          documentName: finalDocName,
          userParty,
        });

        console.info("[TOOL] Started workflow:", workflowInstance.id);

        // Store workflow reference and message ID in state
        state.extraction = workflowInstance;
        state.messageId = progressMsg.id;

        const partyLabel = userParty === "party_a" ? "Party A (service provider)" : "Party B (client)";
        return {
          success: true,
          message: `Started extracting clauses from ${finalDocName}. Risk will be assessed from your perspective as ${partyLabel}. Clauses will be compared against procurement industry benchmarks. I'll update you as I progress through the document.`,
        };
      },
    });

    // Tool: Query Extracted Clauses
    const queryClausesTool = createQueryClausesTool(client, userId);

    // Tool: Summarize Extracted Clauses
    const summarizeClausesTool = createSummarizeClausesTool();

    // Tool: Check Extraction Status
    const checkStatusTool = new Autonomous.Tool({
      name: "check_extraction_status",
      description: "Check the status of the current contract extraction workflow",
      input: z.object({}),
      output: z.object({
        status: z.string(),
        progress: z.string(),
      }),
      handler: async () => {
        if (!state.extraction) {
          return {
            status: "No extraction in progress",
            progress: "0%",
          };
        }

        const status = state.extraction.status;
        let progress = "Unknown";

        if (status === "completed" && state.extraction.output) {
          progress = `100% - Found ${state.extraction.output.clauseCount} clauses`;
        } else if (status === "running") {
          progress = "In progress...";
        } else if (status === "failed") {
          progress = "Failed";
        }

        return {
          status,
          progress,
        };
      },
    });

    // ---- Conversational feedback tool (Phase 2c) ----
    const logUserPerceptionTool = new Autonomous.Tool({
      name: "log_user_perception",
      description:
        "Log a user's perception or feedback about MaxxBot's capabilities. Call this after the user responds to a perception question you asked (e.g., 'Was this what you were looking for?').",
      input: z.object({
        questionAsked: z.string().describe("The perception question the bot asked"),
        userResponse: z.string().describe("The user's response to the question"),
        responseCategory: z
          .string()
          .optional()
          .describe("Category: 'satisfied' | 'unsatisfied' | 'feature_request' | 'capability_gap' | 'other'"),
      }),
      output: z.object({
        success: z.boolean(),
      }),
      handler: async ({ questionAsked, userResponse, responseCategory }) => {
        try {
          await conversationalFeedbackTable.createRows({
            rows: [
              {
                userId,
                conversationId: conversation.id,
                questionAsked,
                userResponse,
                responseCategory,
                timestamp: new Date().toISOString(),
              },
            ],
          });
          state.perceptionAsked = true;
          console.info("[ANALYTICS] Perception logged", { questionAsked, responseCategory });
          return { success: true };
        } catch (error) {
          console.error("[ANALYTICS] Failed to log perception:", error);
          return { success: false };
        }
      },
    });

    // ---- Build report tool ----
    const generateReportTool = createGenerateReportTool(client, userId);

    // ---- Build dynamic tools array ----
    const tools = (() => {
      // Always include queryTableTool and perception tool
      const baseTools: any[] = [queryTableTool, logUserPerceptionTool];

      if (hasUploadedFiles || state.extraction) {
        // Add clause tools when files are uploaded or extraction exists
        baseTools.push(queryClausesTool, summarizeClausesTool, checkStatusTool, generateReportTool);

        if (!state.extraction || state.extraction.status !== "running") {
          // Allow starting new extraction when none is running
          baseTools.push(analyzeContractTool);
        }
      }

      return baseTools;
    })();

    // ---- Build dynamic instructions ----
    let instructions = customPrompt;

    if (hasUploadedFiles) {
      instructions += contractAnalysisAddendum;

      if (latestFile && !state.userParty) {
        instructions += `
IMPORTANT: The user has uploaded a contract file: "${latestFile.fileName}"
Before starting analysis, you MUST ask: "Which party do you represent in this contract? Are you Party A (the service provider/vendor) or Party B (the client/customer)?"
Once they answer, call analyze_contract with their party selection.`;
      } else if (latestFile && state.userParty) {
        const partyLabel = state.userParty === "party_a" ? "Party A (service provider)" : "Party B (client)";
        instructions += `
The user has uploaded "${latestFile.fileName}" and identified as ${partyLabel}.`;

        if (!state.extraction) {
          instructions += ` You can now call analyze_contract to start extraction.`;
        } else if (state.extraction.status === "completed") {
          instructions += ` Extraction is complete. Use query_extracted_clauses and summarize_extracted_clauses to answer questions about the contract.`;
        } else if (state.extraction.status === "running") {
          instructions += ` Extraction is currently running. You can check progress with check_extraction_status.`;
        }
      }
    }

    // ---- Conversational analytics prompt additions (Phase 2d) ----
    const exchangeCount = state.exchangeCount ?? 0;
    const perceptionAsked = state.perceptionAsked ?? false;

    instructions += `

========================
USER PERCEPTION TRACKING
========================

CURRENT SESSION STATE: This is exchange #${exchangeCount}. Perception question already asked this session: ${perceptionAsked ? "YES" : "NO"}.

You have a tool called log_user_perception. You MUST use it to understand what users think MaxxBot does and should do.

MANDATORY PERCEPTION QUESTIONS — follow these triggers exactly:

${!perceptionAsked && exchangeCount >= 2 ? `** ACTION REQUIRED NOW **: This is exchange #${exchangeCount} and no perception question has been asked yet. At the END of your substantive response, add on a new line: "By the way — was this the kind of information you were looking for?"` : ""}
${exchangeCount >= 6 ? `** CONSIDER ASKING **: After 5+ exchanges, if you haven't recently asked: "Is there something you hoped I could help with that we haven't covered yet?"` : ""}

CLOSING LANGUAGE TRIGGER: If the user says "thanks", "that's all", "bye", "goodbye", or similar, you MUST ask: "Before you go — was there anything you expected me to be able to do that I couldn't?"

When the user responds to ANY of these questions, IMMEDIATELY call log_user_perception with:
- questionAsked: the exact question you asked
- userResponse: the user's full response
- responseCategory: one of "satisfied", "unsatisfied", "feature_request", "capability_gap", or "other"

IMPORTANT: Keep perception questions brief. Append them to the end of your substantive answer — never replace your answer with a question. Do NOT ask more than one perception question per exchange.
`;

    // Execute autonomous loop
    await execute({
      instructions,
      tools,
      knowledge: [narrativeAdvisoryContext],
      hooks: {
        onBeforeTool: async ({ tool, input }) => {
          console.info(`[TOOL-CALL] >>> ${tool.name}`, JSON.stringify(input, null, 2));
        },
        onAfterTool: async ({ tool, input, output }) => {
          const summary = summarizeToolOutput(tool.name, output);
          console.info(`[TOOL-CALL] <<< ${tool.name}`, summary);

          // Fire-and-forget usage tracking
          if (tool.name !== "log_user_perception") {
            usageTrackingTable.createRows({
              rows: [
                {
                  userId,
                  conversationId: conversation.id,
                  eventType: "tool_call",
                  toolName: tool.name,
                  queryType: (input as any)?.query_type,
                  metadata: JSON.stringify({ hasOutput: !!output }),
                  timestamp: new Date().toISOString(),
                },
              ],
            }).catch((err) => console.error("[ANALYTICS] Usage tracking failed:", err));
          }
        },
      },
    });
  },
});
