import api from "./client";

export async function register({ email, password, name }) {
  const { data } = await api.post("/auth/register", { email, password, name });
  return data;
}

export async function login({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

export async function logout() {
  const { data } = await api.post("/auth/logout");
  return data;
}
