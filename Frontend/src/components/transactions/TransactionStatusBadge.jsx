import { cn } from "@/lib/utils";

const STYLES = {
  COMPLETED: "bg-success/15 text-success border-success/30",
  PENDING: "bg-warning/20 text-warning-foreground border-warning/40",
  FAILED: "bg-destructive/12 text-destructive border-destructive/30",
  REVERSED: "bg-neutral-badge text-neutral-badge-foreground border-border",
};

export function TransactionStatusBadge({ status, className }) {
  const key = String(status || "").toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide",
        STYLES[key] || STYLES.REVERSED,
        className,
      )}
    >
      {key || "UNKNOWN"}
    </span>
  );
}

export default TransactionStatusBadge;
