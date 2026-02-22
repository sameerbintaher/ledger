import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Expense from "@/lib/models/Expense";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const all = searchParams.get("all"); // for export

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = { userId: session.user.id };

  if (month && !all) {
    const [year, m] = month.split("-").map(Number);
    const start = new Date(year, m - 1, 1);
    const end = new Date(year, m, 1);
    query.date = { $gte: start, $lt: end };
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
      { notes: { $regex: search, $options: "i" } },
    ];
  }

  if (category && category !== "all") {
    query.category = category;
  }

  const expenses = await Expense.find(query).sort({ date: -1 });
  return NextResponse.json(expenses);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, amount, category, tags, date, notes, recurrence } = body;

  if (!title || !amount || !category || !date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await connectDB();

  const expense = await Expense.create({
    userId: session.user.id,
    title,
    amount: parseFloat(amount),
    category,
    tags: tags || [],
    date: new Date(date),
    notes,
    recurrence: recurrence || "none",
  });

  return NextResponse.json(expense, { status: 201 });
}
