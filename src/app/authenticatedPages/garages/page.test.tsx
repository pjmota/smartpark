import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GaragesPage from './page';
import { fetchGarages } from '@/services/clientsService/clients.service';
import { toast } from 'react-toastify';

jest.mock('@/services/clientsService/clients.service', () => ({
  fetchGarages: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock('@/components/cards/GarageCards', () => {
  return function MockGarageFilterCard({ 
    enabled, 
    setEnabled, 
    search, 
    setSearch, 
    count, 
    onFiltersChange 
  }: any) {
    return (
      <div data-testid="garage-filter-card">
        <input
          data-testid="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou código"
        />
        <input
          data-testid="enabled-switch"
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        <span data-testid="count">{count} registros</span>
        <button
          data-testid="apply-filters"
          onClick={() => onFiltersChange({ search, digitalMonthlyPayer: enabled })}
        >
          Aplicar Filtros
        </button>
      </div>
    );
  };
});

jest.mock('@/components/modals/GarageModals/GarageDetailsModal', () => {
  return function MockGarageDrawer({ open, onClose, garage }: any) {
    if (!open) return null;
    return (
      <div data-testid="garage-drawer">
        <button data-testid="close-drawer" onClick={onClose}>
          Fechar
        </button>
        {garage && <div data-testid="garage-name">{garage.name}</div>}
      </div>
    );
  };
});

jest.mock('lucide-react', () => ({
  Building2: () => <div data-testid="building-icon">Building2</div>,
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  AlertCircle: () => <div data-testid="alert-icon">AlertCircle</div>,
}));

const mockGarages = [
  {
    code: 1,
    name: 'Garagem Centro',
    address: 'Rua A, 123',
    city: 'São Paulo',
    uf: 'SP',
    regional: 'Sul',
    neighborhood: 'Centro',
    branch: 'Filial 1',
    digitalMonthlyPayer: true,
    totalParkingSpace: 100,
    parkingSpaceBusy: 60,
    parkingSpaceAvailable: 40,
    plans: [],
  },
  {
    code: 2,
    name: 'Garagem Norte',
    address: 'Rua B, 456',
    city: 'Rio de Janeiro',
    uf: 'RJ',
    regional: 'Norte',
    neighborhood: 'Zona Norte',
    branch: 'Filial 2',
    digitalMonthlyPayer: false,
    totalParkingSpace: 80,
    parkingSpaceBusy: 30,
    parkingSpaceAvailable: 50,
    plans: [],
  },
];

describe('GaragesPage', () => {
  const mockFetchGarages = fetchGarages as jest.MockedFunction<typeof fetchGarages>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchGarages.mockResolvedValue(mockGarages);
  });

  it('deve renderizar a página corretamente', async () => {
    render(<GaragesPage />);
    
    expect(screen.getByText('Garagens')).toBeInTheDocument();
    expect(screen.getByText('Visualize as garagens habilitadas para mensalistas digitais.')).toBeInTheDocument();
    expect(screen.getByTestId('garage-filter-card')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Garagem Centro')).toBeInTheDocument();
      expect(screen.getByText('Garagem Norte')).toBeInTheDocument();
    });
  });

  it('deve carregar garagens inicialmente com filtro de mensalistas digitais', async () => {
    render(<GaragesPage />);
    
    await waitFor(() => {
      expect(mockFetchGarages).toHaveBeenCalledWith({ digitalMonthlyPayer: true });
    });
  });

  it('deve aplicar filtros quando onFiltersChange é chamado', async () => {
    render(<GaragesPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('apply-filters')).toBeInTheDocument();
    });

    const applyFiltersButton = screen.getByTestId('apply-filters');
    fireEvent.click(applyFiltersButton);
    
    await waitFor(() => {
      expect(mockFetchGarages).toHaveBeenCalledWith({ 
        search: '', 
        digitalMonthlyPayer: true 
      });
    });
  });

  it('deve aplicar filtro de busca', async () => {
    render(<GaragesPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Centro' } });
    
    const applyFiltersButton = screen.getByTestId('apply-filters');
    fireEvent.click(applyFiltersButton);
    
    await waitFor(() => {
      expect(mockFetchGarages).toHaveBeenCalledWith({ 
        search: 'Centro', 
        digitalMonthlyPayer: true 
      });
    });
  });

  it('deve alternar filtro de mensalistas digitais', async () => {
    render(<GaragesPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('enabled-switch')).toBeInTheDocument();
    });

    const enabledSwitch = screen.getByTestId('enabled-switch');
    fireEvent.click(enabledSwitch);
    
    const applyFiltersButton = screen.getByTestId('apply-filters');
    fireEvent.click(applyFiltersButton);
    
    await waitFor(() => {
      expect(mockFetchGarages).toHaveBeenCalledWith({ 
        search: '', 
        digitalMonthlyPayer: false 
      });
    });
  });

  it('deve exibir loading durante carregamento', () => {
    mockFetchGarages.mockImplementation(() => new Promise(() => {}));
    
    render(<GaragesPage />);
    
    expect(screen.getByText('Carregando garagens...')).toBeInTheDocument();
  });

  it('deve exibir erro quando falha ao carregar garagens', async () => {
    const errorMessage = 'Erro ao carregar garagens';
    mockFetchGarages.mockRejectedValue(new Error(errorMessage));
    
    render(<GaragesPage />);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
    
    expect(screen.getByText('Tentar novamente')).toBeInTheDocument();
  });

  it('deve tratar erro que não é instância de Error', async () => {
    mockFetchGarages.mockRejectedValue('Erro string');
    
    render(<GaragesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar garagens')).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith('Erro ao carregar garagens');
    });
  });

  it('deve exibir mensagem quando não há garagens', async () => {
    mockFetchGarages.mockResolvedValue([]);
    
    render(<GaragesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Nenhuma garagem disponível.')).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem quando busca não retorna resultados', async () => {
    mockFetchGarages.mockResolvedValue([]);
    
    render(<GaragesPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'inexistente' } });
    
    const applyFiltersButton = screen.getByTestId('apply-filters');
    fireEvent.click(applyFiltersButton);
    
    await waitFor(() => {
      expect(screen.getByText('Nenhuma garagem encontrada com o termo pesquisado.')).toBeInTheDocument();
    });
  });

  it('deve abrir modal de detalhes ao clicar no botão de visualizar', async () => {
    render(<GaragesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Garagem Centro')).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByTestId('eye-icon');
    fireEvent.click(viewButtons[0].closest('button')!);
    
    await waitFor(() => {
      expect(screen.getByTestId('garage-drawer')).toBeInTheDocument();
      expect(screen.getByTestId('garage-name')).toHaveTextContent('Garagem Centro');
    });
  });

  it('deve fechar modal de detalhes', async () => {
    render(<GaragesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Garagem Centro')).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByTestId('eye-icon');
    fireEvent.click(viewButtons[0].closest('button')!);
    
    await waitFor(() => {
      expect(screen.getByTestId('garage-drawer')).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId('close-drawer');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByTestId('garage-drawer')).not.toBeInTheDocument();
    });
  });

  it('deve exibir contagem correta de registros', async () => {
    render(<GaragesPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('count')).toHaveTextContent('2 registros');
    });
  });

  it('deve resetar página para 1 quando filtros mudam', async () => {
    const manyGarages = Array.from({ length: 25 }, (_, i) => ({
      code: i + 1,
      name: `Garagem ${i + 1}`,
      address: `Rua ${i + 1}`,
      city: 'São Paulo',
      uf: 'SP',
      regional: 'Sul',
      neighborhood: 'Centro',
      branch: 'Filial 1',
      digitalMonthlyPayer: true,
      totalParkingSpace: 100,
      parkingSpaceBusy: 50,
      parkingSpaceAvailable: 50,
      plans: [],
    }));
    
    mockFetchGarages.mockResolvedValue(manyGarages);
    
    render(<GaragesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Garagem 1')).toBeInTheDocument();
    });

    const pagination = screen.getByRole('navigation');
    const page2Button = pagination.querySelector('[aria-label="Go to page 2"]');
    if (page2Button) {
      fireEvent.click(page2Button);
    }

    const applyFiltersButton = screen.getByTestId('apply-filters');
    fireEvent.click(applyFiltersButton);
    
    await waitFor(() => {
      expect(mockFetchGarages).toHaveBeenCalled();
      expect(screen.getByText('Garagem 1')).toBeInTheDocument();
    });
  });

  it('deve exibir paginação quando há mais de 10 itens', async () => {
    const manyGarages = Array.from({ length: 15 }, (_, i) => ({
      code: i + 1,
      name: `Garagem ${i + 1}`,
      address: `Rua ${i + 1}`,
      city: 'São Paulo',
      uf: 'SP',
      regional: 'Sul',
      neighborhood: 'Centro',
      branch: 'Filial 1',
      digitalMonthlyPayer: true,
      totalParkingSpace: 100,
      parkingSpaceBusy: 50,
      parkingSpaceAvailable: 50,
      plans: [],
    }));
    
    mockFetchGarages.mockResolvedValue(manyGarages);
    
    render(<GaragesPage />);
    
    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  it('não deve exibir paginação quando há 10 ou menos itens', async () => {
    render(<GaragesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Garagem Centro')).toBeInTheDocument();
    });

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});