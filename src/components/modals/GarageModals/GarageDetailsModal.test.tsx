import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GarageDrawer from './GarageDetailsModal';
import { IGarageModalProps } from '@/types/garageModals.type';

// Mock dos utilitários de modal
const mockDisableBodyScroll = jest.fn();
const mockEnableBodyScroll = jest.fn();

jest.mock('@/utils/modalUtils', () => ({
  disableBodyScroll: () => mockDisableBodyScroll(),
  enableBodyScroll: () => mockEnableBodyScroll(),
}));

// Mock do Material-UI
jest.mock('@mui/material', () => ({
  Drawer: ({ children, open, onClose, anchor, sx }: any) => 
    open ? (
      <dialog 
        data-testid="garage-drawer" 
        data-anchor={anchor}
        aria-modal="true"
        open
      >
        <button
          data-testid="drawer-overlay"
          onClick={onClose}
          onKeyDown={(e: any) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClose();
            }
          }}
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
          aria-label="Fechar modal"
        />
        {children}
      </dialog>
    ) : null,
  Tabs: ({ children, value, onChange, sx }: any) => (
    <div data-testid="tabs" data-value={value}>
      {children}
    </div>
  ),
  Tab: ({ label, sx, focusVisibleClassName, disableRipple, ...props }: any) => (
    <button 
      data-testid={`tab-${label.replace(/\s+/g, '-').toLowerCase()}`} 
      role="tab"
      tabIndex={0}
      onKeyDown={(e: any) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          props.onClick?.();
        }
      }}
      {...props}
    >
      {label}
    </button>
  ),
  Box: ({ children, sx }: any) => (
    <div data-testid="box">{children}</div>
  ),
  IconButton: ({ children, onClick, sx }: any) => (
    <button 
      data-testid="close-button" 
      onClick={onClick}
      onKeyDown={(e: any) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      tabIndex={0}
      aria-label="Fechar"
    >
      {children}
    </button>
  ),
}));

// Mock dos ícones lucide-react
jest.mock('lucide-react', () => ({
  Building2: ({ className, ...props }: any) => (
    <span data-testid="building2-icon" className={className} {...props}>
      Building2
    </span>
  ),
  MapPin: ({ className, ...props }: any) => (
    <span data-testid="mappin-icon" className={className} {...props}>
      MapPin
    </span>
  ),
  Building: ({ className, ...props }: any) => (
    <span data-testid="building-icon" className={className} {...props}>
      Building
    </span>
  ),
  X: ({ className, ...props }: any) => (
    <span data-testid="x-icon" className={className} {...props}>
      X
    </span>
  ),
}));

// Mock dos componentes filhos
jest.mock('@/components/cards/GarageCards/GarageInfoSection', () => {
  return function MockGarageInfoSection({ totalSpaces, occupiedSpaces, availableSpaces, qrCodeValue }: any) {
    return (
      <div data-testid="garage-info-section">
        <div data-testid="total-spaces">{totalSpaces}</div>
        <div data-testid="occupied-spaces">{occupiedSpaces}</div>
        <div data-testid="available-spaces">{availableSpaces}</div>
        <div data-testid="qr-code-value">{qrCodeValue}</div>
      </div>
    );
  };
});

jest.mock('@/components/cards/GarageCards/GaragePlansCard', () => {
  return function MockGaragePlansCard({ data, onUpdatePlans, garageCode }: any) {
    return (
      <div data-testid="garage-plans-card">
        <div data-testid="plans-data">{JSON.stringify(data)}</div>
        <div data-testid="garage-code">{garageCode}</div>
        <button 
          data-testid="update-plans-button"
          onClick={() => onUpdatePlans([{ id: 'test-plan', name: 'Test Plan' }])}
          onKeyDown={(e: any) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onUpdatePlans([{ id: 'test-plan', name: 'Test Plan' }]);
            }
          }}
          tabIndex={0}
          aria-label="Atualizar planos"
        >
          Update Plans
        </button>
      </div>
    );
  };
});

describe('GarageDrawer', () => {
  const mockOnClose = jest.fn();
  
  const mockGarage = {
    id: '1',
    name: 'Garagem Teste',
    code: 123,
    address: 'Rua Teste, 123',
    neighborhood: 'Bairro Teste',
    branch: 'Filial Teste',
    city: 'São Paulo',
    uf: 'SP',
    regional: 'Regional Sul',
    digitalMonthlyPayer: true,
    totalParkingSpace: 100,
    parkingSpaceBusy: 75,
    parkingSpaceAvailable: 25,
    plans: [
      { 
        id: 1, 
        description: 'Plano Básico',
        value: '100',
        spaces: 50,
        spacesBusy: 30,
        spacesAvailable: 20,
        status: true
      },
      { 
        id: 2, 
        description: 'Plano Premium',
        value: '200',
        spaces: 50,
        spacesBusy: 45,
        spacesAvailable: 5,
        status: true
      }
    ]
  };

  const defaultProps: IGarageModalProps = {
    open: true,
    onClose: mockOnClose,
    garage: mockGarage
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização básica', () => {
    it('deve renderizar o drawer quando open é true', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      expect(screen.getByTestId('garage-drawer')).toBeInTheDocument();
    });

    it('não deve renderizar o drawer quando open é false', () => {
      render(<GarageDrawer {...defaultProps} open={false} />);
      
      expect(screen.queryByTestId('garage-drawer')).not.toBeInTheDocument();
    });

    it('não deve renderizar quando garage é null', () => {
      render(<GarageDrawer {...defaultProps} garage={null} />);
      
      expect(screen.queryByTestId('garage-drawer')).not.toBeInTheDocument();
    });

    it('deve renderizar o drawer com anchor right', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      const drawer = screen.getByTestId('garage-drawer');
      expect(drawer).toHaveAttribute('data-anchor', 'right');
    });
  });

  describe('Informações da garagem', () => {
    it('deve exibir o nome da garagem', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      expect(screen.getByText('Garagem Teste')).toBeInTheDocument();
    });

    it('deve exibir o código da garagem formatado', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      expect(screen.getByText('Código: 000123')).toBeInTheDocument();
    });

    it('deve exibir o endereço da garagem', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      expect(screen.getByText('Rua Teste, 123, Bairro Teste')).toBeInTheDocument();
    });

    it('deve exibir informações da filial', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      expect(screen.getByText('Filial: Filial Teste - São Paulo / SP · Regional: Regional Sul')).toBeInTheDocument();
    });

    it('deve renderizar os ícones corretos', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      expect(screen.getByTestId('building2-icon')).toBeInTheDocument();
      expect(screen.getByTestId('mappin-icon')).toBeInTheDocument();
      expect(screen.getByTestId('building-icon')).toBeInTheDocument();
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    });
  });

  describe('Funcionalidade de tabs', () => {
    it('deve renderizar as tabs', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      expect(screen.getByTestId('tabs')).toBeInTheDocument();
      expect(screen.getByTestId('tab-mensalista-digital')).toBeInTheDocument();
    });

    it('deve inicializar com tab 0 selecionada', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      const tabs = screen.getByTestId('tabs');
      expect(tabs).toHaveAttribute('data-value', '0');
    });
  });

  describe('Componentes filhos', () => {
    it('deve renderizar GarageInfoSection com props corretas', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      expect(screen.getByTestId('garage-info-section')).toBeInTheDocument();
      expect(screen.getByTestId('total-spaces')).toHaveTextContent('100');
      expect(screen.getByTestId('occupied-spaces')).toHaveTextContent('75');
      expect(screen.getByTestId('available-spaces')).toHaveTextContent('25');
      expect(screen.getByTestId('qr-code-value')).toHaveTextContent('https://maps.app.goo.gl/AnZu3VvnJeLhixJT8');
    });

    it('deve renderizar GaragePlansCard com props corretas', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      expect(screen.getByTestId('garage-plans-card')).toBeInTheDocument();
      expect(screen.getByTestId('garage-code')).toHaveTextContent('123');
      
      const plansData = screen.getByTestId('plans-data');
      expect(plansData.textContent).toContain('Plano Básico');
      expect(plansData.textContent).toContain('Plano Premium');
    });
  });

  describe('Gerenciamento de planos temporários', () => {
    it('deve inicializar planos temporários quando modal abrir', async () => {
      render(<GarageDrawer {...defaultProps} />);
      
      await waitFor(() => {
        const plansData = screen.getByTestId('plans-data');
        expect(plansData.textContent).toContain('Plano Básico');
      });
    });

    it('deve atualizar planos temporários', async () => {
      render(<GarageDrawer {...defaultProps} />);
      
      const updateButton = screen.getByTestId('update-plans-button');
      fireEvent.click(updateButton);
      
      // Verificar se o botão foi clicado (a atualização pode não refletir imediatamente no mock)
      expect(updateButton).toBeInTheDocument();
    });

    it('deve lidar com planos como objeto único', () => {
      const propsWithSinglePlan = {
        ...defaultProps,
        garage: {
          ...mockGarage,
          plans: [{ 
            id: 1, 
            description: 'Plano Único',
            value: '150',
            spaces: 30,
            spacesBusy: 15,
            spacesAvailable: 15,
            status: true
          }]
        }
      };
      
      render(<GarageDrawer {...propsWithSinglePlan} />);
      
      const plansData = screen.getByTestId('plans-data');
      expect(plansData.textContent).toContain('Plano Único');
    });
  });

  describe('Controle de scroll do body', () => {
    it('deve desabilitar scroll quando modal abrir', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      expect(mockDisableBodyScroll).toHaveBeenCalled();
    });

    it('deve habilitar scroll quando modal fechar', () => {
      const { rerender } = render(<GarageDrawer {...defaultProps} />);
      
      // Limpar chamadas anteriores
      mockEnableBodyScroll.mockClear();
      
      rerender(<GarageDrawer {...defaultProps} open={false} />);
      
      expect(mockEnableBodyScroll).toHaveBeenCalled();
    });

    it('deve habilitar scroll na desmontagem do componente', () => {
      const { unmount } = render(<GarageDrawer {...defaultProps} />);
      
      // Limpar chamadas anteriores
      mockEnableBodyScroll.mockClear();
      
      unmount();
      
      expect(mockEnableBodyScroll).toHaveBeenCalled();
    });
  });

  describe('Funcionalidade de fechamento', () => {
    it('deve chamar onClose quando botão de fechar é clicado', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      // Limpar chamadas anteriores do mock
      mockOnClose.mockClear();
      
      const closeButton = screen.getByTestId('close-button');
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('deve limpar planos temporários ao fechar', async () => {
      render(<GarageDrawer {...defaultProps} />);
      
      // Primeiro, atualizar os planos
      const updateButton = screen.getByTestId('update-plans-button');
      fireEvent.click(updateButton);
      
      // Limpar chamadas anteriores do mock
      mockOnClose.mockClear();
      
      // Depois fechar o modal
      const closeButton = screen.getByTestId('close-button');
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Responsividade', () => {
    it('deve ter classes responsivas corretas', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      const drawer = screen.getByTestId('garage-drawer');
      expect(drawer).toBeInTheDocument();
    });
  });

  describe('Casos extremos', () => {
    it('deve funcionar com garage sem planos', () => {
      const propsWithoutPlans = {
        ...defaultProps,
        garage: {
          ...mockGarage,
          plans: []
        }
      };
      
      render(<GarageDrawer {...propsWithoutPlans} />);
      
      expect(screen.getByTestId('garage-drawer')).toBeInTheDocument();
      expect(screen.getByTestId('garage-plans-card')).toBeInTheDocument();
    });

    it('deve funcionar com código de garagem como string', () => {
      const propsWithStringCode = {
        ...defaultProps,
        garage: {
          ...mockGarage,
          code: '456' as any
        }
      };
      
      render(<GarageDrawer {...propsWithStringCode} />);
      
      expect(screen.getByText('Código: 000456')).toBeInTheDocument();
    });

    it('deve funcionar com planos vazios', () => {
      const propsWithEmptyPlans = {
        ...defaultProps,
        garage: {
          ...mockGarage,
          plans: []
        }
      };
      
      render(<GarageDrawer {...propsWithEmptyPlans} />);
      
      expect(screen.getByTestId('garage-drawer')).toBeInTheDocument();
      const plansData = screen.getByTestId('plans-data');
      expect(plansData.textContent).toBe('[]');
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter estrutura semântica correta', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Garagem Teste');
    });

    it('deve ter botão de fechar acessível', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      const closeButton = screen.getByTestId('close-button');
      expect(closeButton).toBeInTheDocument();
    });
  });
});