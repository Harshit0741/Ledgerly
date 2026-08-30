import { Link } from "@tanstack/react-router";
import { LayoutGrid, ArrowLeftRight, Landmark } from "lucide-react";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Accounts", icon: LayoutGrid },
  { to: "/transfer", label: "Transfer", icon: ArrowLeftRight },
];

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Landmark className="h-4 w-4" />
        </span>
        <span className="text-sm font-semibold tracking-tight">Ledger</span>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            activeProps={{
              className: cn("bg-sidebar-accent text-sidebar-accent-foreground font-medium"),
            }}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-border bg-card md:hidden">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className="flex flex-1 flex-col items-center gap-1 py-2.5 text-xs text-muted-foreground"
          activeProps={{ className: "text-primary font-medium" }}
        >
          <Icon className="h-5 w-5" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export default Sidebar;
