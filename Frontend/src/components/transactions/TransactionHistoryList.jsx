import { getErrorMessage } from "@/api/client";
import TransactionStatusBadge from "@/components/transactions/TransactionStatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactions } from "@/hooks/useTransactions";
import { formatAmount, formatDate, shortId } from "@/lib/utils";

export function TransactionHistoryList({ accounts = [] }) {
  const { data: transactions, isPending, error } = useTransactions();

  const currencyFor = (accountId) => accounts.find((account) => account._id === accountId)?.currency;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent transfers</CardTitle>
        <CardDescription>
          Fetched from the server, so it's here even after you navigate away and back.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <p className="text-sm text-muted-foreground">Loading history…</p>
        ) : error ? (
          <p className="text-sm text-destructive">
            {getErrorMessage(error, "Could not load transaction history.")}
          </p>
        ) : !transactions?.length ? (
          <p className="text-sm text-muted-foreground">No transfers yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {transactions.map((transaction) => (
              <li
                key={transaction._id}
                className="flex items-center justify-between gap-4 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-numeric truncate">
                    {shortId(transaction.fromAccount)} → {shortId(transaction.toAccount)}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(transaction.createdAt)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-numeric">
                    {formatAmount(transaction.amount, currencyFor(transaction.toAccount))}
                  </span>
                  <TransactionStatusBadge status={transaction.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default TransactionHistoryList;
