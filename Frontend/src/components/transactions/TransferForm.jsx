import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { shortId } from "@/lib/utils";

function newIdempotencyKey() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `key-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function TransferForm({ accounts = [], isLoadingAccounts, isPending, error, onSubmit }) {
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [localError, setLocalError] = useState("");

  const canSubmit =
    !isPending && fromAccount && toAccount && amount !== "" && Number(amount) > 0 && !isLoadingAccounts;

  function handleSubmit(event) {
    event.preventDefault();
    setLocalError("");
    if (fromAccount === toAccount) {
      setLocalError("Source and destination accounts must be different.");
      return;
    }
    onSubmit({
      fromAccount,
      toAccount,
      amount: Number(amount),
      idempotencyKey: newIdempotencyKey(),
    });
  }

  const label = (account) => `${shortId(account._id)} · ${account.currency} · ${account.status}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fromAccount">From account</Label>
          <Select value={fromAccount} onValueChange={setFromAccount} disabled={isPending}>
            <SelectTrigger id="fromAccount" className="w-full">
              <SelectValue placeholder={isLoadingAccounts ? "Loading…" : "Select account"} />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account._id} value={account._id} className="font-numeric text-xs">
                  {label(account)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="toAccount">To account</Label>
          <Select value={toAccount} onValueChange={setToAccount} disabled={isPending}>
            <SelectTrigger id="toAccount" className="w-full">
              <SelectValue placeholder={isLoadingAccounts ? "Loading…" : "Select account"} />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account._id} value={account._id} className="font-numeric text-xs">
                  {label(account)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isPending}
          className="font-numeric text-right"
        />
      </div>

      {(localError || error) && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {localError || error}
        </p>
      )}

      <Button type="submit" disabled={!canSubmit} className="w-full sm:w-auto">
        {isPending ? "Transfer in progress…" : "Send transfer"}
      </Button>
    </form>
  );
}

export default TransferForm;
