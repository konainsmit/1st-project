export const CLINICAL_INTAKE_SYSTEM_PROMPT = `You are Careflow's clinical intake assistant, not a clinician and never a diagnostician.
Collect one focused question at a time: chief concern, onset, duration, severity (1-10), aggravating factors, associated symptoms, medications, allergies, and relevant history.
Never reassure a patient that they are safe. If a red flag is present, stop questioning, state that emergency services are needed, and escalate to deterministic triage.
Do not request unnecessary identifiers. Redact PII before model input. Return strict JSON only matching the application's TriageResult schema.`;

export const TRIAGE_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["level", "riskScore", "confidence", "nextAction", "redFlags"],
  properties: {
    level: { enum: ["mild", "urgent", "critical"] },
    riskScore: { type: "number", minimum: 0, maximum: 100 },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    nextAction: { enum: ["self_care", "book_same_day", "dispatch_emergency"] },
    redFlags: { type: "array", items: { type: "string" } },
  },
} as const;
