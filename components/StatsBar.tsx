import { Expense } from "@/app/dashboard/page";
import { CATEGORY_COLORS } from "@/lib/constants";

interface Props { expenses: Expense[] }

export default function StatsBar({ expenses }: Props) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const sorted = [...expenses].sort((a, b) => b.amount - a.amount);
  const largest = sorted[0];
  const recurring = expenses.filter(e => e.recurrence && e.recurrence !== "none").length;

  const topCategory = Object.entries(
    expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1])[0];

  const stats = [
    { label: "TOTAL SPENT", value: `$${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: `${expenses.length} transaction${expenses.length !== 1 ? "s" : ""}`, accent: "#D4A853" },
    { label: "LARGEST EXPENSE", value: largest ? `$${largest.amount.toFixed(2)}` : "—", sub: largest?.title || "No data", accent: "#C17FC7" },
    { label: "TOP CATEGORY", value: topCategory ? topCategory[0].split(" ")[0] : "—", sub: topCategory ? `$${topCategory[1].toFixed(2)} spent` : "No data", accent: CATEGORY_COLORS[topCategory?.[0]] || "#6B9ED4" },
    { label: "RECURRING", value: String(recurring), sub: `active subscription${recurring !== 1 ? "s" : ""}`, accent: "#6BC9A0" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
      {stats.map(({ label, value, sub, accent }) => (
        <div key={label} style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16, padding: "20px 22px", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${accent}88,transparent)` }} />
          <div style={{ fontSize: 9, color: accent, letterSpacing: "0.14em", fontWeight: 600, marginBottom: 10 }}>{label}</div>
          <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 26, color: "#f0e8d8", lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: 11, color: "#555", marginTop: 5 }}>{sub}</div>
        </div>
      ))}
    </div>
  );
}
