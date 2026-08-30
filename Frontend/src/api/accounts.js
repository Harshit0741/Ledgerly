import api from "./client";

export async function createAccount() {
  const { data } = await api.post("/accounts", {});
  return data.account;
}

export async function getAccounts() {
  const { data } = await api.get("/accounts");
  return data.accounts || [];
}

export async function getAccountBalance(accountId) {
  const { data } = await api.get(`/accounts/balance/${accountId}`);
  return data;
}
