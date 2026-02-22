"use client";
import { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { Expense } from "@/app/dashboard/page";
import { Budget } from "./BudgetModal";

interface Props {
  expenses: Expense[];
  budgets: Budget[];
  month: string;
}

export default function InsightsPanel({ expenses, budgets, month }: Props) {
  const [insight, setInsight] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expenses, budgets, month }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unknown error");
      } else {
        setInsight(data.insight);
        setGenerated(true);
      }
    } catch (err) {
      setError(String(err));
    }
    setLoading(false);
  }

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,168,83,0.15)",
      borderRadius: 16, padding: 24, position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(212,168,83,0.4),transparent)" }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Sparkles size={16} color="#D4A853" />
          <span style={{ fontSize: 10, color: "#D4A853", letterSpacing: "0.14em", fontWeight: 600 }}>AI SPENDING INSIGHTS</span>
        </div>
        <button
          onClick={generate}
          disabled={loading || expenses.length === 0}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: generated ? "rgba(255,255,255,0.04)" : "rgba(212,168,83,0.15)",
            border: "1px solid rgba(212,168,83,0.25)", borderRadius: 8,
            padding: "7px 14px", cursor: expenses.length === 0 ? "not-allowed" : "pointer",
            color: "#D4A853", fontSize: 12, fontFamily: "inherit",
            opacity: loading || expenses.length === 0 ? 0.5 : 1,
          }}
        >
          <RefreshCw size={12} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
          {loading ? "Analysing…" : generated ? "Refresh" : "Generate Insights"}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div style={{ background: "rgba(224,112,112,0.08)", border: "1px solid rgba(224,112,112,0.2)", borderRadius: 10, padding: "12px 16px" }}>
          <p style={{ color: "#E07070", fontSize: 13, margin: "0 0 6px", fontWeight: 600 }}>Failed to generate insights</p>
          <p style={{ color: "#E07070", fontSize: 12, margin: 0, opacity: 0.8 }}>{error}</p>
          {error.includes("ANTHROPIC_API_KEY") && (
            <p style={{ color: "#888", fontSize: 12, margin: "8px 0 0" }}>
              → Get a free API key at <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{ color: "#D4A853" }}>console.anthropic.com</a> and add it to your <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: 4 }}>.env.local</code> as <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: 4 }}>ANTHROPIC_API_KEY</code>
            </p>
          )}
        </div>
      )}

      {/* Loading dots */}
      {loading && (
        <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 0" }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4A853", animation: `pulse 1s ease ${delay}s infinite` }} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!generated && !loading && !error && (
        <p style={{ color: "#444", fontSize: 13, margin: 0 }}>
          {expenses.length === 0
            ? "Add some expenses to generate AI insights."
            : "Click 'Generate Insights' to get a personalised analysis of your spending this month."}
        </p>
      )}

      {/* Insight text */}
      {insight && !loading && !error && (
        <p style={{ color: "#c8c0b4", fontSize: 14, lineHeight: 1.8, margin: 0 }}>{insight}</p>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}
