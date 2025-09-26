import { createPlan, updatePlan } from './plans.service';
import api from '../api.service';
import { logger } from '../../lib/logger';
import { IPlans } from '../../types/clients.type';

// Mock do api service
jest.mock('../api.service');
const mockedApi = api as jest.Mocked<typeof api>;

// Mock do logger
jest.mock('../../lib/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

const mockedLogger = logger as jest.Mocked<typeof logger>;

describe('plans.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPlan: IPlans = {
    id: 1,
    description: "Plano Mensal Carro",
    value: "150,00",
    spaces: 20,
    spacesBusy: 5,
    spacesAvailable: 15,
    status: true,
    type: "Carro",
    cancelValue: "75,00",
    startDate: "2024-01-01",
    endDate: "2024-12-31"
  };

  const mockPlanWithoutId = {
    description: "Plano Mensal Carro",
    value: "150,00",
    spaces: 20,
    spacesBusy: 5,
    spacesAvailable: 15,
    status: true,
    type: "Carro",
    cancelValue: "75,00",
    startDate: "2024-01-01",
    endDate: "2024-12-31"
  };

  describe('createPlan', () => {
    it('deve criar um plano com sucesso', async () => {
      const mockResponse = { data: mockPlan };
      mockedApi.post.mockResolvedValue(mockResponse);

      const result = await createPlan(mockPlanWithoutId);

      expect(mockedLogger.info).toHaveBeenCalledWith('Creating new plan', { plan: mockPlanWithoutId });
      expect(mockedApi.post).toHaveBeenCalledWith('/plans', mockPlanWithoutId);
      expect(result).toEqual(mockResponse);
    });

    it('deve lançar erro quando API falha na criação', async () => {
      const mockError = new Error('API Error');
      mockedApi.post.mockRejectedValue(mockError);

      await expect(createPlan(mockPlanWithoutId)).rejects.toThrow('API Error');
      expect(mockedLogger.info).toHaveBeenCalledWith('Creating new plan', { plan: mockPlanWithoutId });
      expect(mockedApi.post).toHaveBeenCalledWith('/plans', mockPlanWithoutId);
    });

    it('deve criar plano com dados mínimos obrigatórios', async () => {
      const minimalPlan = {
        description: "Plano Básico",
        value: "100,00",
        spaces: 10,
        spacesBusy: 0,
        spacesAvailable: 10,
        status: true
      };

      const mockResponse = { data: { ...minimalPlan, id: 2 } };
      mockedApi.post.mockResolvedValue(mockResponse);

      const result = await createPlan(minimalPlan);

      expect(mockedLogger.info).toHaveBeenCalledWith('Creating new plan', { plan: minimalPlan });
      expect(mockedApi.post).toHaveBeenCalledWith('/plans', minimalPlan);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updatePlan', () => {
    it('deve atualizar um plano com sucesso', async () => {
      const mockResponse = { data: mockPlan };
      mockedApi.put.mockResolvedValue(mockResponse);

      const result = await updatePlan(1, mockPlan);

      expect(mockedLogger.info).toHaveBeenCalledWith('Updating plan', { planId: 1, plan: mockPlan });
      expect(mockedApi.put).toHaveBeenCalledWith('/plans/1', mockPlan);
      expect(result).toEqual(mockResponse);
    });

    it('deve lançar erro quando API falha na atualização', async () => {
      const mockError = new Error('Update failed');
      mockedApi.put.mockRejectedValue(mockError);

      await expect(updatePlan(1, mockPlan)).rejects.toThrow('Update failed');
      expect(mockedLogger.info).toHaveBeenCalledWith('Updating plan', { planId: 1, plan: mockPlan });
      expect(mockedApi.put).toHaveBeenCalledWith('/plans/1', mockPlan);
    });

    it('deve atualizar plano com ID diferente', async () => {
      const planId = 999;
      const updatedPlan = { ...mockPlan, id: planId, description: "Plano Atualizado" };
      const mockResponse = { data: updatedPlan };
      mockedApi.put.mockResolvedValue(mockResponse);

      const result = await updatePlan(planId, updatedPlan);

      expect(mockedLogger.info).toHaveBeenCalledWith('Updating plan', { planId, plan: updatedPlan });
      expect(mockedApi.put).toHaveBeenCalledWith(`/plans/${planId}`, updatedPlan);
      expect(result).toEqual(mockResponse);
    });

    it('deve atualizar apenas campos específicos do plano', async () => {
      const updatedPlan = { ...mockPlan, value: "200,00", spaces: 30 };
      const mockResponse = { data: updatedPlan };
      mockedApi.put.mockResolvedValue(mockResponse);

      const result = await updatePlan(1, updatedPlan);

      expect(mockedLogger.info).toHaveBeenCalledWith('Updating plan', { planId: 1, plan: updatedPlan });
      expect(mockedApi.put).toHaveBeenCalledWith('/plans/1', updatedPlan);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('logger integration', () => {
    it('deve fazer log correto para createPlan', async () => {
      mockedApi.post.mockResolvedValue({ data: mockPlan });

      await createPlan(mockPlanWithoutId);

      expect(mockedLogger.info).toHaveBeenCalledTimes(1);
      expect(mockedLogger.info).toHaveBeenCalledWith('Creating new plan', { plan: mockPlanWithoutId });
    });

    it('deve fazer log correto para updatePlan', async () => {
      mockedApi.put.mockResolvedValue({ data: mockPlan });

      await updatePlan(1, mockPlan);

      expect(mockedLogger.info).toHaveBeenCalledTimes(1);
      expect(mockedLogger.info).toHaveBeenCalledWith('Updating plan', { planId: 1, plan: mockPlan });
    });
  });
});