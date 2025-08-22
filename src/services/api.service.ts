import axios from "axios";
import { useAuth } from "@/context/AuthContext/AuthContext";
const { user } = useAuth();

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_BACK,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {

  if (!user?.token) {
    console.error("Usuário não autenticado");
    return config;
  }

  const token = user.token;
  if (token) {
    config.headers!["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;