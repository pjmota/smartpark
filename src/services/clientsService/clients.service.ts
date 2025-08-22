import { IClients } from "@/types/clients.types";
import { mockClients } from "@/mock/clients.mock";


export async function fetchGarages(): Promise<IClients[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockClients]);
    }, 500);
  });
}