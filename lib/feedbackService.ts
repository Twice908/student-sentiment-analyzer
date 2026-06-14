import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  Category,
  DashboardStats,
  FeedbackEntry,
  Sentiment,
  StressLevel,
} from "./types";

const FEEDBACK_COLLECTION = "feedback";

interface FeedbackDocument {
  title?: string;
  message: string;
  sentiment: Sentiment;
  stressLevel: StressLevel;
  category: Category;
  summary: string;
  createdAt: Timestamp;
}

export async function saveFeedback(
  entry: Omit<FeedbackEntry, "id" | "createdAt">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, FEEDBACK_COLLECTION), {
      ...entry,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to save feedback: ${message}`);
  }
}

export async function getAllFeedback(): Promise<FeedbackEntry[]> {
  try {
    const feedbackQuery = query(
      collection(db, FEEDBACK_COLLECTION),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(feedbackQuery);

    return snapshot.docs.map((doc) => {
      const data = doc.data() as FeedbackDocument;
      return {
        id: doc.id,
        title: data.title,
        message: data.message,
        sentiment: data.sentiment,
        stressLevel: data.stressLevel,
        category: data.category,
        summary: data.summary,
        createdAt: data.createdAt?.toDate() ?? new Date(),
      };
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to fetch feedback: ${message}`);
  }
}

export async function getFeedbackStats(): Promise<DashboardStats> {
  const entries = await getAllFeedback();

  const sentimentCounts: Record<Sentiment, number> = {
    Positive: 0,
    Neutral: 0,
    Negative: 0,
  };

  const stressCounts: Record<StressLevel, number> = {
    Low: 0,
    Moderate: 0,
    High: 0,
  };

  const categoryCounts: Record<Category, number> = {
    Exams: 0,
    Assignments: 0,
    "Teaching Quality": 0,
    Bullying: 0,
    "Mental Well-Being": 0,
    Facilities: 0,
    "Career Concerns": 0,
    "Time Management": 0,
    "General Feedback": 0,
  };

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  let todayCount = 0;

  for (const entry of entries) {
    sentimentCounts[entry.sentiment]++;
    stressCounts[entry.stressLevel]++;
    categoryCounts[entry.category]++;
    if (entry.createdAt >= startOfToday) {
      todayCount++;
    }
  }

  return {
    total: entries.length,
    todayCount,
    sentimentCounts,
    stressCounts,
    categoryCounts,
  };
}
