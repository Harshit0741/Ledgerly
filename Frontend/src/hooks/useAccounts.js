import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { createAccount, getAccounts } from "@/api/accounts";
import { useAuth } from "@/context/AuthContext";

export function useAccounts() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
    enabled: isAuthenticated,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["accounts"] }),
  });
}
