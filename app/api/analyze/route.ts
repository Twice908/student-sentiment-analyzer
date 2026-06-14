import { NextRequest, NextResponse } from "next/server";
import { analyzeMessage } from "@/lib/gemini";

interface AnalyzeRequest {
  message: string;
}

function isAnalyzeRequest(body: unknown): body is AnalyzeRequest {
  if (typeof body !== "object" || body === null) return false;
  const candidate = body as Record<string, unknown>;
  return typeof candidate.message === "string";
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    if (!isAnalyzeRequest(body)) {
      return NextResponse.json(
        { success: false, error: "Invalid request payload." },
        { status: 400 }
      );
    }

    const result = await analyzeMessage(body.message);

    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to analyze message." },
      { status: 500 }
    );
  }
}
