import { useEffect, useRef, useState } from "react";

import { getErrorMessage } from "@/api/client";
import AppShell from "@/components/layout/AppShell";
import PendingTransferOverlay from "@/components/transactions/PendingTransferOverlay";
import TransactionHistoryList from "@/components/transactions/TransactionHistoryList";
import TransactionStatusBadge from "@/components/transactions/TransactionStatusBadge";
import TransferForm from "@/components/transactions/TransferForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccounts } from "@/hooks/useAccounts";
import { useCreateTransaction } from "@/hooks/useCreateTransaction";
import { formatAmount, shortId } from "@/lib/utils";

export function TransferPage() {
  const { data: accounts, isPending: loadingAccounts } = useAccounts();
  const { mutateAsync, isPending } = useCreateTransaction();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPending) {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [isPending]);

  async function handleTransfer(payload) {
    setError("");
    setResult(null);
    try {
      const data = await mutateAsync(payload);
      setResult(data);
    } catch (err) {
      setError(getErrorMessage(err, "The transfer could not be completed."));
    }
  }

  const transaction = result?.transaction;

  return (
    <AppShell title="Transfer">
      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>New transfer</CardTitle>
            <CardDescription>
              Move funds between your accounts. Each submission carries a unique idempotency key.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransferForm
              accounts={accounts || []}
              isLoadingAccounts={loadingAccounts}
              isPending={isPending}
              error={error}
              onSubmit={handleTransfer}
            />
          </CardContent>
        </Card>

        {transaction ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle>Latest transaction</CardTitle>
                <CardDescription>{result?.message}</CardDescription>
              </div>
              <TransactionStatusBadge status={transaction.status} />
            </CardHeader>
            <CardContent>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">From</dt>
                  <dd className="font-numeric" title={transaction.fromAccount}>
                    {shortId(transaction.fromAccount)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">To</dt>
                  <dd className="font-numeric" title={transaction.toAccount}>
                    {shortId(transaction.toAccount)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Amount</dt>
                  <dd className="font-numeric">{formatAmount(transaction.amount)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Transaction ID</dt>
                  <dd className="font-numeric truncate" title={transaction._id}>
                    {shortId(transaction._id)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        ) : null}

        <TransactionHistoryList accounts={accounts || []} />
      </div>

      <PendingTransferOverlay open={isPending} elapsed={elapsed} />
    </AppShell>
  );
}

export default TransferPage;
