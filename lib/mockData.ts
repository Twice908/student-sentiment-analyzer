import { AnalysisResult } from "./types";

export const mockAnalysis: AnalysisResult = {
  sentiment: "Negative",
  stressLevel: "High",
  category: "Exams",
  summary: "Student is experiencing exam-related stress and anxiety.",
};

export const aiSummary = {
  text: "Most students are experiencing stress around examinations and heavy assignment workloads. A notable segment (19%) expressed concerns about mental well-being. Teaching pace and time management also emerged as recurring themes. It is recommended that educators consider reducing assignment load during exam periods.",
  generatedAt: "June 14, 2026",
};
