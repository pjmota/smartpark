import { IClients } from "@/types/clients.types";
import { mockClients } from "@/mock/clients.mock";

export async function fetchGarages(): Promise<IClients[]> {
  // API desativada por enquanto
  // const response = await api.get('/garages');
  // return response.data;

  return mockClients;
}

export async function fetchGarageById(id: number): Promise<IClients> {
  // API desativada por enquanto
  // const response = await api.get(`/garages/${id}`);
  // return response.data;

  const garage = mockClients.find(g => g.code === id);
  if (!garage) {
    throw new Error(`Garagem com código ${id} não encontrada`);
  }
  return garage;
}