import { useQuery } from "@tanstack/react-query";

import { getAccountBalance } from "@/api/accounts";

export function useAccountBalance(accountId) {
  return useQuery({
    queryKey: ["balance", accountId],
    queryFn: () => getAccountBalance(accountId),
    enabled: Boolean(accountId),
  });
}
