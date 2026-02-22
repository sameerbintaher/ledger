"use client";
import { Expense } from "@/app/dashboard/page";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { CATEGORY_COLORS } from "@/lib/constants";

interface Props {
  expenses: Expense[];
  onEdit: (e: Expense) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseList({ expenses, onEdit, onDelete }: Props) {
  if (expenses.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontSize: 22,
            color: "#f0e8d8",
            marginBottom: 8,
          }}
        >
          No entries this month
        </p>
        <p style={{ fontSize: 14, color: "#555" }}>
          Tap "+ New Entry" to get started.
        </p>
      </div>
    );
  }

  const grouped = expenses.reduce(
    (acc, exp) => {
      const day = format(new Date(exp.date), "yyyy-MM-dd");
      if (!acc[day]) acc[day] = [];
      acc[day].push(exp);
      return acc;
    },
    {} as Record<string, Expense[]>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {Object.entries(grouped).map(([day, items]) => (
        <div key={day}>
          {/* Day header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 0 6px",
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: "#D4A853",
                letterSpacing: "0.1em",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {format(new Date(day), "EEE, MMM d").toUpperCase()}
            </span>
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(255,255,255,0.06)",
              }}
            />
            <span style={{ fontSize: 11, color: "#555", whiteSpace: "nowrap" }}>
              ${items.reduce((s, e) => s + e.amount, 0).toFixed(2)}
            </span>
          </div>

          {items.map((exp) => (
            <div
              key={exp._id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "13px 14px",
                borderRadius: 12,
                marginBottom: 4,
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Dot */}
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: CATEGORY_COLORS[exp.category] || "#999",
                  flexShrink: 0,
                }}
              />

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 14,
                    color: "#e0d8cc",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {exp.title}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 3,
                    flexWrap: "wrap",
                  }}
                >
                  <p style={{ fontSize: 11, color: "#555", margin: 0 }}>
                    {exp.category}
                  </p>
                  {exp.recurrence && exp.recurrence !== "none" && (
                    <span
                      style={{
                        fontSize: 9,
                        background: "rgba(107,201,160,0.1)",
                        border: "1px solid rgba(107,201,160,0.2)",
                        borderRadius: 99,
                        padding: "1px 6px",
                        color: "#6BC9A0",
                      }}
                    >
                      {exp.recurrence}
                    </span>
                  )}
                  {exp.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 9,
                        background: "rgba(212,168,83,0.1)",
                        border: "1px solid rgba(212,168,83,0.2)",
                        borderRadius: 99,
                        padding: "1px 6px",
                        color: "#D4A853",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <p
                style={{
                  fontSize: 14,
                  color: "#f0e8d8",
                  fontWeight: 500,
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                }}
              >
                ${exp.amount.toFixed(2)}
              </p>

              {/* Actions - always visible on mobile */}
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                <button
                  onClick={() => onEdit(exp)}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "none",
                    borderRadius: 7,
                    padding: "8px 9px",
                    cursor: "pointer",
                    color: "#888",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => onDelete(exp._id)}
                  style={{
                    background: "rgba(224,112,112,0.08)",
                    border: "none",
                    borderRadius: 7,
                    padding: "8px 9px",
                    cursor: "pointer",
                    color: "#E07070",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
