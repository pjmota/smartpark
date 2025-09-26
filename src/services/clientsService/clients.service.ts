import { IClients, IPlans } from "@/types/clients.type";
import api from "../api.service";
import { logger } from "@/lib/logger";

// Interface para os filtros da API
export interface IGarageFilters {
  search?: string;
  digitalMonthlyPayer?: boolean;
}

export async function fetchGarages(filters?: IGarageFilters): Promise<IClients[]> {
  try {
    // Construir query params
    const params = new URLSearchParams();
    
    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.digitalMonthlyPayer !== undefined) {
      params.append('digitalMonthlyPayer', filters.digitalMonthlyPayer.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `/garages?${queryString}` : '/garages';
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar garagens:', error);
    throw new Error('Falha ao carregar garagens. Tente novamente.');
  }
}

export async function fetchGarageById(id: number): Promise<IClients> {
  try {
    const response = await api.get(`/garages/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar garagem ${id}:`, error);
    throw new Error(`Falha ao carregar detalhes da garagem. Tente novamente.`);
  }
}

// Interface para a resposta da API de atualização
interface UpdatePlanResponse {
  success: boolean;
  message: string;
  updated: Partial<IPlans>;
  httpCode: number;
}

// Função para criar um novo plano específico de uma garagem
export async function createGaragePlan(
  garageCode: number, 
  planData: Omit<IPlans, 'id'>
): Promise<IPlans> {
  logger.info("Creating garage plan", { garageCode, planData });
  
  try {
    const response = await api.post<IPlans>(`/garages/${garageCode}/plans`, planData);
    
    logger.info("Plan created successfully", { 
      garageCode, 
      createdPlan: response.data 
    });
    
    return response.data;
  } catch (error: any) {
    logger.error("Error creating garage plan", { error, garageCode, planData });
    console.error(`Erro ao criar plano da garagem ${garageCode}:`, error);
    throw new Error(`Falha ao criar plano da garagem. Tente novamente.`);
  }
}

// Função para atualizar um plano específico de uma garagem
export async function updateGaragePlan(
  garageCode: number, 
  planId: number, 
  planData: Partial<IPlans>
): Promise<IPlans> {
  logger.info("Updating garage plan", { garageCode, planId, planData });
  
  // Tenta primeiro o endpoint específico de garagem
  try {
    const response = await api.put<UpdatePlanResponse>(`/garages/${garageCode}/plans/${planId}`, planData);
    
    // Verifica se a resposta foi bem-sucedida
    if (response.data.success) {
      logger.info("Plan updated successfully", { 
        garageCode, 
        planId, 
        message: response.data.message,
        updated: response.data.updated 
      });
      
      // Retorna o plano atualizado combinando os dados originais com as atualizações
      return { ...planData, id: planId, ...response.data.updated } as IPlans;
    } else {
      throw new Error(response.data.message || 'Falha na atualização do plano');
    }
  } catch (garageError: any) {
    // Se o endpoint de garagem retornar 404, usa o endpoint de planos gerais como fallback
    if (garageError?.response?.status === 404) {
      logger.info("Garage endpoint not available, using general plans endpoint as fallback", { garageCode, planId });
      
      try {
        const fallbackResponse = await api.put<IPlans>(`/plans/${planId}`, planData);
        return fallbackResponse.data;
      } catch (fallbackError: any) {
        logger.error("Fallback endpoint also failed", { fallbackError, garageCode, planId, planData });
        console.error(`Erro ao atualizar plano ${planId} (fallback também falhou):`, fallbackError);
        throw new Error(`Falha ao atualizar plano. Endpoints não disponíveis.`);
      }
    }
    
    // Se não for 404, relança o erro original
    logger.error("Error updating garage plan (non-404)", { garageError, garageCode, planId, planData });
    console.error(`Erro ao atualizar plano ${planId} da garagem ${garageCode}:`, garageError);
    throw new Error(`Falha ao atualizar plano da garagem. Tente novamente.`);
  }
}