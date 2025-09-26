import { 
  fetchGarages, 
  fetchGarageById, 
  createGaragePlan, 
  updateGaragePlan,
  IGarageFilters 
} from './clients.service'
import api from '../api.service'
import { IClients, IPlans } from '@/types/clients.type'

// Mock do api service
jest.mock('../api.service')
const mockedApi = api as jest.Mocked<typeof api>

// Mock do logger
jest.mock('../../lib/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}))

import { logger } from '../../lib/logger'
const mockedLogger = logger as jest.Mocked<typeof logger>

describe('clients.service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    console.error = jest.fn()
  })

  describe('fetchGarages', () => {
    const mockGarages: IClients[] = [
      {
        code: 610,
        name: 'Test Garage',
        address: 'Test Address',
        neighborhood: 'Test Neighborhood',
        city: 'Test City',
        uf: 'SP',
        regional: 'SP1',
        digitalMonthlyPayer: true,
        totalParkingSpace: 35,
        parkingSpaceBusy: 0,
        parkingSpaceAvailable: 35,
        plans: [],
        branch: 'Test Branch'
      }
    ]

    it('deve buscar garagens sem filtros', async () => {
      mockedApi.get.mockResolvedValue({ data: mockGarages })

      const result = await fetchGarages()

      expect(mockedApi.get).toHaveBeenCalledWith('/garages')
      expect(result).toEqual(mockGarages)
    })

    it('deve buscar garagens com filtro de busca', async () => {
      const filters: IGarageFilters = { search: 'test' }
      mockedApi.get.mockResolvedValue({ data: mockGarages })

      const result = await fetchGarages(filters)

      expect(mockedApi.get).toHaveBeenCalledWith('/garages?search=test')
      expect(result).toEqual(mockGarages)
    })

    it('deve buscar garagens com filtro digitalMonthlyPayer', async () => {
      const filters: IGarageFilters = { digitalMonthlyPayer: true }
      mockedApi.get.mockResolvedValue({ data: mockGarages })

      const result = await fetchGarages(filters)

      expect(mockedApi.get).toHaveBeenCalledWith('/garages?digitalMonthlyPayer=true')
      expect(result).toEqual(mockGarages)
    })

    it('deve buscar garagens com múltiplos filtros', async () => {
      const filters: IGarageFilters = { 
        search: 'test', 
        digitalMonthlyPayer: false 
      }
      mockedApi.get.mockResolvedValue({ data: mockGarages })

      const result = await fetchGarages(filters)

      expect(mockedApi.get).toHaveBeenCalledWith('/garages?search=test&digitalMonthlyPayer=false')
      expect(result).toEqual(mockGarages)
    })

    it('deve lançar erro quando API falha', async () => {
      const mockError = new Error('API Error')
      mockedApi.get.mockRejectedValue(mockError)

      await expect(fetchGarages()).rejects.toThrow('Falha ao carregar garagens. Tente novamente.')
      expect(console.error).toHaveBeenCalledWith('Erro ao buscar garagens:', mockError)
    })
  })

  describe('fetchGarageById', () => {
    const mockGarage: IClients = {
      code: 610,
      name: 'Test Garage',
      address: 'Test Address',
      neighborhood: 'Test Neighborhood',
      city: 'Test City',
      uf: 'SP',
      regional: 'SP1',
      digitalMonthlyPayer: true,
      totalParkingSpace: 35,
      parkingSpaceBusy: 0,
      parkingSpaceAvailable: 35,
      plans: [],
      branch: 'Test Branch'
    }

    it('deve buscar garagem por ID com sucesso', async () => {
      mockedApi.get.mockResolvedValue({ data: mockGarage })

      const result = await fetchGarageById(610)

      expect(mockedApi.get).toHaveBeenCalledWith('/garages/610')
      expect(result).toEqual(mockGarage)
    })

    it('deve lançar erro quando API falha', async () => {
      const mockError = new Error('API Error')
      mockedApi.get.mockRejectedValue(mockError)

      await expect(fetchGarageById(610)).rejects.toThrow('Falha ao carregar detalhes da garagem. Tente novamente.')
      expect(console.error).toHaveBeenCalledWith('Erro ao buscar garagem 610:', mockError)
    })
  })

  describe('createGaragePlan', () => {
    const mockPlanData: Omit<IPlans, 'id'> = {
      description: 'Test Plan',
      value: '100,00',
      spaces: 10,
      spacesBusy: 0,
      spacesAvailable: 10,
      status: true,
      type: 'Carro',
      cancelValue: '50,00',
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    }

    const mockCreatedPlan: IPlans = {
      id: 1,
      ...mockPlanData
    }

    it('deve criar plano com sucesso', async () => {
      mockedApi.post.mockResolvedValue({ data: mockCreatedPlan })

      const result = await createGaragePlan(610, mockPlanData)

      expect(mockedApi.post).toHaveBeenCalledWith('/garages/610/plans', mockPlanData)
      expect(mockedLogger.info).toHaveBeenCalledWith('Creating garage plan', { 
        garageCode: 610, 
        planData: mockPlanData 
      })
      expect(mockedLogger.info).toHaveBeenCalledWith('Plan created successfully', { 
        garageCode: 610, 
        createdPlan: mockCreatedPlan 
      })
      expect(result).toEqual(mockCreatedPlan)
    })

    it('deve lançar erro quando API falha', async () => {
      const mockError = new Error('API Error')
      mockedApi.post.mockRejectedValue(mockError)

      await expect(createGaragePlan(610, mockPlanData)).rejects.toThrow('Falha ao criar plano da garagem. Tente novamente.')
      expect(mockedLogger.error).toHaveBeenCalledWith('Error creating garage plan', { 
        error: mockError, 
        garageCode: 610, 
        planData: mockPlanData 
      })
      expect(console.error).toHaveBeenCalledWith('Erro ao criar plano da garagem 610:', mockError)
    })
  })

  describe('updateGaragePlan', () => {
    const mockPlanData: Partial<IPlans> = {
      description: 'Updated Plan',
      value: '150,00'
    }

    const mockUpdateResponse = {
      data: {
        success: true,
        message: 'Plan updated successfully',
        updated: mockPlanData,
        httpCode: 200
      }
    }

    it('deve atualizar plano com sucesso usando endpoint de garagem', async () => {
      mockedApi.put.mockResolvedValue(mockUpdateResponse)

      const result = await updateGaragePlan(610, 1, mockPlanData)

      expect(mockedApi.put).toHaveBeenCalledWith('/garages/610/plans/1', mockPlanData)
      expect(mockedLogger.info).toHaveBeenCalledWith('Updating garage plan', { 
        garageCode: 610, 
        planId: 1, 
        planData: mockPlanData 
      })
      expect(mockedLogger.info).toHaveBeenCalledWith('Plan updated successfully', { 
        garageCode: 610, 
        planId: 1, 
        message: 'Plan updated successfully',
        updated: mockPlanData 
      })
      expect(result).toEqual({ ...mockPlanData, id: 1, ...mockPlanData })
    })

    it('deve usar endpoint de fallback quando endpoint de garagem retorna 404', async () => {
      const mockError = { response: { status: 404 } }
      const mockFallbackPlan: IPlans = {
        id: 1,
        description: 'Updated Plan',
        value: '150,00',
        spaces: 10,
        spacesBusy: 0,
        spacesAvailable: 10,
        status: true
      }

      mockedApi.put
        .mockRejectedValueOnce(mockError)
        .mockResolvedValueOnce({ data: mockFallbackPlan })

      const result = await updateGaragePlan(610, 1, mockPlanData)

      expect(mockedApi.put).toHaveBeenCalledWith('/garages/610/plans/1', mockPlanData)
      expect(mockedApi.put).toHaveBeenCalledWith('/plans/1', mockPlanData)
      expect(mockedLogger.info).toHaveBeenCalledWith('Garage endpoint not available, using general plans endpoint as fallback', { 
        garageCode: 610, 
        planId: 1 
      })
      expect(result).toEqual(mockFallbackPlan)
    })

    it('deve lançar erro quando ambos endpoints falham', async () => {
      const mockError = { response: { status: 404 } }
      const mockFallbackError = new Error('Fallback failed')

      mockedApi.put
        .mockRejectedValueOnce(mockError)
        .mockRejectedValueOnce(mockFallbackError)

      await expect(updateGaragePlan(610, 1, mockPlanData)).rejects.toThrow('Falha ao atualizar plano. Endpoints não disponíveis.')
      expect(mockedLogger.error).toHaveBeenCalledWith('Fallback endpoint also failed', { 
        fallbackError: mockFallbackError, 
        garageCode: 610, 
        planId: 1, 
        planData: mockPlanData 
      })
    })

    it('deve lançar erro quando endpoint de garagem falha com erro não-404', async () => {
      const mockError = { response: { status: 500 } }
      mockedApi.put.mockRejectedValue(mockError)

      await expect(updateGaragePlan(610, 1, mockPlanData)).rejects.toThrow('Falha ao atualizar plano da garagem. Tente novamente.')
      expect(mockedLogger.error).toHaveBeenCalledWith('Error updating garage plan (non-404)', { 
        garageError: mockError, 
        garageCode: 610, 
        planId: 1, 
        planData: mockPlanData 
      })
    })

    it('deve lançar erro quando resposta não indica sucesso', async () => {
      const mockFailureResponse = {
        data: {
          success: false,
          message: 'Update failed',
          updated: {},
          httpCode: 400
        }
      }

      mockedApi.put.mockResolvedValue(mockFailureResponse)

      await expect(updateGaragePlan(610, 1, mockPlanData)).rejects.toThrow('Falha ao atualizar plano da garagem. Tente novamente.')
    })
  })
})