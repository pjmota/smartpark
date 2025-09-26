import api from "../api.service";
import { IPlans } from "@/types/clients.type";
import { logger } from "@/lib/logger";

export const createPlan = (plan: Omit<IPlans, "id">) => {
  logger.info("Creating new plan", { plan });
  return api.post<IPlans>("/plans", plan);
};

export const updatePlan = (planId: number, plan: IPlans) => {
  logger.info("Updating plan", { planId, plan });
  return api.put<IPlans>(`/plans/${planId}`, plan);
};