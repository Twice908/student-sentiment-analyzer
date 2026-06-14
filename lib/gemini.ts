import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult, Category, FeedbackEntry, Sentiment, StressLevel } from "./types";

const FALLBACK_RESULT: AnalysisResult = {
  sentiment: "Neutral",
  stressLevel: "Low",
  category: "General Feedback",
  summary: "Unable to analyze at this time.",
};

const FALLBACK_SUMMARY = "Unable to generate a summary at this time.";

const SENTIMENTS: Sentiment[] = ["Positive", "Neutral", "Negative"];
const STRESS_LEVELS: StressLevel[] = ["Low", "Moderate", "High"];
const CATEGORIES: Category[] = [
  "Exams",
  "Assignments",
  "Teaching Quality",
  "Bullying",
  "Mental Well-Being",
  "Facilities",
  "Career Concerns",
  "Time Management",
  "General Feedback",
];

function isAnalysisResult(value: unknown): value is AnalysisResult {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.sentiment === "string" &&
    SENTIMENTS.includes(candidate.sentiment as Sentiment) &&
    typeof candidate.stressLevel === "string" &&
    STRESS_LEVELS.includes(candidate.stressLevel as StressLevel) &&
    typeof candidate.category === "string" &&
    CATEGORIES.includes(candidate.category as Category) &&
    typeof candidate.summary === "string"
  );
}

function buildPrompt(message: string): string {
  return `You are an educational sentiment analyzer. Analyze the student message below.
Return ONLY a valid JSON object with no extra text, no markdown, no backticks.

Message: "${message}"

Response format:
{
  "sentiment": "Positive" | "Neutral" | "Negative",
  "stressLevel": "Low" | "Moderate" | "High",
  "category": "Exams" | "Assignments" | "Teaching Quality" | "Bullying" | "Mental Well-Being" | "Facilities" | "Career Concerns" | "Time Management" | "General Feedback",
  "summary": "<one sentence describing the student concern>"
}`;
}

export async function analyzeMessage(message: string): Promise<AnalysisResult> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set.");
    }

    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(buildPrompt(message));
    const rawText = result.response.text().trim();
    const jsonText = rawText
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();

    const parsed: unknown = JSON.parse(jsonText);

    if (!isAnalysisResult(parsed)) {
      return FALLBACK_RESULT;
    }

    return parsed;
  } catch {
    return FALLBACK_RESULT;
  }
}

function buildSummaryPrompt(entries: FeedbackEntry[]): string {
  const entryLines = entries
    .map(
      (entry) =>
        `- [${entry.category} | ${entry.stressLevel} stress] ${entry.message}`
    )
    .join("\n");

  return `You are an educational sentiment analyzer. Below is a list of anonymous student feedback entries, each with its category and stress level.

${entryLines}

Summarize the common themes, stress patterns, and any recommendations for teachers in 3-4 sentences. Return ONLY the summary text, with no markdown, no backticks, and no extra commentary.`;
}

export async function generateDashboardSummary(
  entries: FeedbackEntry[]
): Promise<string> {
  try {
    if (entries.length === 0) {
      return "No feedback has been submitted yet.";
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set.");
    }

    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(buildSummaryPrompt(entries));
    const summary = result.response.text().trim();

    if (!summary) {
      return FALLBACK_SUMMARY;
    }

    return summary;
  } catch {
    return FALLBACK_SUMMARY;
  }
}
