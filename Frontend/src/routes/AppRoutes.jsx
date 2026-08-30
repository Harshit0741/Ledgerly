import { Navigate } from "@tanstack/react-router";

import { useAuth } from "@/context/AuthContext";


export function RequireAuth({ children }) {
  const { isAuthenticated, ready } = useAuth();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}


export function RequireGuest({ children }) {
  const { isAuthenticated, ready } = useAuth();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return children;
}

export default RequireAuth;
