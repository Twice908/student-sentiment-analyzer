interface StatCardProps {
  label: string;
  value: string;
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-[#FAFAF8] p-6 shadow-sm">
      <p className="text-sm text-[#0D5C63]/60">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#0D5C63]">{value}</p>
    </div>
  );
}
