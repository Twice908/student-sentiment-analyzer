"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TopicChartProps {
  data: { topic: string; count: number }[];
}

export default function TopicChart({ data }: TopicChartProps) {
  return (
    <div className="rounded-2xl bg-[#FAFAF8] p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-[#0D5C63]">Top Topics</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#0D5C6320" />
          <XAxis type="number" stroke="#0D5C63" fontSize={12} />
          <YAxis
            type="category"
            dataKey="topic"
            stroke="#0D5C63"
            fontSize={12}
            width={120}
          />
          <Tooltip />
          <Bar dataKey="count" fill="#0D5C63" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
