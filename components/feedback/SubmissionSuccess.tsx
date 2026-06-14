import { AnalysisResult } from "@/lib/types";

interface SubmissionSuccessProps {
  analysis: AnalysisResult;
  onReset: () => void;
}

export default function SubmissionSuccess({
  analysis,
  onReset,
}: SubmissionSuccessProps) {
  return (
    <div className="rounded-2xl bg-[#FAFAF8] p-8 text-center shadow-md">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0D5C63]/10 text-3xl text-[#0D5C63]">
        ✓
      </div>
      <h2 className="mt-4 text-xl font-semibold text-[#0D5C63]">
        Thank you for sharing. Your feedback has been received.
      </h2>

      <div className="mt-8 rounded-2xl bg-[#E8E4F0]/60 p-6 text-left">
        <h3 className="mb-4 text-sm font-semibold tracking-wide text-[#0D5C63]/70 uppercase">
          AI Analysis (preview)
        </h3>
        <dl className="space-y-4">
          <div className="flex items-center justify-between">
            <dt className="text-sm text-[#0D5C63]/80">Sentiment</dt>
            <dd className="rounded-full bg-[#0D5C63] px-3 py-1 text-xs font-medium text-white">
              {analysis.sentiment}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-sm text-[#0D5C63]/80">Stress Level</dt>
            <dd className="rounded-full bg-[#F59E0B] px-3 py-1 text-xs font-medium text-white">
              {analysis.stressLevel}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-sm text-[#0D5C63]/80">Category</dt>
            <dd className="rounded-full bg-[#A8D8DC] px-3 py-1 text-xs font-medium text-[#0D5C63]">
              {analysis.category}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-[#0D5C63]/80">Summary</dt>
            <dd className="mt-1 text-sm text-[#0D5C63]">
              {analysis.summary}
            </dd>
          </div>
        </dl>
      </div>

      <button
        onClick={onReset}
        className="mt-8 rounded-full bg-[#0D5C63] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#0D5C63]/90"
      >
        Submit another
      </button>
    </div>
  );
}
