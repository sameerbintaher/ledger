import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Budget from "@/lib/models/Budget";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const month = req.nextUrl.searchParams.get("month") || "";
  const budgets = await Budget.find({ userId: session.user.id, month });
  return NextResponse.json(budgets);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { category, limit, month } = await req.json();
  await connectDB();

  const budget = await Budget.findOneAndUpdate(
    { userId: session.user.id, category, month },
    { limit },
    { upsert: true, new: true }
  );

  return NextResponse.json(budget);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { category, month } = await req.json();
  await connectDB();
  await Budget.deleteOne({ userId: session.user.id, category, month });
  return NextResponse.json({ message: "Deleted" });
}
