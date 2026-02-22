"use client";
import { Expense } from "@/app/dashboard/page";
import { Budget } from "./BudgetModal";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, ReferenceLine,
} from "recharts";
import { format, parseISO } from "date-fns";
import { CATEGORY_COLORS } from "@/lib/constants";

interface Props { expenses: Expense[]; budgets: Budget[] }

export default function Charts({ expenses, budgets }: Props) {
  if (expenses.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16 }}>
        <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 24, color: "#f0e8d8", marginBottom: 8 }}>No data to chart</p>
        <p style={{ fontSize: 14, color: "#555" }}>Add some expenses first.</p>
      </div>
    );
  }

  const byCategory = Object.entries(
    expenses.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value: +value.toFixed(2) })).sort((a, b) => b.value - a.value);

  const byDay = Object.entries(
    expenses.reduce((acc, e) => {
      const day = format(parseISO(e.date), "MMM d");
      acc[day] = (acc[day] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([date, amount]) => ({ date, amount: +amount.toFixed(2) }));

  // Budget vs spent
  const budgetData = budgets.map(b => {
    const spent = expenses.filter(e => e.category === b.category).reduce((s, e) => s + e.amount, 0);
    return { category: b.category.split(" ")[0], spent: +spent.toFixed(2), budget: b.limit, over: spent > b.limit };
  });

  const tooltipStyle = { background: "#161628", border: "1px solid rgba(212,168,83,0.2)", borderRadius: 8, fontSize: 12, color: "#f0e8d8" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20 }}>
        {/* Pie */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 28 }}>
          <div style={{ fontSize: 10, color: "#D4A853", letterSpacing: "0.14em", fontWeight: 600, marginBottom: 20 }}>BY CATEGORY</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={byCategory} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value">
                {byCategory.map(e => <Cell key={e.name} fill={CATEGORY_COLORS[e.name] || "#999"} opacity={0.9} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`$${v.toFixed(2)}`]} contentStyle={tooltipStyle} itemStyle={{ color: "#f0e8d8" }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            {byCategory.map(({ name, value }) => (
              <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: CATEGORY_COLORS[name] || "#999" }} />
                  <span style={{ fontSize: 13, color: "#888" }}>{name}</span>
                </div>
                <span style={{ fontSize: 13, color: "#c8c0b4", fontVariantNumeric: "tabular-nums" }}>${value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Area chart */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 28 }}>
          <div style={{ fontSize: 10, color: "#D4A853", letterSpacing: "0.14em", fontWeight: 600, marginBottom: 20 }}>SPENDING TREND</div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={byDay} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4A853" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4A853" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#555" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#555" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [`$${v.toFixed(2)}`, "Spent"]} contentStyle={tooltipStyle} itemStyle={{ color: "#D4A853" }} />
              <Area type="monotone" dataKey="amount" stroke="#D4A853" strokeWidth={2} fill="url(#goldGrad)" dot={false} activeDot={{ r: 4, fill: "#D4A853", strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget vs Spent */}
      {budgetData.length > 0 && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 28 }}>
          <div style={{ fontSize: 10, color: "#D4A853", letterSpacing: "0.14em", fontWeight: 600, marginBottom: 20 }}>BUDGET VS SPENT</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={budgetData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#555" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#555" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [`$${v.toFixed(2)}`]} contentStyle={tooltipStyle} itemStyle={{ color: "#f0e8d8" }} />
              <Bar dataKey="spent" name="Spent" fill="#D4A853" radius={[6, 6, 0, 0]} opacity={0.9} />
              <Bar dataKey="budget" name="Budget" fill="rgba(255,255,255,0.08)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
