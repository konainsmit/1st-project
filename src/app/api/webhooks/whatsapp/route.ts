import { NextResponse } from "next/server";
import { redactPii } from "@/lib/clinical-engine";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const message = typeof payload.Body === "string" ? redactPii(payload.Body) : "";
  return NextResponse.json({ accepted: true, channel: "whatsapp", sessionKey: payload.From ?? "anonymous", message, queued: true });
}
