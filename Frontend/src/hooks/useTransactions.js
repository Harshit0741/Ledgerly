import { useQuery } from "@tanstack/react-query";

import { getTransactions } from "@/api/transactions";
import { useAuth } from "@/context/AuthContext";

export function useTransactions() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
    enabled: isAuthenticated,
  });
}
