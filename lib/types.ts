export type Sentiment = "Positive" | "Neutral" | "Negative";
export type StressLevel = "Low" | "Moderate" | "High";
export type Category =
  | "Exams"
  | "Assignments"
  | "Teaching Quality"
  | "Bullying"
  | "Mental Well-Being"
  | "Facilities"
  | "Career Concerns"
  | "Time Management"
  | "General Feedback";

export interface FeedbackEntry {
  id: string;
  title?: string;
  message: string;
  sentiment: Sentiment;
  stressLevel: StressLevel;
  category: Category;
  summary: string;
  createdAt: Date;
}

export interface AnalysisResult {
  sentiment: Sentiment;
  stressLevel: StressLevel;
  category: Category;
  summary: string;
}

export interface DashboardStats {
  total: number;
  todayCount: number;
  sentimentCounts: Record<Sentiment, number>;
  stressCounts: Record<StressLevel, number>;
  categoryCounts: Record<Category, number>;
}
