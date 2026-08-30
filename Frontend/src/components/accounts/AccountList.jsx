import AccountCard from "@/components/accounts/AccountCard";
import { Skeleton } from "@/components/ui/skeleton";

export function AccountList({ accounts, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[136px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {error}
      </p>
    );
  }

  if (!accounts?.length) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
        <p className="text-sm text-muted-foreground">
          No accounts yet. Create your first account to start moving money.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {accounts.map((account) => (
        <AccountCard key={account._id} account={account} />
      ))}
    </div>
  );
}

export default AccountList;
