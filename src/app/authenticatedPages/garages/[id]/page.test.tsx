import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GarageManagementPage from './page';
import { fetchGarageById } from '@/services/clientsService/clients.service';
import { toast } from 'react-toastify';
import { useParams, useRouter } from 'next/navigation';

// Mock dos serviços
jest.mock('@/services/clientsService/clients.service', () => ({
  fetchGarageById: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock do Next.js
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock dos componentes
jest.mock('@/components/modals/GarageModals/GaragePlanModal', () => {
  return function MockGaragePlanModal({ 
    open, 
    onClose, 
    plan, 
    garageCode, 
    onSaveInMemory 
  }: any) {
    if (!open) return null;
    return (
      <div data-testid="garage-plan-modal">
        <button data-testid="close-modal" onClick={onClose}>
          Fechar
        </button>
        <button 
          data-testid="save-plan" 
          onClick={() => {
            // Simular comportamento assíncrono do modal real
            setTimeout(() => {
              if (onSaveInMemory) {
                onSaveInMemory();
              }
            }, 0);
          }}
        >
          Salvar
        </button>
        {plan && <div data-testid="editing-plan">{plan.description}</div>}
        {garageCode && <div data-testid="garage-code">{garageCode}</div>}
      </div>
    );
  };
});

// Mock dos ícones
jest.mock('lucide-react', () => ({
  Building2: () => <span data-testid="building2-icon">Building2</span>,
  MapPin: () => <span data-testid="mappin-icon">MapPin</span>,
  Building: () => <span data-testid="building-icon">Building</span>,
  ArrowLeft: () => <span data-testid="arrow-left-icon">ArrowLeft</span>,
  Users: () => <span data-testid="users-icon">Users</span>,
  Plus: () => <span data-testid="plus-icon">Plus</span>,
  Edit: () => <span data-testid="edit-icon">Edit</span>,
  ToggleLeft: () => <span data-testid="toggle-left-icon">ToggleLeft</span>,
  ToggleRight: () => <span data-testid="toggle-right-icon">ToggleRight</span>,
  AlertCircle: () => <span data-testid="alert-circle-icon">AlertCircle</span>,
}));

const mockGarage = {
  code: 123,
  name: 'Garagem Centro',
  address: 'Rua A, 123',
  neighborhood: 'Centro',
  city: 'São Paulo',
  uf: 'SP',
  branch: 'Filial 1',
  regional: 'Sul',
  digitalMonthlyPayer: true,
  totalParkingSpace: 100,
  parkingSpaceBusy: 60,
  parkingSpaceAvailable: 40,
  plans: [
    {
      id: 1,
      description: 'Plano Mensal',
      type: 'monthly',
      value: '150.00',
      spaces: 50,
      spacesBusy: 30,
      spacesAvailable: 20,
      status: true,
    },
    {
      id: 2,
      description: 'Plano Diário',
      type: 'daily',
      value: '15.00',
      spaces: 30,
      spacesBusy: 20,
      spacesAvailable: 10,
      status: false,
    },
  ],
};

describe('GarageManagementPage', () => {
  const mockFetchGarageById = fetchGarageById as jest.MockedFunction<typeof fetchGarageById>;
  const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
  const mockRouterBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ id: '123' });
    mockUseRouter.mockReturnValue({ back: mockRouterBack } as any);
    // Não configurar o mock aqui - deixar para cada teste específico
  });

  it('deve renderizar a página corretamente com dados da garagem', async () => {
    mockFetchGarageById.mockResolvedValueOnce(mockGarage);
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Garagem Centro')).toBeInTheDocument();
    });

    expect(screen.getByText('Código: 000123')).toBeInTheDocument();
    expect(screen.getByText('Informações Gerais')).toBeInTheDocument();
    expect(screen.getByText('Rua A, 123, Centro')).toBeInTheDocument();
    expect(screen.getByText('São Paulo / SP')).toBeInTheDocument();
    expect(screen.getByText('Filial 1')).toBeInTheDocument();
    expect(screen.getByText('Sul')).toBeInTheDocument();
  });

  it('deve exibir estatísticas de vagas corretamente', async () => {
    mockFetchGarageById.mockResolvedValueOnce(mockGarage);
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument(); // Total de vagas
      expect(screen.getByText('60')).toBeInTheDocument(); // Vagas ocupadas
      expect(screen.getByText('40')).toBeInTheDocument(); // Vagas disponíveis
    });

    expect(screen.getByText('Total de Vagas')).toBeInTheDocument();
    expect(screen.getByText('Vagas Ocupadas')).toBeInTheDocument();
    expect(screen.getByText('Vagas Disponíveis')).toBeInTheDocument();
  });

  it('deve exibir planos disponíveis', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    mockUseRouter.mockReturnValue({ back: mockRouterBack } as any);
    mockFetchGarageById.mockResolvedValueOnce(mockGarage);
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Planos Disponíveis')).toBeInTheDocument();
    });

    // Verificar se os planos estão sendo renderizados (podem estar na versão mobile)
    await waitFor(() => {
      const planMensal = screen.getAllByText('Plano Mensal');
      const planDiario = screen.getAllByText('Plano Diário');
      expect(planMensal.length).toBeGreaterThan(0);
      expect(planDiario.length).toBeGreaterThan(0);
    }, { timeout: 5000 });

    // Verificar valores (podem estar em formato diferente na versão mobile)
    await waitFor(() => {
      const valores150 = screen.getAllByText(/150\.00/);
      const valores15 = screen.getAllByText(/15\.00/);
      expect(valores150.length).toBeGreaterThan(0);
      expect(valores15.length).toBeGreaterThan(0);
    });
  });

  it('deve exibir loading durante carregamento', () => {
    mockFetchGarageById.mockImplementation(() => new Promise(() => {})); // Promise que nunca resolve
    
    render(<GarageManagementPage />);
    
    expect(screen.getByText('Carregando dados da garagem...')).toBeInTheDocument();
  });

  it('deve exibir erro quando falha ao carregar garagem', async () => {
    // Suprimir console.error para este teste específico
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const errorMessage = 'Erro ao carregar dados da garagem';
    mockFetchGarageById.mockRejectedValue(new Error(errorMessage));
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(screen.getByText('Voltar')).toBeInTheDocument();
    
    // Restaurar console.error
    consoleSpy.mockRestore();
  });

  it('deve tratar erro que não é instância de Error', async () => {
    // Suprimir console.error para este teste específico
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    mockFetchGarageById.mockRejectedValue('Erro string');
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar dados da garagem')).toBeInTheDocument();
    });
    
    // Restaurar console.error
    consoleSpy.mockRestore();
  });

  it('deve exibir mensagem quando garagem não é encontrada', async () => {
    // Suprimir console.error para este teste específico
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    mockFetchGarageById.mockRejectedValue(new Error('Garagem não encontrada'));
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Garagem não encontrada')).toBeInTheDocument();
    });
    
    // Restaurar console.error
    consoleSpy.mockRestore();
  });

  it('deve voltar para página anterior ao clicar no botão voltar', async () => {
    mockFetchGarageById.mockResolvedValueOnce(mockGarage);
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Garagem Centro')).toBeInTheDocument();
    });

    const backButton = screen.getAllByTestId('arrow-left-icon')[0].closest('button');
    fireEvent.click(backButton!);
    
    expect(mockRouterBack).toHaveBeenCalled();
  });

  it('deve voltar para página anterior quando há erro', async () => {
    // Suprimir console.error para este teste específico
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    mockFetchGarageById.mockRejectedValue(new Error('Erro'));
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Voltar')).toBeInTheDocument();
    });

    const backButton = screen.getByText('Voltar');
    fireEvent.click(backButton);
    
    expect(mockRouterBack).toHaveBeenCalled();
    
    // Restaurar console.error
    consoleSpy.mockRestore();
  });

  it('deve abrir modal para criar novo plano', async () => {
    mockFetchGarageById.mockResolvedValueOnce(mockGarage);
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Novo Plano')).toBeInTheDocument();
    });

    const newPlanButton = screen.getByText('Novo Plano');
    fireEvent.click(newPlanButton);
    
    expect(screen.getByTestId('garage-plan-modal')).toBeInTheDocument();
    expect(screen.getByTestId('garage-code')).toHaveTextContent('123');
  });

  it('deve abrir modal para editar plano existente', async () => {
    mockFetchGarageById.mockResolvedValueOnce(mockGarage);
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      const planoMensalElements = screen.getAllByText('Plano Mensal');
      expect(planoMensalElements.length).toBeGreaterThan(0);
      expect(planoMensalElements[0]).toBeInTheDocument();
    });

    const editButtons = screen.getAllByTestId('edit-icon');
    fireEvent.click(editButtons[0].closest('button')!);
    
    expect(screen.getByTestId('garage-plan-modal')).toBeInTheDocument();
    expect(screen.getByTestId('editing-plan')).toHaveTextContent('Plano Mensal');
  });

  it('deve fechar modal de plano', async () => {
    mockFetchGarageById.mockResolvedValueOnce(mockGarage);
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Novo Plano')).toBeInTheDocument();
    });

    const newPlanButton = screen.getByText('Novo Plano');
    fireEvent.click(newPlanButton);
    
    expect(screen.getByTestId('garage-plan-modal')).toBeInTheDocument();

    const closeButton = screen.getByTestId('close-modal');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByTestId('garage-plan-modal')).not.toBeInTheDocument();
    });
  });

  it('deve salvar plano e recarregar dados da garagem', async () => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ id: '1' });
    mockUseRouter.mockReturnValue({ back: mockRouterBack } as any);
    
    mockFetchGarageById
      .mockResolvedValueOnce(mockGarage) // Carregamento inicial
      .mockResolvedValueOnce(mockGarage); // Reload após salvar
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Novo Plano')).toBeInTheDocument();
    });

    const newPlanButton = screen.getByText('Novo Plano');
    fireEvent.click(newPlanButton);
    
    const saveButton = screen.getByTestId('save-plan');
    fireEvent.click(saveButton);
    
    // Aguardar que o modal seja fechado e os dados recarregados
    await waitFor(() => {
      expect(screen.queryByTestId('garage-plan-modal')).not.toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(mockFetchGarageById).toHaveBeenCalledTimes(2); // Carregamento inicial + reload
      expect(toast.success).toHaveBeenCalledWith('Dados da garagem atualizados com sucesso!');
    });
  });

  it('deve tratar erro ao recarregar dados após salvar plano', async () => {
    // Suprimir console.error para este teste específico
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ id: '1' });
    mockUseRouter.mockReturnValue({ back: mockRouterBack } as any);
    
    mockFetchGarageById
      .mockResolvedValueOnce(mockGarage) // Carregamento inicial
      .mockRejectedValueOnce(new Error('Erro ao recarregar')); // Erro no reload
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Novo Plano')).toBeInTheDocument();
    });

    const newPlanButton = screen.getByText('Novo Plano');
    fireEvent.click(newPlanButton);
    
    const saveButton = screen.getByTestId('save-plan');
    fireEvent.click(saveButton);
    
    // Aguardar que o modal seja fechado
    await waitFor(() => {
      expect(screen.queryByTestId('garage-plan-modal')).not.toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao recarregar dados da garagem');
    });
    
    // Restaurar console.error
    consoleSpy.mockRestore();
  });

  it('deve alternar status do plano (ativar)', async () => {
    mockFetchGarageById.mockResolvedValueOnce(mockGarage);
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      const planoDiarioElements = screen.getAllByText('Plano Diário');
      expect(planoDiarioElements.length).toBeGreaterThan(0);
      expect(planoDiarioElements[0]).toBeInTheDocument();
    });

    // Encontrar o plano inativo (Plano Diário) e clicar no toggle
    const toggleButtons = screen.getAllByTestId('toggle-left-icon');
    fireEvent.click(toggleButtons[0].closest('button')!);
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Plano ativado com sucesso!');
      expect(mockFetchGarageById).toHaveBeenCalledTimes(2); // Carregamento inicial + reload
    });
  });

  it('deve alternar status do plano (desativar)', async () => {
    mockFetchGarageById.mockResolvedValueOnce(mockGarage);
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      const planoMensalElements = screen.getAllByText('Plano Mensal');
      expect(planoMensalElements.length).toBeGreaterThan(0);
      expect(planoMensalElements[0]).toBeInTheDocument();
    });

    // Encontrar o plano ativo (Plano Mensal) e clicar no toggle
    const toggleButtons = screen.getAllByTestId('toggle-right-icon');
    fireEvent.click(toggleButtons[0].closest('button')!);
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Plano desativado com sucesso!');
      expect(mockFetchGarageById).toHaveBeenCalledTimes(2); // Carregamento inicial + reload
    });
  });

  it('deve tratar erro ao alterar status do plano', async () => {
    // Mock console.error para evitar logs no teste
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    // Simular erro na função handleTogglePlanStatus
    mockFetchGarageById
      .mockResolvedValueOnce(mockGarage) // Carregamento inicial
      .mockRejectedValueOnce(new Error('Erro ao recarregar')); // Erro no reload
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      const planoMensalElements = screen.getAllByText('Plano Mensal');
      expect(planoMensalElements.length).toBeGreaterThan(0);
      expect(planoMensalElements[0]).toBeInTheDocument();
    });

    const toggleButtons = screen.getAllByTestId('toggle-right-icon');
    fireEvent.click(toggleButtons[0].closest('button')!);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao recarregar dados da garagem');
    });

    consoleSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  it('deve tratar erro geral ao alterar status do plano', async () => {
    // Mock console.error para evitar logs no teste
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    // Simular erro geral na função handleTogglePlanStatus
    // Fazer o toast.success falhar para ativar o catch principal
    const originalToastSuccess = toast.success;
    toast.success = jest.fn().mockImplementation(() => {
      throw new Error('Erro no toast');
    });
    
    mockFetchGarageById.mockResolvedValueOnce(mockGarage); // Carregamento inicial
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      const planoMensalElements = screen.getAllByText('Plano Mensal');
      expect(planoMensalElements.length).toBeGreaterThan(0);
      expect(planoMensalElements[0]).toBeInTheDocument();
    });

    const toggleButtons = screen.getAllByTestId('toggle-right-icon');
    fireEvent.click(toggleButtons[0].closest('button')!);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao alterar status do plano');
    });

    // Restaurar o toast.success original
    toast.success = originalToastSuccess;
    consoleSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  it('não deve carregar garagem se garageId não estiver presente', () => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ id: undefined });
    mockUseRouter.mockReturnValue({ back: mockRouterBack } as any);
    
    render(<GarageManagementPage />);
    
    expect(mockFetchGarageById).not.toHaveBeenCalled();
  });

  it('deve exibir planos sem dados quando não há planos', async () => {
    const garageWithoutPlans = {
      ...mockGarage,
      plans: []
    };
    
    // Limpar completamente o mock e configurar apenas para este teste
    jest.resetAllMocks();
    mockUseParams.mockReturnValue({ id: '123' });
    mockUseRouter.mockReturnValue({ back: mockRouterBack } as any);
    mockFetchGarageById.mockResolvedValueOnce(garageWithoutPlans);
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Garagem Centro')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Verificar se não há planos exibidos
    const planoMensalElements = screen.queryAllByText('Plano Mensal');
    const planoDiarioElements = screen.queryAllByText('Plano Diário');
    
    expect(planoMensalElements).toHaveLength(0);
    expect(planoDiarioElements).toHaveLength(0);
    
    // Verificar se a mensagem de planos vazios está presente (pode aparecer em desktop e mobile)
    const noPlansMessages = screen.getAllByText(/nenhum plano cadastrado/i);
    expect(noPlansMessages.length).toBeGreaterThan(0);
    expect(noPlansMessages[0]).toBeInTheDocument();
  });

  it('deve testar handleTogglePlanStatus sem garageId', async () => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ id: undefined });
    mockUseRouter.mockReturnValue({ back: mockRouterBack } as any);
    
    render(<GarageManagementPage />);
    
    // Como não há garageId, a função não deve fazer nada
    expect(mockFetchGarageById).not.toHaveBeenCalled();
  });
});