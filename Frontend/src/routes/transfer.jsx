import { createFileRoute } from "@tanstack/react-router";

import TransferPage from "@/pages/TransferPage";
import { RequireAuth } from "@/routes/-AppRoutes";

export const Route = createFileRoute("/transfer")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Transfer — Ledger Dashboard" },
      { name: "description", content: "Move funds between your ledger accounts securely." },
      { property: "og:title", content: "Transfer — Ledger Dashboard" },
      {
        property: "og:description",
        content: "Move funds between your ledger accounts securely.",
      },
    ],
  }),
  component: () => (
    <RequireAuth>
      <TransferPage />
    </RequireAuth>
  ),
});
