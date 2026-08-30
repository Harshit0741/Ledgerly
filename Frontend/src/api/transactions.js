import api from "./client";

export async function createTransaction({ fromAccount, toAccount, amount, idempotencyKey }) {
  const { data } = await api.post("/transactions", {
    fromAccount,
    toAccount,
    amount,
    idempotencyKey,
  });
  return data;
}

export async function getTransactions() {
  const { data } = await api.get("/transactions");
  return data.transactions || [];
}