import type { CategoryColor } from "./types";

export const colorTokens: Record<
  CategoryColor,
  { bg: string; text: string; bar: string }
> = {
  primary: { bg: "bg-primary-light", text: "text-primary-dark", bar: "bg-primary" },
  success: { bg: "bg-success-light", text: "text-success", bar: "bg-success" },
  warn: { bg: "bg-warn-light", text: "text-warn", bar: "bg-warn" },
  danger: { bg: "bg-danger-light", text: "text-danger", bar: "bg-danger" },
  violet: { bg: "bg-violet-light", text: "text-violet", bar: "bg-violet" },
};
