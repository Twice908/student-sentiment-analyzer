import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import SentimentChart from "@/components/dashboard/SentimentChart";
import StressChart from "@/components/dashboard/StressChart";
import TopicChart from "@/components/dashboard/TopicChart";
import AISummaryCard from "@/components/dashboard/AISummaryCard";
import { getFeedbackStats } from "@/lib/feedbackService";

const SENTIMENT_COLORS: Record<string, string> = {
  Positive: "#0D5C63",
  Neutral: "#2E9EA8",
  Negative: "#A8D8DC",
};

export default async function DashboardPage() {
  const stats = await getFeedbackStats();

  const sentimentData = Object.entries(stats.sentimentCounts).map(
    ([name, value]) => ({ name, value, color: SENTIMENT_COLORS[name] })
  );

  const stressData = Object.entries(stats.stressCounts).map(
    ([level, count]) => ({ level, count })
  );

  const topicData = Object.entries(stats.categoryCounts)
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);

  const topTopic = topicData[0]?.count > 0 ? topicData[0].topic : "—";

  const topStressLevel = (
    Object.entries(stats.stressCounts) as [string, number][]
  ).reduce((max, entry) => (entry[1] > max[1] ? entry : max))[0];

  const statCards = [
    { label: "Total Submissions", value: stats.total.toString() },
    {
      label: "Most Common Stress Level",
      value: stats.total > 0 ? topStressLevel : "—",
    },
    { label: "Most Common Topic", value: topTopic },
    { label: "New Today", value: stats.todayCount.toString() },
  ];

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      {/* Top nav (mobile) / Sidebar (desktop) */}
      <aside className="border-b border-[#0D5C63]/10 bg-[#FAFAF8] px-6 py-4 md:w-56 md:border-b-0 md:border-r md:px-4 md:py-8">
        <div className="flex items-center justify-between md:flex-col md:items-start md:gap-8">
          <Link href="/" className="text-lg font-bold text-[#0D5C63]">
            VoiceIt
          </Link>
          <nav className="flex gap-4 text-sm text-[#0D5C63]/70 md:flex-col md:gap-2">
            <span className="font-medium text-[#0D5C63]">Dashboard</span>
            <Link href="/feedback" className="hover:text-[#0D5C63]">
              Submit Feedback
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 px-6 py-8 sm:px-8">
        <h1 className="text-2xl font-bold text-[#0D5C63]">
          Teacher Dashboard
        </h1>
        <p className="mt-1 text-sm text-[#0D5C63]/60">
          Anonymous, aggregated insights from student feedback.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {statCards.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <SentimentChart data={sentimentData} />
          <StressChart data={stressData} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <TopicChart data={topicData} />
          <AISummaryCard />
        </div>
      </main>
    </div>
  );
}
