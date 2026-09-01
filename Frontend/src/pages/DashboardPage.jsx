import { Info } from "lucide-react";

import { getErrorMessage } from "@/api/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AccountList from "@/components/accounts/AccountList";
import CreateAccountDialog from "@/components/accounts/CreateAccountDialog";
import AppShell from "@/components/layout/AppShell";
import { useAccounts } from "@/hooks/useAccounts";

export function DashboardPage() {
  const { data: accounts, isPending, error } = useAccounts();

  return (
    <AppShell title="Accounts">
      <div className="mx-auto max-w-6xl space-y-6">
        <Alert variant={'destructive'}>
          <Info className="h-4 w-4" />
          <AlertTitle>Demo account</AlertTitle>
          <AlertDescription>
            Every new account is credited ₹100 automatically from an internal treasury account —
            purely so you have a balance to test transfers with. There's no real deposit endpoint
            yet, this is a stand-in for one until real funding (card/bank) is wired up.
          </AlertDescription>
        </Alert>

        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Your accounts</h2>
            <p className="text-sm text-muted-foreground">
              Balances are fetched live from the ledger.
            </p>
          </div>
          <CreateAccountDialog />
        </div>
        <AccountList
          accounts={accounts}
          isLoading={isPending}
          error={error ? getErrorMessage(error, "Could not load accounts.") : ""}
        />
      </div>
    </AppShell>
  );
}

export default DashboardPage;
