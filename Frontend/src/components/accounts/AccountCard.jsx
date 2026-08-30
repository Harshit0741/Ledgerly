import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccountBalance } from "@/hooks/useAccountBalance";
import { cn, formatAmount, shortId } from "@/lib/utils";

const STATUS_STYLES = {
  ACTIVE: "bg-success/15 text-success border-success/30",
  FROZEN: "bg-warning/20 text-warning-foreground border-warning/40",
  CLOSED: "bg-neutral-badge text-neutral-badge-foreground border-border",
};

function StatusBadge({ status }) {
  const key = String(status || "").toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[key] || STATUS_STYLES.CLOSED,
      )}
    >
      {key || "UNKNOWN"}
    </span>
  );
}

export function AccountCard({ account }) {
  const { data, isPending, isError, error } = useAccountBalance(account?._id);

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Account</p>
          <p className="font-numeric truncate text-sm" title={account?._id}>
            {shortId(account?._id)}
          </p>
        </div>
        <StatusBadge status={account?.status} />
      </CardHeader>
      <CardContent className="px-5 py-4">
        <div className="flex items-end justify-between gap-4">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {account?.currency || "—"}
          </span>
          <div className="text-right">
            {isPending ? (
              <Skeleton className="h-7 w-28" />
            ) : isError ? (
              <span className="text-sm text-destructive">
                {error?.response?.data?.message || "Balance unavailable"}
              </span>
            ) : (
              <span className="font-numeric text-2xl font-semibold">
                {formatAmount(data?.balance)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AccountCard;
