import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/EcoFluxo",
  withCredentials: true,
});

export const usuarioApi = {
  create: (dados: { nome: string; email: string; senha: string }) =>
    api.post("/create", dados),
  login: (dados: { email: string; senha: string }) => api.post("/login", dados),
  verify2FA: (dados: { email: string; codigo: string }) =>
    api.post("/verify-2fa", dados),
  logout: () => api.post("/logout"),
  profile: () => api.get("/profile"),
};

export const ecopontoApi = {
  create: (dados: Record<string, unknown>) => api.post("/createEcoponto", dados),
  getAll: () => api.get("/getEcopontos"),
};

export const lixeiraApi = {
  create: (dados: {
    uuid_sensor: string;
    tipo: "PLASTICO" | "PAPEL" | "VIDRO" | "METAL" | "ORGANICO";
    volume_max: number;
    nivel_cheio: number;
    ecoponto_id: number;
  }) => api.post("/createLixeiras", dados),
  getAll: () => api.get("/getLixeiras"),
};

export default api;
