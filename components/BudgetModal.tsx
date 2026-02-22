"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/constants";

export interface Budget {
  _id?: string;
  category: string;
  limit: number;
  month: string;
}

interface Props {
  budgets: Budget[];
  month: string;
  onSave: (category: string, limit: number) => void;
  onDelete: (category: string) => void;
  onClose: () => void;
  spentByCategory: Record<string, number>;
}

export default function BudgetModal({
  budgets,
  onSave,
  onDelete,
  onClose,
  spentByCategory,
}: Props) {
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [limit, setLimit] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!limit || parseFloat(limit) <= 0) return;
    onSave(category, parseFloat(limit));
    setLimit("");
  }

  const inp = {
    padding: "11px 12px",
    fontSize: 16,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    color: "#f0e8d8",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box" as const,
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(5,5,15,0.8)",
          backdropFilter: "blur(8px)",
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 520,
          background: "linear-gradient(145deg,#0f0f1a,#161628)",
          border: "1px solid rgba(212,168,83,0.2)",
          borderRadius: "20px 20px 0 0",
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 -20px 60px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "12px 0 0",
          }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 99,
              background: "rgba(255,255,255,0.1)",
            }}
          />
        </div>
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg,transparent,#D4A853,transparent)",
            margin: "12px 0 0",
          }}
        />

        <div style={{ padding: "20px 20px 32px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontSize: 22,
                color: "#f0e8d8",
              }}
            >
              Budget Limits
            </span>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "none",
                borderRadius: 8,
                width: 34,
                height: 34,
                cursor: "pointer",
                color: "#888",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Add form */}
          <form
            onSubmit={handleAdd}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 20,
            }}
          >
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ ...inp, background: "#161628" }}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="Monthly limit ($)"
                style={{ ...inp, flex: 1 }}
                onFocus={(e) => (e.target.style.borderColor = "#D4A853")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                }
              />
              <button
                type="submit"
                style={{
                  background: "linear-gradient(135deg,#D4A853,#B8864A)",
                  border: "none",
                  borderRadius: 10,
                  padding: "0 20px",
                  cursor: "pointer",
                  color: "#0f0f1a",
                  fontWeight: 700,
                  fontFamily: "inherit",
                  fontSize: 13,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                SET
              </button>
            </div>
          </form>

          {/* List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {budgets.length === 0 ? (
              <p
                style={{
                  color: "#555",
                  fontSize: 13,
                  textAlign: "center",
                  padding: "20px 0",
                }}
              >
                No budgets set for this month.
              </p>
            ) : (
              budgets.map((b) => {
                const spent = spentByCategory[b.category] || 0;
                const pct = Math.min((spent / b.limit) * 100, 100);
                const over = spent > b.limit;
                return (
                  <div
                    key={b.category}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${over ? "rgba(224,112,112,0.3)" : "rgba(255,255,255,0.07)"}`,
                      borderRadius: 12,
                      padding: "14px 16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: CATEGORY_COLORS[b.category] || "#999",
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ fontSize: 13, color: "#e0d8cc" }}>
                          {b.category}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            color: over ? "#E07070" : "#888",
                          }}
                        >
                          ${spent.toFixed(0)} / ${b.limit.toFixed(0)}
                        </span>
                        <button
                          onClick={() => onDelete(b.category)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#555",
                            fontSize: 18,
                            lineHeight: 1,
                            padding: 0,
                          }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    <div
                      style={{
                        height: 4,
                        background: "rgba(255,255,255,0.06)",
                        borderRadius: 99,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: over
                            ? "#E07070"
                            : CATEGORY_COLORS[b.category] || "#D4A853",
                          borderRadius: 99,
                        }}
                      />
                    </div>
                    {over && (
                      <p
                        style={{ fontSize: 11, color: "#E07070", marginTop: 4 }}
                      >
                        Over by ${(spent - b.limit).toFixed(2)}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
