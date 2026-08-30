import { createFileRoute } from "@tanstack/react-router";

import LoginPage from "@/pages/LoginPage";
import { RequireGuest } from "@/routes/-AppRoutes";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — Ledger Dashboard" },
      { name: "description", content: "Sign in to your Ledger Dashboard account." },
      { property: "og:title", content: "Sign in — Ledger Dashboard" },
      { property: "og:description", content: "Sign in to your Ledger Dashboard account." },
    ],
  }),
  component: () => (
    <RequireGuest>
      <LoginPage />
    </RequireGuest>
  ),
});
