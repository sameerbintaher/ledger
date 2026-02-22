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
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave({ title, amount: parseFloat(amount), category, tags, date, notes, recurrence });
    setSaving(false);
  }

  const inputStyle = {
    width: "100%", padding: "11px 16px", fontSize: 14,
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, color: "#f0e8d8", fontFamily: "inherit", boxSizing: "border-box" as const,
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, overflowY: "auto" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(5,5,15,0.75)", backdropFilter: "blur(10px)" }} onClick={onClose} />
      <div style={{
        position: "relative", width: "100%", maxWidth: 480,
        background: "linear-gradient(145deg,#0f0f1a,#161628)",
        border: "1px solid rgba(212,168,83,0.2)", borderRadius: 20, overflow: "hidden",
        boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
        margin: "auto",
      }}>
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#D4A853,transparent)" }} />
        <div style={{ padding: "24px 28px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 22, color: "#f0e8d8" }}>
              {expense ? "Edit Entry" : "New Entry"}
            </span>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "#888", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={{ fontSize: 10, color: "#D4A853", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 6 }}>TITLE</div>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Dinner at Nobu…" style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#D4A853"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: "#D4A853", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 6 }}>AMOUNT (USD)</div>
                <input type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="0.00" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#D4A853"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#D4A853", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 6 }}>DATE</div>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#D4A853"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: "#D4A853", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 6 }}>CATEGORY</div>
                <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, background: "#161628" }}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#D4A853", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 6 }}>RECURRENCE</div>
                <select value={recurrence} onChange={e => setRecurrence(e.target.value)} style={{ ...inputStyle, background: "#161628" }}>
                  {RECURRENCE_OPTIONS.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10, color: "#D4A853", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 6 }}>TAGS</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                  placeholder="business, personal…" style={{ ...inputStyle, flex: 1 }}
                  onFocus={e => e.target.style.borderColor = "#D4A853"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                <button type="button" onClick={addTag} style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.25)", borderRadius: 10, padding: "0 14px", cursor: "pointer", color: "#D4A853" }}>
                  <Plus size={16} />
                </button>
              </div>
              {tags.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                  {tags.map(tag => (
                    <span key={tag} style={{ fontSize: 11, background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.2)", borderRadius: 99, padding: "4px 12px", color: "#D4A853", display: "flex", alignItems: "center", gap: 6 }}>
                      {tag}
                      <button type="button" onClick={() => setTags(ts => ts.filter(t => t !== tag))} style={{ background: "none", border: "none", cursor: "pointer", color: "#D4A853", fontSize: 14, padding: 0 }}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div style={{ fontSize: 10, color: "#D4A853", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 6 }}>NOTES (OPTIONAL)</div>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Any extra details…"
                style={{ ...inputStyle, resize: "none" }}
                onFocus={e => e.target.style.borderColor = "#D4A853"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 4 }}>
              <button type="button" onClick={onClose} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 13, fontSize: 14, cursor: "pointer", color: "#888", fontFamily: "inherit" }}>Cancel</button>
              <button type="submit" disabled={saving} style={{ background: "linear-gradient(135deg,#D4A853,#B8864A)", border: "none", borderRadius: 12, padding: 13, fontSize: 14, cursor: "pointer", color: "#0f0f1a", fontWeight: 700, fontFamily: "inherit", letterSpacing: "0.04em", opacity: saving ? 0.6 : 1 }}>
                {saving ? "SAVING…" : expense ? "UPDATE" : "ADD ENTRY"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
