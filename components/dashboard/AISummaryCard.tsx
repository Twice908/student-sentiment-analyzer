"use client";

import { useEffect, useState } from "react";

interface SummaryData {
  summary: string;
  generatedAt: string;
}

type LoadState = "loading" | "ready" | "error";

export default function AISummaryCard() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [state, setState] = useState<LoadState>("loading");

  const loadSummary = async () => {
    try {
      const response = await fetch("/api/summary");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to load summary");
      }

      setData(result.data);
      setState("ready");
    } catch {
      setState("error");
    }
  };

  useEffect(() => {
    // Fetch-on-mount: setState calls inside loadSummary only run after the
    // fetch resolves, not synchronously during this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSummary();
  }, []);

  const handleRegenerate = () => {
    setState("loading");
    loadSummary();
  };

  const formattedDate = data
    ? new Date(data.generatedAt).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <div className="rounded-2xl bg-[#FAFAF8] p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#0D5C63]">AI-Generated Insight</h3>
        <button
          onClick={handleRegenerate}
          disabled={state === "loading"}
          className="rounded-full bg-[#0D5C63]/10 px-4 py-1.5 text-xs font-medium text-[#0D5C63] transition hover:bg-[#0D5C63]/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state === "loading" ? "Generating…" : "Regenerate Summary"}
        </button>
      </div>

      {state === "loading" && (
        <div className="mt-4 flex items-center gap-2 text-sm text-[#0D5C63]/60">
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-[#0D5C63]/20 border-t-[#0D5C63]"
            aria-hidden="true"
          />
          Generating summary…
        </div>
      )}

      {state === "error" && (
        <p className="mt-4 text-sm leading-relaxed text-[#0D5C63]/80">
          Unable to load the AI summary right now. Please try again.
        </p>
      )}

      {state === "ready" && data && (
        <>
          <p className="mt-4 text-sm leading-relaxed text-[#0D5C63]/80">
            {data.summary}
          </p>
          <p className="mt-4 text-xs text-[#0D5C63]/50">
            Generated on: {formattedDate}
          </p>
        </>
      )}
    </div>
  );
}
