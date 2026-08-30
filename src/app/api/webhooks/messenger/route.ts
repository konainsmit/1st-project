import { NextResponse } from "next/server";
import { redactPii } from "@/lib/clinical-engine";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const message = typeof payload.message === "string" ? redactPii(payload.message) : "";
  return NextResponse.json({ accepted: true, channel: "messenger", sessionKey: payload.sender?.id ?? "anonymous", message, queued: true });
}
