"use client";

import { aiSummary } from "@/lib/mockData";

export default function AISummaryCard() {
  return (
    <div className="rounded-2xl bg-[#FAFAF8] p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#0D5C63]">AI-Generated Insight</h3>
        <button
          className="rounded-full bg-[#0D5C63]/10 px-4 py-1.5 text-xs font-medium text-[#0D5C63] transition hover:bg-[#0D5C63]/20"
          onClick={() => {}}
        >
          Regenerate Summary
        </button>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-[#0D5C63]/80">
        {aiSummary.text}
      </p>
      <p className="mt-4 text-xs text-[#0D5C63]/50">
        Generated on: {aiSummary.generatedAt}
      </p>
    </div>
  );
}
