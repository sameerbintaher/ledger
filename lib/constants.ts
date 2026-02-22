export const CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Health",
  "Housing",
  "Utilities",
  "Travel",
  "Education",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLORS: Record<string, string> = {
  "Food & Dining": "#D4A853",
  Transport: "#6B9ED4",
  Shopping: "#C17FC7",
  Entertainment: "#E07070",
  Health: "#6BC9A0",
  Housing: "#70C4C4",
  Utilities: "#f39c12",
  Travel: "#7EB8D4",
  Education: "#A07EC9",
  Other: "#9A9A9A",
};

export type Category = (typeof CATEGORIES)[number];

export const RECURRENCE_OPTIONS = [
  "none",
  "daily",
  "weekly",
  "monthly",
] as const;
export type Recurrence = (typeof RECURRENCE_OPTIONS)[number];
