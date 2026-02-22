import mongoose, { Schema, Document } from "mongoose";
import { CATEGORIES, Category } from "@/lib/constants";

export interface IBudget extends Document {
  userId: string;
  category: Category;
  limit: number;
  month: string; // format: "2026-02"
}

const BudgetSchema = new Schema<IBudget>({
  userId: { type: String, required: true, index: true },
  category: { type: String, enum: CATEGORIES, required: true },
  limit: { type: Number, required: true, min: 0 },
  month: { type: String, required: true },
});

BudgetSchema.index({ userId: 1, category: 1, month: 1 }, { unique: true });

export default mongoose.models.Budget ||
  mongoose.model<IBudget>("Budget", BudgetSchema);
