import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function Topbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    await logout();
    setBusy(false);
    navigate({ to: "/login", replace: true });
  }

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-4 py-3 md:px-8">
      <h1 className="text-base font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-muted-foreground sm:inline">
          {user?.name || user?.email}
        </span>
        <Button variant="outline" size="sm" onClick={handleLogout} disabled={busy}>
          <LogOut className="mr-1.5 h-3.5 w-3.5" />
          {busy ? "Signing out…" : "Logout"}
        </Button>
      </div>
    </header>
  );
}

export default Topbar;
