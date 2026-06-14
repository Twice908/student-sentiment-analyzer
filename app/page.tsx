import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="px-6 pt-16 pb-10 text-center sm:pt-24">
        <h1 className="text-4xl font-bold tracking-tight text-[#0D5C63] sm:text-5xl">
          VoiceIt
        </h1>
        <p className="mt-3 text-lg text-[#0D5C63]/70">
          Your voice matters. Anonymously.
        </p>
      </header>

      <main className="flex-1 px-6 pb-16">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 sm:flex-row">
          <Link
            href="/feedback"
            className="flex-1 rounded-2xl bg-[#FAFAF8] p-8 shadow-md transition hover:shadow-lg"
          >
            <div className="text-3xl">💬</div>
            <h2 className="mt-4 text-xl font-semibold text-[#0D5C63]">
              Share Feedback
            </h2>
            <p className="mt-2 text-sm text-[#0D5C63]/70">
              Tell us how you&apos;re feeling — completely anonymous, no
              sign-in required.
            </p>
          </Link>

          <Link
            href="/dashboard"
            className="flex-1 rounded-2xl bg-[#FAFAF8] p-8 shadow-md transition hover:shadow-lg"
          >
            <div className="text-3xl">📊</div>
            <h2 className="mt-4 text-xl font-semibold text-[#0D5C63]">
              View Dashboard
            </h2>
            <p className="mt-2 text-sm text-[#0D5C63]/70">
              See aggregated, anonymous insights from your school community.
            </p>
          </Link>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#FAFAF8] p-6 text-center shadow-sm">
              <div className="text-2xl">🔒</div>
              <h3 className="mt-3 font-semibold text-[#0D5C63]">Anonymous</h3>
              <p className="mt-1 text-sm text-[#0D5C63]/70">
                No names, no accounts — just your honest voice.
              </p>
            </div>
            <div className="rounded-2xl bg-[#FAFAF8] p-6 text-center shadow-sm">
              <div className="text-2xl">✨</div>
              <h3 className="mt-3 font-semibold text-[#0D5C63]">
                AI-Analyzed
              </h3>
              <p className="mt-1 text-sm text-[#0D5C63]/70">
                Feedback is gently analyzed to spot trends and well-being
                signals.
              </p>
            </div>
            <div className="rounded-2xl bg-[#FAFAF8] p-6 text-center shadow-sm">
              <div className="text-2xl">🏫</div>
              <h3 className="mt-3 font-semibold text-[#0D5C63]">
                Helps Your School
              </h3>
              <p className="mt-1 text-sm text-[#0D5C63]/70">
                Trends help educators support student well-being proactively.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="px-6 py-8 text-center text-sm text-[#0D5C63]/60">
        No personal data is collected or stored.
      </footer>
    </div>
  );
}
