import api from "../api.service";
import { IPlans } from "@/types/clients.types";

export const createPlan = (plan: Omit<IPlans, "id">) => {
  console.log("create", plan);
  return api.post<IPlans>("/plans", plan);
};

export const updatePlan = (planId: number, plan: IPlans) => {
  console.log("edit", plan);
  return api.put<IPlans>(`/plans/${planId}`, plan);
};