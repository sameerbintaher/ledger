import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your-anthropic-api-key-here") {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not set in .env.local" }, { status: 500 });
  }

  try {
    const { expenses, budgets, month } = await req.json();

    const total = expenses.reduce((s: number, e: { amount: number }) => s + e.amount, 0);
    const byCategory = expenses.reduce((acc: Record<string, number>, e: { category: string; amount: number }) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    const prompt = `You are a personal finance advisor analyzing someone's expense data for ${month}.

Total spent: $${total.toFixed(2)}
Spending by category: ${JSON.stringify(byCategory, null, 2)}
Budget limits: ${JSON.stringify(budgets, null, 2)}
Number of transactions: ${expenses.length}

Give a concise, friendly, and actionable financial insight in 3-4 sentences. Mention:
1. Overall spending assessment
2. One category that stands out (either over budget or surprisingly high)
3. One concrete saving tip

Be warm and encouraging, not judgmental. Do not use markdown or bullet points, just plain paragraphs.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", err);
      return NextResponse.json({ error: `Anthropic API error: ${response.status} — ${err}` }, { status: 500 });
    }

    const data = await response.json();
    const insight = data.content?.[0]?.text || "No insight generated.";
    return NextResponse.json({ insight });

  } catch (err) {
    console.error("Insights error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
