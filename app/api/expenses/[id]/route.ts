import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Expense from "@/lib/models/Expense";

async function getExpenseForUser(id: string, userId: string) {
  const expense = await Expense.findById(id);
  if (!expense || expense.userId !== userId) return null;
  return expense;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const expense = await getExpenseForUser(params.id, session.user.id);
  if (!expense) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(expense);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const expense = await getExpenseForUser(params.id, session.user.id);
  if (!expense) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const { title, amount, category, tags, date, notes, recurrence } = body;
  expense.title = title ?? expense.title;
  expense.amount = amount ? parseFloat(amount) : expense.amount;
  expense.category = category ?? expense.category;
  expense.tags = tags ?? expense.tags;
  expense.date = date ? new Date(date) : expense.date;
  expense.notes = notes ?? expense.notes;
  expense.recurrence = recurrence ?? expense.recurrence;
  await expense.save();
  return NextResponse.json(expense);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const expense = await getExpenseForUser(params.id, session.user.id);
  if (!expense) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await expense.deleteOne();
  return NextResponse.json({ message: "Deleted" });
}
