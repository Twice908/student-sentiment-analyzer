"use client";

import { useState } from "react";
import { AnalysisResult } from "@/lib/types";
import SubmissionSuccess from "./SubmissionSuccess";

const MAX_LENGTH = 1000;

type SubmitStage = "idle" | "analyzing" | "submitting";

export default function FeedbackForm() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [stage, setStage] = useState<SubmitStage>("idle");
  const [error, setError] = useState<string | null>(null);

  if (submitted && analysis) {
    return (
      <SubmissionSuccess
        analysis={analysis}
        onReset={() => {
          setSubmitted(false);
          setAnalysis(null);
          setTitle("");
          setMessage("");
          setError(null);
        }}
      />
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      setStage("analyzing");
      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!analyzeResponse.ok) {
        const data = await analyzeResponse.json();
        throw new Error(data.error || "Failed to analyze feedback");
      }

      const analyzeData = await analyzeResponse.json();
      const result: AnalysisResult = analyzeData.data;

      setStage("submitting");
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || undefined,
          message,
          sentiment: result.sentiment,
          stressLevel: result.stressLevel,
          category: result.category,
          summary: result.summary,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save feedback");
      }

      setAnalysis(result);
      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      console.error("Feedback submission error:", message);
    } finally {
      setStage("idle");
    }
  };

  const isLoading = stage !== "idle";
  const submitLabel =
    stage === "analyzing"
      ? "Analyzing your feedback…"
      : stage === "submitting"
      ? "Submitting..."
      : "Submit Anonymously";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-[#FAFAF8] p-8 shadow-md"
    >
      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-[#0D5C63]"
        >
          Title (optional)
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your message a title (optional)"
          className="w-full rounded-xl border border-[#0D5C63]/15 bg-white px-4 py-3 text-sm text-[#0D5C63] placeholder:text-[#0D5C63]/40 focus:border-[#0D5C63] focus:outline-none"
        />
      </div>

      <div className="mt-6">
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-[#0D5C63]"
        >
          Your message
        </label>
        <textarea
          id="message"
          rows={5}
          maxLength={MAX_LENGTH}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write anything on your mind — exams, stress, suggestions, or anything else. This is completely anonymous."
          className="w-full rounded-xl border border-[#0D5C63]/15 bg-white px-4 py-3 text-sm text-[#0D5C63] placeholder:text-[#0D5C63]/40 focus:border-[#0D5C63] focus:outline-none"
        />
        <div className="mt-2 text-right text-xs text-[#0D5C63]/50">
          {message.length} / {MAX_LENGTH}
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={message.trim().length === 0 || isLoading}
        className="mt-6 w-full rounded-full bg-[#0D5C63] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#0D5C63]/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitLabel}
      </button>
    </form>
  );
}
