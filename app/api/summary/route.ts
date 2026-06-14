import { NextResponse } from "next/server";
import { getAllFeedback } from "@/lib/feedbackService";
import { generateDashboardSummary } from "@/lib/gemini";

const MAX_ENTRIES = 50;

export async function GET() {
  try {
    const entries = await getAllFeedback();
    const summary = await generateDashboardSummary(
      entries.slice(0, MAX_ENTRIES)
    );

    return NextResponse.json({
      success: true,
      data: { summary, generatedAt: new Date().toISOString() },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to generate summary." },
      { status: 500 }
    );
  }
}
