import { createFileRoute } from "@tanstack/react-router";

import DashboardPage from "@/pages/DashboardPage";
import { RequireAuth } from "@/routes/AppRoutes";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Accounts — Ledger Dashboard" },
      { name: "description", content: "View your ledger accounts, statuses and live balances." },
      { property: "og:title", content: "Accounts — Ledger Dashboard" },
      {
        property: "og:description",
        content: "View your ledger accounts, statuses and live balances.",
      },
    ],
  }),
  component: () => (
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  ),
});
