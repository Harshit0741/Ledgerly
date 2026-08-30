import { createFileRoute, Navigate } from "@tanstack/react-router";

import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Ledger Dashboard — Accounts & Transfers" },
      {
        name: "description",
        content: "Sign in to manage ledger accounts, live balances and money transfers.",
      },
      { property: "og:title", content: "Ledger Dashboard — Accounts & Transfers" },
      {
        property: "og:description",
        content: "Sign in to manage ledger accounts, live balances and money transfers.",
      },
    ],
  }),
  component: IndexRoute,
});

function IndexRoute() {
  const { isAuthenticated, ready } = useAuth();
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}
