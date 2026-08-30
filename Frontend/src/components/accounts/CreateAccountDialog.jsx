import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getErrorMessage } from "@/api/client";
import { useCreateAccount } from "@/hooks/useAccounts";

export function CreateAccountDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const { mutateAsync, isPending } = useCreateAccount();

  async function handleCreate() {
    setError("");
    try {
      await mutateAsync();
      setOpen(false);
    } catch (err) {
      setError(getErrorMessage(err, "Could not create the account."));
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setError("");
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          New Account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new account</DialogTitle>
          <DialogDescription>
            A new ledger account will be opened under your profile with the default currency.
          </DialogDescription>
        </DialogHeader>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isPending}>
            {isPending ? "Creating…" : "Create account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateAccountDialog;
