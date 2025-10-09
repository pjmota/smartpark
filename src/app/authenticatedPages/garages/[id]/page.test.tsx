import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GarageManagementPage from './page';
import { fetchGarageById } from '@/services/clientsService/clients.service';
import { toast } from 'react-toastify';
import { useParams, useRouter } from 'next/navigation';

jest.mock('@/services/clientsService/clients.service', () => ({
  fetchGarageById: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

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
            setTimeout(() => {
              if (onSaveInMemory) {
                onSaveInMemory();
              }
            }, 0);
          }}
        >
          Salvar
        </button>
        <div data-testid="garage-code">{garageCode}</div>
        <div data-testid="editing-plan">{plan?.name}</div>
      </div>
    );
  };
});

jest.mock('lucide-react', () => ({
  Building2: () => <div data-testid="building2-icon" />,
  MapPin: () => <div data-testid="mappin-icon" />,
  Building: () => <div data-testid="building-icon" />,
  ArrowLeft: () => <div data-testid="arrowleft-icon" />,
  Users: () => <div data-testid="users-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Edit: () => <div data-testid="edit-icon" />,
  ToggleLeft: () => <div data-testid="toggleleft-icon" />,
  ToggleRight: () => <div data-testid="toggleright-icon" />,
  AlertCircle: () => <div data-testid="alertcircle-icon" />,
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
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('60')).toBeInTheDocument();
      expect(screen.getByText('40')).toBeInTheDocument();
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

    await waitFor(() => {
      const planMensal = screen.getAllByText('Plano Mensal');
      const planDiario = screen.getAllByText('Plano Diário');
      expect(planMensal.length).toBeGreaterThan(0);
      expect(planDiario.length).toBeGreaterThan(0);
    }, { timeout: 5000 });

    await waitFor(() => {
      const valores150 = screen.getAllByText(/150\.00/);
      const valores15 = screen.getAllByText(/15\.00/);
      expect(valores150.length).toBeGreaterThan(0);
      expect(valores15.length).toBeGreaterThan(0);
    });
  });

  it('deve exibir loading durante carregamento', () => {
    mockFetchGarageById.mockImplementation(() => new Promise(() => {}));
    
    render(<GarageManagementPage />);
    
    expect(screen.getByText('Carregando dados da garagem...')).toBeInTheDocument();
  });

  it('deve exibir erro quando falha ao carregar garagem', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const errorMessage = 'Erro ao carregar dados da garagem';
    mockFetchGarageById.mockRejectedValue(new Error(errorMessage));
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(screen.getByText('Voltar')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('deve tratar erro que não é instância de Error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    mockFetchGarageById.mockRejectedValue('Erro string');
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar dados da garagem')).toBeInTheDocument();
    });
    
    consoleSpy.mockRestore();
  });

  it('deve navegar de volta quando botão voltar é clicado', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    mockFetchGarageById.mockRejectedValue(new Error('Erro'));
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Voltar')).toBeInTheDocument();
    });

    const backButton = screen.getByText('Voltar');
    fireEvent.click(backButton);
    
    expect(mockRouterBack).toHaveBeenCalled();
    
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
      .mockResolvedValueOnce(mockGarage)
      .mockResolvedValueOnce(mockGarage);
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Novo Plano')).toBeInTheDocument();
    });

    const newPlanButton = screen.getByText('Novo Plano');
    fireEvent.click(newPlanButton);
    
    const saveButton = screen.getByTestId('save-plan');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.queryByTestId('garage-plan-modal')).not.toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(mockFetchGarageById).toHaveBeenCalledTimes(2);
      expect(toast.success).toHaveBeenCalledWith('Dados da garagem atualizados com sucesso!');
    });
  });

  it('deve tratar erro ao recarregar dados após salvar plano', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ id: '1' });
    mockUseRouter.mockReturnValue({ back: mockRouterBack } as any);
    
    mockFetchGarageById
      .mockResolvedValueOnce(mockGarage)
      .mockRejectedValueOnce(new Error('Erro ao recarregar'));
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Novo Plano')).toBeInTheDocument();
    });

    const newPlanButton = screen.getByText('Novo Plano');
    fireEvent.click(newPlanButton);
    
    const saveButton = screen.getByTestId('save-plan');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.queryByTestId('garage-plan-modal')).not.toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao recarregar dados da garagem');
    });
    
    consoleSpy.mockRestore();
  });

  it('deve alternar status do plano inativo para ativo', async () => {
    mockFetchGarageById
      .mockResolvedValueOnce(mockGarage)
      .mockResolvedValueOnce(mockGarage);
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Plano Diário')).toBeInTheDocument();
    });

    const toggleButtons = screen.getAllByTestId('toggleleft-icon');
    fireEvent.click(toggleButtons[0].closest('button')!);
    
    await waitFor(() => {
      expect(mockFetchGarageById).toHaveBeenCalledTimes(2);
      expect(toast.success).toHaveBeenCalledWith('Status do plano alterado com sucesso!');
    });
  });

  it('deve alternar status do plano ativo para inativo', async () => {
    mockFetchGarageById
      .mockResolvedValueOnce(mockGarage)
      .mockResolvedValueOnce(mockGarage);
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Plano Mensal')).toBeInTheDocument();
    });

    const toggleButtons = screen.getAllByTestId('toggleright-icon');
    fireEvent.click(toggleButtons[0].closest('button')!);
    
    await waitFor(() => {
      expect(mockFetchGarageById).toHaveBeenCalledTimes(2);
      expect(toast.success).toHaveBeenCalledWith('Status do plano alterado com sucesso!');
    });
  });

  it('deve tratar erro ao alterar status do plano - erro no reload', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    mockFetchGarageById
      .mockResolvedValueOnce(mockGarage)
      .mockRejectedValueOnce(new Error('Erro ao recarregar'));
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Plano Mensal')).toBeInTheDocument();
    });

    const toggleButtons = screen.getAllByTestId('toggleright-icon');
    fireEvent.click(toggleButtons[0].closest('button')!);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao alterar status do plano');
    });
    
    consoleSpy.mockRestore();
  });

  it('deve tratar erro geral ao alterar status do plano', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const originalToastSuccess = toast.success;
    (toast.success as jest.Mock).mockImplementation(() => {
      throw new Error('Erro no toast');
    });
    
    mockFetchGarageById.mockResolvedValueOnce(mockGarage);
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Plano Mensal')).toBeInTheDocument();
    });

    const toggleButtons = screen.getAllByTestId('toggleright-icon');
    fireEvent.click(toggleButtons[0].closest('button')!);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao alterar status do plano');
    });
    
    (toast.success as jest.Mock).mockImplementation(originalToastSuccess);
    consoleSpy.mockRestore();
  });

  it('deve exibir mensagem quando não há planos disponíveis', async () => {
    const garageWithoutPlans = {
      ...mockGarage,
      plans: [],
    };
    
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ id: '1' });
    mockUseRouter.mockReturnValue({ back: mockRouterBack } as any);
    
    mockFetchGarageById.mockResolvedValueOnce(garageWithoutPlans);
    
    render(<GarageManagementPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Garagem Centro')).toBeInTheDocument();
    });
    
    const planoElements = screen.queryAllByText(/Plano/);
    expect(planoElements.length).toBe(0);
    
    const emptyMessages = screen.queryAllByText(/Nenhum plano|não há planos/i);
    expect(emptyMessages.length).toBeGreaterThan(0);
  });

  it('não deve fazer nada se garageId não estiver disponível', () => {
    mockUseParams.mockReturnValue({ id: undefined });
    
    render(<GarageManagementPage />);
    
    expect(mockFetchGarageById).not.toHaveBeenCalled();
  });
});