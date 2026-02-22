import { Expense } from "@/app/dashboard/page";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  expenses: Expense[];
  onEdit: (e: Expense) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Food & Dining":"#D4A853","Transport":"#6B9ED4","Shopping":"#C17FC7",
  "Entertainment":"#E07070","Health":"#6BC9A0","Housing":"#70C4C4",
  "Utilities":"#D4A853","Travel":"#7EB8D4","Education":"#A07EC9","Other":"#9A9A9A",
};

export default function ExpenseList({ expenses, onEdit, onDelete }: Props) {
  if (expenses.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16 }}>
        <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 24, color: "#f0e8d8", marginBottom: 8 }}>No entries this month</p>
        <p style={{ fontSize: 14, color: "#555" }}>Click "New Entry" to get started.</p>
      </div>
    );
  }

  const grouped = expenses.reduce((acc, exp) => {
    const day = format(new Date(exp.date), "yyyy-MM-dd");
    if (!acc[day]) acc[day] = [];
    acc[day].push(exp);
    return acc;
  }, {} as Record<string, Expense[]>);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {Object.entries(grouped).map(([day, items]) => (
        <div key={day}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0 8px" }}>
            <span style={{ fontSize: 10, color: "#D4A853", letterSpacing: "0.12em", fontWeight: 600 }}>
              {format(new Date(day), "EEEE, MMMM d").toUpperCase()}
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            <span style={{ fontSize: 11, color: "#555", fontVariantNumeric: "tabular-nums" }}>
              ${items.reduce((s, e) => s + e.amount, 0).toFixed(2)}
            </span>
          </div>

          {items.map((exp) => (
            <div
              key={exp._id}
              className="group"
              style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "16px 20px", borderRadius: 12, marginBottom: 4,
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
                transition: "all 0.2s", cursor: "default",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(212,168,83,0.05)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,168,83,0.2)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: CATEGORY_COLORS[exp.category] || "#999", flexShrink: 0 }} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <p style={{ fontSize: 14, color: "#e0d8cc", margin: 0 }}>{exp.title}</p>
                  {exp.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 10, background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.2)", borderRadius: 99, padding: "2px 8px", color: "#D4A853" }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: "#555", margin: "3px 0 0" }}>{exp.category}</p>
              </div>

              <p style={{ fontVariantNumeric: "tabular-nums", fontSize: 15, color: "#f0e8d8", fontWeight: 500, flexShrink: 0 }}>
                ${exp.amount.toFixed(2)}
              </p>

              <div style={{ display: "flex", gap: 6, opacity: 0 }} className="group-hover:opacity-100" onMouseEnter={e => (e.currentTarget.style.opacity = "1")} ref={el => { if (el) { el.closest(".group")?.addEventListener("mouseenter", () => el.style.opacity = "1"); el.closest(".group")?.addEventListener("mouseleave", () => el.style.opacity = "0"); } }}>
                <button onClick={() => onEdit(exp)} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 7, padding: "7px 10px", cursor: "pointer", color: "#888", display: "flex", alignItems: "center" }}>
                  <Pencil size={13} />
                </button>
                <button onClick={() => onDelete(exp._id)} style={{ background: "rgba(224,112,112,0.08)", border: "none", borderRadius: 7, padding: "7px 10px", cursor: "pointer", color: "#E07070", display: "flex", alignItems: "center" }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
