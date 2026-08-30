import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatAmount(value, currency) {
  const n = Number(value);
  const amount = Number.isFinite(n) ? n : 0;
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return currency ? `${formatted} ${currency}` : formatted;
}

export function shortId(id) {
  if (!id) return "—";
  const s = String(id);
  return s.length <= 12 ? s : `${s.slice(0, 6)}…${s.slice(-4)}`;
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}