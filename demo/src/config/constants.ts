export const BOT_CONFIG = {
  clientId: import.meta.env.VITE_BOT_CLIENT_ID || "",
  name: "MaxxBot",
  description: "AI Procurement Intelligence Assistant",
};

export const TIMING = {
  FOCUS_DELAY_MS: 100,
  PANEL_ANIMATION_MS: 300,
  CLIPBOARD_SUCCESS_MS: 2000,
} as const;

export const POLLING = {
  INTERVAL_MS: 1000,
  MAX_RECENT_ACTIVITIES: 5,
} as const;

export const CLIENT_ID = BOT_CONFIG.clientId;

export const CLAUSE_TYPE_LABELS: Record<string, string> = {
  // General legal
  payment_terms: "Payment Terms",
  liability_limitation: "Liability",
  indemnification: "Indemnification",
  termination: "Termination",
  confidentiality: "Confidentiality",
  force_majeure: "Force Majeure",
  warranties: "Warranties",
  governing_law: "Governing Law",
  dispute_resolution: "Dispute Resolution",
  intellectual_property: "IP Rights",
  assignment: "Assignment",
  amendment: "Amendment",
  // Procurement-specific
  sla_terms: "SLA Terms",
  pricing_terms: "Pricing Terms",
  volume_commitment: "Volume Commitment",
  data_protection: "Data Protection",
  transition_assistance: "Transition Assistance",
  governance: "Governance",
  rate_escalation: "Rate Escalation",
  auto_renewal: "Auto-Renewal",
  exclusivity: "Exclusivity",
  benchmarking_rights: "Benchmarking Rights",
  insurance_requirements: "Insurance",
  other: "Other",
};

export const RISK_COLORS = {
  low: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    badge: "bg-green-100 text-green-800",
  },
  medium: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    badge: "bg-yellow-100 text-yellow-800",
  },
  high: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    badge: "bg-red-100 text-red-800",
  },
};

export const BENCHMARK_COLORS = {
  above: {
    badge: "bg-red-100 text-red-800",
    label: "Above Benchmark",
  },
  below: {
    badge: "bg-yellow-100 text-yellow-800",
    label: "Below Benchmark",
  },
  within: {
    badge: "bg-green-100 text-green-800",
    label: "Within Range",
  },
};
