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

interface StressChartProps {
  data: { level: string; count: number }[];
}

export default function StressChart({ data }: StressChartProps) {
  return (
    <div className="rounded-2xl bg-[#FAFAF8] p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-[#0D5C63]">Stress Levels</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#0D5C6320" />
          <XAxis dataKey="level" stroke="#0D5C63" fontSize={12} />
          <YAxis stroke="#0D5C63" fontSize={12} />
          <Tooltip />
          <Bar dataKey="count" fill="#2E9EA8" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
