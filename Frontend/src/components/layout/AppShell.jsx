import Sidebar, { BottomNav } from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export function AppShell({ title, children }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} />
        <main className="flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}

export default AppShell;
