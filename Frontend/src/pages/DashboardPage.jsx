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
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Demo account</AlertTitle>
          <AlertDescription>
             Every account is credited ₹100 automatically from an internal treasury account, so you have a balance to test transfers with. There's no public deposit endpoint by design — only a trusted system account is allowed to inject funds into the ledger, the same way real banking systems separate "moving money" from "creating money."
          </AlertDescription>
        </Alert>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Backend-focused project</AlertTitle>
          <AlertDescription>
            This project is built primarily to showcase the backend — the frontend here is intentionally minimal, just enough to visualize accounts and transfers. To explore the actual API,
            hit the live backend directly at{" "}
            
              href="https://ledgerly-ohkb.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              ledgerly-ohkb.onrender.com
            </a>
            , or test every route interactively via the{" "}
            
              href="https://documenter.getpostman.com/view/43825972/2sBYAuTBPZ"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              published Postman collection
            </a>
            .
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
