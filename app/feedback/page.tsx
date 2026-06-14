import Link from "next/link";
import FeedbackForm from "@/components/feedback/FeedbackForm";

export default function FeedbackPage() {
  return (
    <div className="flex flex-1 flex-col px-6 py-12">
      <div className="mx-auto w-full max-w-xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-[#0D5C63]/70 hover:text-[#0D5C63]"
        >
          ← Back home
        </Link>
        <h1 className="mb-6 text-2xl font-bold text-[#0D5C63] sm:text-3xl">
          Share how you&apos;re feeling
        </h1>
        <FeedbackForm />
      </div>
    </div>
  );
}
