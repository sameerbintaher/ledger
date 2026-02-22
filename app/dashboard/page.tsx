"use client";
import { useState, useEffect, useCallback } from "react";
import { format, startOfMonth } from "date-fns";
import { ChevronLeft, ChevronRight, Target, Plus } from "lucide-react";
import ExpenseList from "@/components/ExpenseList";
import ExpenseModal from "@/components/ExpenseModal";
import Charts from "@/components/Charts";
import StatsBar from "@/components/StatsBar";
import BudgetModal, { Budget } from "@/components/BudgetModal";
import SearchBar from "@/components/SearchBar";
import ExportMenu from "@/components/ExportMenu";

export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  tags: string[];
  date: string;
  notes?: string;
  recurrence?: string;
}

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [activeTab, setActiveTab] = useState<"transactions" | "charts">(
    "transactions"
  );
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const monthKey = format(startOfMonth(currentDate), "yyyy-MM");
  const monthLabel = format(currentDate, "MMMM yyyy").toUpperCase();

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ month: monthKey });
    if (search) params.set("search", search);
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    const res = await fetch(`/api/expenses?${params}`);
    const data = await res.json();
    setExpenses(data);
    setLoading(false);
  }, [monthKey, search, categoryFilter]);

  const fetchBudgets = useCallback(async () => {
    const res = await fetch(`/api/budgets?month=${monthKey}`);
    const data = await res.json();
    setBudgets(data);
  }, [monthKey]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);
  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  function prevMonth() {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function nextMonth() {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }
  function openAdd() {
    setEditing(null);
    setShowModal(true);
  }
  function openEdit(exp: Expense) {
    setEditing(exp);
    setShowModal(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this entry?")) return;
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    fetchExpenses();
  }

  async function handleSave(data: Omit<Expense, "_id">) {
    if (editing) {
      await fetch(`/api/expenses/${editing._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setShowModal(false);
    fetchExpenses();
  }

  async function handleBudgetSave(category: string, limit: number) {
    await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, limit, month: monthKey }),
    });
    fetchBudgets();
  }

  async function handleBudgetDelete(category: string) {
    await fetch("/api/budgets", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, month: monthKey }),
    });
    fetchBudgets();
  }

  const spentByCategory = expenses.reduce(
    (acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  const overBudget = budgets.filter(
    (b) => (spentByCategory[b.category] || 0) > b.limit
  );

  return (
    <>
      <div className="animate-entry" style={{ paddingBottom: 80 }}>
        <div
          style={{
            position: "fixed",
            top: "-20%",
            right: "-10%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(212,168,83,0.05) 0%,transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#D4A853",
                    letterSpacing: "0.14em",
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  {monthLabel}
                </div>
                <h1
                  style={{
                    fontFamily: "'Cormorant Garamond',Georgia,serif",
                    fontSize: "clamp(26px,6vw,40px)",
                    color: "#f0e8d8",
                    fontWeight: 400,
                    lineHeight: 1,
                  }}
                >
                  Overview
                </h1>
              </div>
              {/* Desktop: New Entry button */}
              <button
                onClick={openAdd}
                className="desktop-new-btn"
                style={{
                  background: "linear-gradient(135deg,#D4A853,#B8864A)",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 20px",
                  color: "#0f0f1a",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  letterSpacing: "0.05em",
                  boxShadow: "0 4px 20px rgba(212,168,83,0.25)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Plus size={14} /> NEW ENTRY
              </button>
            </div>

            {/* Controls */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {/* Month nav */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={prevMonth}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#666",
                    padding: "8px 10px",
                    display: "flex",
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                <span
                  style={{
                    fontSize: 12,
                    color: "#888",
                    padding: "0 4px",
                    minWidth: 72,
                    textAlign: "center",
                  }}
                >
                  {format(currentDate, "MMM yyyy")}
                </span>
                <button
                  onClick={nextMonth}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#666",
                    padding: "8px 10px",
                    display: "flex",
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <ExportMenu expenses={expenses} month={monthKey} />

              <button
                onClick={() => setShowBudget(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${overBudget.length > 0 ? "rgba(224,112,112,0.4)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 10,
                  padding: "8px 12px",
                  cursor: "pointer",
                  color: overBudget.length > 0 ? "#E07070" : "#888",
                  fontSize: 13,
                  fontFamily: "inherit",
                }}
              >
                <Target size={14} />
                <span>
                  Budgets
                  {overBudget.length > 0 ? ` (${overBudget.length})` : ""}
                </span>
              </button>
            </div>
          </div>

          {/* Over budget alert */}
          {overBudget.length > 0 && (
            <div
              style={{
                background: "rgba(224,112,112,0.08)",
                border: "1px solid rgba(224,112,112,0.2)",
                borderRadius: 12,
                padding: "10px 14px",
                marginBottom: 16,
                fontSize: 13,
                color: "#E07070",
              }}
            >
              ⚠️ Over budget: {overBudget.map((b) => b.category).join(", ")}
            </div>
          )}

          {/* Stats */}
          <StatsBar expenses={expenses} />

          {/* Tabs — full width on mobile */}
          <div
            style={{
              display: "flex",
              gap: 4,
              background: "rgba(255,255,255,0.03)",
              borderRadius: 12,
              padding: 4,
              margin: "16px 0 0",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {(["transactions", "charts"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: "9px 0",
                  borderRadius: 9,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textTransform: "capitalize",
                  background:
                    activeTab === tab ? "rgba(212,168,83,0.12)" : "none",
                  border:
                    activeTab === tab
                      ? "1px solid rgba(212,168,83,0.25)"
                      : "1px solid transparent",
                  color: activeTab === tab ? "#D4A853" : "#555",
                  fontWeight: activeTab === tab ? 600 : 400,
                  transition: "all 0.2s",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            {activeTab === "transactions" && (
              <>
                <SearchBar
                  search={search}
                  onSearch={setSearch}
                  category={categoryFilter}
                  onCategory={setCategoryFilter}
                />
                {loading ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "60px 0",
                      color: "#444",
                    }}
                  >
                    Loading…
                  </div>
                ) : (
                  <ExpenseList
                    expenses={expenses}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                  />
                )}
              </>
            )}
            {activeTab === "charts" && (
              <Charts expenses={expenses} budgets={budgets} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      <button
        onClick={openAdd}
        className="mobile-fab"
        style={{
          display: "none",
          position: "fixed",
          bottom: 24,
          right: 20,
          zIndex: 40,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#D4A853,#B8864A)",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 8px 32px rgba(212,168,83,0.5)",
          alignItems: "center",
          justifyContent: "center",
          color: "#0f0f1a",
        }}
      >
        <Plus size={22} />
      </button>

      {showModal && (
        <ExpenseModal
          expense={editing}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
      {showBudget && (
        <BudgetModal
          budgets={budgets}
          month={monthKey}
          onSave={handleBudgetSave}
          onDelete={handleBudgetDelete}
          onClose={() => setShowBudget(false)}
          spentByCategory={spentByCategory}
        />
      )}
    </>
  );
}
