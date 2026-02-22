"use client";
import { Expense } from "@/app/dashboard/page";
import { Budget } from "./BudgetModal";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { format, parseISO } from "date-fns";
import { CATEGORY_COLORS } from "@/lib/constants";

interface Props {
  expenses: Expense[];
  budgets: Budget[];
}

export default function Charts({ expenses, budgets }: Props) {
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
          No data to chart
        </p>
        <p style={{ fontSize: 14, color: "#555" }}>Add some expenses first.</p>
      </div>
    );
  }

  const byCategory = Object.entries(
    expenses.reduce(
      (acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
      },
      {} as Record<string, number>
    )
  )
    .map(([name, value]) => ({ name, value: +value.toFixed(2) }))
    .sort((a, b) => b.value - a.value);

  const byDay = Object.entries(
    expenses.reduce(
      (acc, e) => {
        const day = format(parseISO(e.date), "d MMM");
        acc[day] = (acc[day] || 0) + e.amount;
        return acc;
      },
      {} as Record<string, number>
    )
  ).map(([date, amount]) => ({ date, amount: +amount.toFixed(2) }));

  const budgetData = budgets.map((b) => {
    const spent = expenses
      .filter((e) => e.category === b.category)
      .reduce((s, e) => s + e.amount, 0);
    return {
      category: b.category.split(" ")[0],
      spent: +spent.toFixed(2),
      budget: b.limit,
    };
  });

  const tooltipStyle = {
    background: "#161628",
    border: "1px solid rgba(212,168,83,0.2)",
    borderRadius: 8,
    fontSize: 11,
    color: "#f0e8d8",
  };
  const card = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16,
    padding: "20px 16px",
  };
  const label = {
    fontSize: 10,
    color: "#D4A853",
    letterSpacing: "0.14em",
    fontWeight: 600,
    marginBottom: 16,
  } as const;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Pie chart */}
      <div style={card}>
        <div style={label}>BY CATEGORY</div>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={byCategory}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {byCategory.map((e) => (
                <Cell
                  key={e.name}
                  fill={CATEGORY_COLORS[e.name] || "#999"}
                  opacity={0.9}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: number) => [`$${v.toFixed(2)}`]}
              contentStyle={tooltipStyle}
            />
          </PieChart>
        </ResponsiveContainer>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            marginTop: 12,
          }}
        >
          {byCategory.map(({ name, value }) => (
            <div
              key={name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: CATEGORY_COLORS[name] || "#999",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 12, color: "#888" }}>{name}</span>
              </div>
              <span style={{ fontSize: 12, color: "#c8c0b4" }}>
                ${value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Area chart */}
      <div style={card}>
        <div style={label}>SPENDING TREND</div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={byDay}
            margin={{ top: 5, right: 0, left: -28, bottom: 0 }}
          >
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4A853" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D4A853" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#555" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#555" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v: number) => [`$${v.toFixed(2)}`, "Spent"]}
              contentStyle={tooltipStyle}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#D4A853"
              strokeWidth={2}
              fill="url(#goldGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#D4A853", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Budget vs Spent */}
      {budgetData.length > 0 && (
        <div style={card}>
          <div style={label}>BUDGET VS SPENT</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={budgetData}
              margin={{ top: 5, right: 0, left: -28, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 10, fill: "#555" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#555" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(v: number) => [`$${v.toFixed(2)}`]}
                contentStyle={tooltipStyle}
              />
              <Bar
                dataKey="spent"
                name="Spent"
                fill="#D4A853"
                radius={[5, 5, 0, 0]}
                opacity={0.9}
              />
              <Bar
                dataKey="budget"
                name="Budget"
                fill="rgba(255,255,255,0.08)"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
