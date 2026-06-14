"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface SentimentChartProps {
  data: { name: string; value: number; color: string }[];
}

export default function SentimentChart({ data }: SentimentChartProps) {
  return (
    <div className="rounded-2xl bg-[#FAFAF8] p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-[#0D5C63]">Sentiment Breakdown</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={2}
            isAnimationActive={false}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
