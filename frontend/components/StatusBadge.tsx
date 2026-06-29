export default function StatusBadge({
  status,
}: {
  status: "pending" | "confirmed" | "rejected";
}) {
  const styles = {
    pending:   "bg-[#2a1a0c] text-[#f5a623] border border-[#f5a623]/20",
    confirmed: "bg-[#0c1a0c] text-[#4ade80] border border-[#4ade80]/20",
    rejected:  "bg-[#1a0c0c] text-[#f87171] border border-[#f87171]/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}
