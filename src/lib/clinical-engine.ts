export type TriageLevel = "mild" | "urgent" | "critical";

export type TriageResult = {
  level: TriageLevel;
  riskScore: number;
  confidence: number;
  nextAction: "self_care" | "book_same_day" | "dispatch_emergency";
  redFlags: string[];
};

const criticalFlags = ["facial droop", "slurred speech", "arm weakness", "chest pain", "severe breathing difficulty", "unconscious"];

/** Deterministic safety net. An LLM may gather facts, never decide the final level. */
export function determineTriage(text: string, painScale = 0): TriageResult {
  const normalized = text.toLowerCase();
  const redFlags = criticalFlags.filter((flag) => normalized.includes(flag));
  if (redFlags.length > 0) return { level: "critical", riskScore: 98, confidence: 0.981, nextAction: "dispatch_emergency", redFlags };
  if (painScale >= 7 || normalized.includes("high fever") || normalized.includes("persistent vomiting")) return { level: "urgent", riskScore: 76, confidence: 0.917, nextAction: "book_same_day", redFlags: [] };
  return { level: "mild", riskScore: 24, confidence: 0.942, nextAction: "self_care", redFlags: [] };
}

export function redactPii(value: string) {
  return value.replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "[EMAIL_REDACTED]").replace(/\+?\d[\d\s().-]{7,}\d/g, "[PHONE_REDACTED]");
}
