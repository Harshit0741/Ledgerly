import { Loader2 } from "lucide-react";

export function PendingTransferOverlay({ open, elapsed }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-xl border border-border bg-card px-6 py-8 text-center shadow-lg">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <h2 className="mt-4 text-base font-semibold">Processing transfer</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The ledger is settling this transaction. This can take up to 15 seconds — please keep this
          page open.
        </p>
        <p className="font-numeric mt-4 text-sm text-muted-foreground">{elapsed}s elapsed</p>
      </div>
    </div>
  );
}

export default PendingTransferOverlay;
