import api from "./axios";

export const getTransactions = (params) => api.get("/transactions", { params });
export const createTransaction = (payload) => api.post("/transactions", payload);
