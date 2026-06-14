import { NextRequest, NextResponse } from "next/server";
import { getAllFeedback, saveFeedback } from "@/lib/feedbackService";
import { FeedbackEntry } from "@/lib/types";

// type FeedbackSubmission = Omit<FeedbackEntry, "id" | "createdAt">;
type FeedbackSubmission = Omit<FeedbackEntry, "id" | "createdAt">;

function isFeedbackSubmission(body: unknown): body is FeedbackSubmission {
  if (typeof body !== "object" || body === null) return false;
  const candidate = body as Record<string, unknown>;
  return (
    typeof candidate.message === "string" &&
    typeof candidate.sentiment === "string" &&
    typeof candidate.stressLevel === "string" &&
    typeof candidate.category === "string" &&
    typeof candidate.summary === "string"
  );
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    if (!isFeedbackSubmission(body)) {
      return NextResponse.json(
        { success: false, error: "Invalid feedback payload." },
        { status: 400 }
      );
    }

    const entry: FeedbackSubmission = {
      message: body.message,
      sentiment: body.sentiment,
      stressLevel: body.stressLevel,
      category: body.category,
      summary: body.summary,
      ...(body.title ? { title: body.title } : {}),
    };

    const id = await saveFeedback(entry);

    return NextResponse.json({ success: true, data: { id } });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to save feedback." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const entries = await getAllFeedback();
    return NextResponse.json({ success: true, data: entries });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch feedback." },
      { status: 500 }
    );
  }
}
