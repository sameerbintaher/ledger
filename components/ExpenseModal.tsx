"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { X, Plus } from "lucide-react";
import { CATEGORIES, RECURRENCE_OPTIONS } from "@/lib/constants";
import { Expense } from "@/app/dashboard/page";

interface Props {
  expense: Expense | null;
  onSave: (data: Omit<Expense, "_id">) => void;
  onClose: () => void;
}

export default function ExpenseModal({ expense, onSave, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [notes, setNotes] = useState("");
  const [recurrence, setRecurrence] = useState("none");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setDate(format(new Date(expense.date), "yyyy-MM-dd"));
      setTags(expense.tags || []);
      setNotes(expense.notes || "");
      setRecurrence(expense.recurrence || "none");
    }
  }, [expense]);

  function addTag() {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave({
      title,
      amount: parseFloat(amount),
      category,
      tags,
      date,
      notes,
      recurrence,
    });
    setSaving(false);
  }

  const inp = {
    width: "100%",
    padding: "12px 14px",
    fontSize: 16,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    color: "#f0e8d8",
    fontFamily: "inherit",
    boxSizing: "border-box" as const,
  };

  const lbl = {
    fontSize: 10,
    color: "#D4A853",
    letterSpacing: "0.12em",
    fontWeight: 600,
    marginBottom: 6,
    display: "block",
  } as const;

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

      {/* Sheet slides up from bottom on mobile, centered on desktop */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 480,
          background: "linear-gradient(145deg,#0f0f1a,#161628)",
          border: "1px solid rgba(212,168,83,0.2)",
          borderRadius: "20px 20px 0 0",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 -20px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Handle bar */}
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
              {expense ? "Edit Entry" : "New Entry"}
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

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <div>
              <label style={lbl}>TITLE</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Dinner at Nobu…"
                style={inp}
                onFocus={(e) => (e.target.style.borderColor = "#D4A853")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                }
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <div>
                <label style={lbl}>AMOUNT</label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  placeholder="0.00"
                  style={inp}
                  onFocus={(e) => (e.target.style.borderColor = "#D4A853")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                  }
                />
              </div>
              <div>
                <label style={lbl}>DATE</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  style={inp}
                  onFocus={(e) => (e.target.style.borderColor = "#D4A853")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                  }
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <div>
                <label style={lbl}>CATEGORY</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ ...inp, background: "#161628" }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={lbl}>RECURRENCE</label>
                <select
                  value={recurrence}
                  onChange={(e) => setRecurrence(e.target.value)}
                  style={{ ...inp, background: "#161628" }}
                >
                  {RECURRENCE_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={lbl}>TAGS</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add a tag…"
                  style={{ ...inp, flex: 1 }}
                  onFocus={(e) => (e.target.style.borderColor = "#D4A853")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                  }
                />
                <button
                  type="button"
                  onClick={addTag}
                  style={{
                    background: "rgba(212,168,83,0.1)",
                    border: "1px solid rgba(212,168,83,0.25)",
                    borderRadius: 10,
                    padding: "0 14px",
                    cursor: "pointer",
                    color: "#D4A853",
                    flexShrink: 0,
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>
              {tags.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    marginTop: 8,
                  }}
                >
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 11,
                        background: "rgba(212,168,83,0.1)",
                        border: "1px solid rgba(212,168,83,0.2)",
                        borderRadius: 99,
                        padding: "4px 10px",
                        color: "#D4A853",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() =>
                          setTags((ts) => ts.filter((t) => t !== tag))
                        }
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#D4A853",
                          fontSize: 14,
                          padding: 0,
                          lineHeight: 1,
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label style={lbl}>NOTES (OPTIONAL)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Any extra details…"
                style={{ ...inp, resize: "none" }}
                onFocus={(e) => (e.target.style.borderColor = "#D4A853")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                }
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: 10,
                marginTop: 4,
              }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: 14,
                  fontSize: 14,
                  cursor: "pointer",
                  color: "#888",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{
                  background: "linear-gradient(135deg,#D4A853,#B8864A)",
                  border: "none",
                  borderRadius: 12,
                  padding: 14,
                  fontSize: 14,
                  cursor: "pointer",
                  color: "#0f0f1a",
                  fontWeight: 700,
                  fontFamily: "inherit",
                  letterSpacing: "0.04em",
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? "SAVING…" : expense ? "UPDATE" : "ADD ENTRY"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .modal-sheet {
            border-radius: 20px !important;
            margin: auto !important;
            align-self: center !important;
          }
        }
      `}</style>
    </div>
  );
}
