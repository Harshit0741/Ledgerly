import { createFileRoute } from "@tanstack/react-router";

import RegisterPage from "@/pages/RegisterPage";
import { RequireGuest } from "@/routes/-AppRoutes";

export const Route = createFileRoute("/register")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Create account — Ledger Dashboard" },
      { name: "description", content: "Register for a Ledger Dashboard account in seconds." },
      { property: "og:title", content: "Create account — Ledger Dashboard" },
      {
        property: "og:description",
        content: "Register for a Ledger Dashboard account in seconds.",
      },
    ],
  }),
  component: () => (
    <RequireGuest>
      <RegisterPage />
    </RequireGuest>
  ),
});
