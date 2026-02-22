import mongoose, { Schema, Document } from "mongoose";
import { CATEGORIES, Category, RECURRENCE_OPTIONS, Recurrence } from "@/lib/constants";
export { CATEGORIES, Category };

export interface IExpense extends Document {
  userId: string;
  title: string;
  amount: number;
  category: Category;
  tags: string[];
  date: Date;
  notes?: string;
  recurrence: Recurrence;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, enum: CATEGORIES, required: true },
    tags: [{ type: String }],
    date: { type: Date, required: true },
    notes: { type: String },
    recurrence: { type: String, enum: RECURRENCE_OPTIONS, default: "none" },
  },
  { timestamps: true }
);

export default mongoose.models.Expense ||
  mongoose.model<IExpense>("Expense", ExpenseSchema);
