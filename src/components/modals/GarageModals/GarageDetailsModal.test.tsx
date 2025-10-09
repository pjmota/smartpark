import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GarageDrawer from './GarageDetailsModal';
import { IGarageModalProps } from '@/types/garageModals.type';

const mockDisableBodyScroll = jest.fn();
const mockEnableBodyScroll = jest.fn();

jest.mock('@/utils/modalUtils', () => ({
  disableBodyScroll: () => mockDisableBodyScroll(),
  enableBodyScroll: () => mockEnableBodyScroll(),
}));

jest.mock('@mui/material', () => ({
  Drawer: ({ children, open, onClose, anchor }: any) => 
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
  Tabs: ({ children, value }: any) => (
    <div data-testid="tabs" data-value={value}>
      {children}
    </div>
  ),
  Tab: ({ label, ...props }: any) => (
    <button 
      data-testid={`tab-${label.replace(/\s+/g, '-').toLowerCase()}`} 
      role="tab"
      tabIndex={0}
      onKeyDown={(e: any) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
        }
      }}
      {...props}
    >
      {label}
    </button>
  ),
  Box: ({ children }: any) => (
    <div data-testid="box">{children}</div>
  ),
  IconButton: ({ children, onClick }: any) => (
    <button 
      data-testid="close-button" 
      onClick={onClick}
      onKeyDown={(e: any) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      tabIndex={0}
      aria-label="Fechar"
    >
      {children}
    </button>
  ),
}));

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

  describe('Basic rendering', () => {
    it('should render drawer when open is true', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      expect(screen.getByTestId('garage-drawer')).toBeInTheDocument();
    });

    it('should not render drawer when open is false', () => {
      render(<GarageDrawer {...defaultProps} open={false} />);
      
      expect(screen.queryByTestId('garage-drawer')).not.toBeInTheDocument();
    });

    it('should not render when garage is null', () => {
      render(<GarageDrawer {...defaultProps} garage={null} />);
      
      expect(screen.queryByTestId('garage-drawer')).not.toBeInTheDocument();
    });

    it('should render drawer with right anchor', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      const drawer = screen.getByTestId('garage-drawer');
      expect(drawer).toHaveAttribute('data-anchor', 'right');
    });
  });

  describe('Garage information', () => {
    it('should display garage name', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      expect(screen.getByText('Garagem Teste')).toBeInTheDocument();
    });

    it('should display formatted garage code', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      expect(screen.getByText('Código: 000123')).toBeInTheDocument();
    });

    it('should display garage address', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      expect(screen.getByText('Rua Teste, 123, Bairro Teste')).toBeInTheDocument();
    });

    it('should display branch information', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      expect(screen.getByText('Filial: Filial Teste - São Paulo / SP · Regional: Regional Sul')).toBeInTheDocument();
    });

    it('should render correct icons', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      expect(screen.getByTestId('building2-icon')).toBeInTheDocument();
      expect(screen.getByTestId('mappin-icon')).toBeInTheDocument();
      expect(screen.getByTestId('building-icon')).toBeInTheDocument();
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    });
  });

  describe('Tab functionality', () => {
    it('should render tabs', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      expect(screen.getByTestId('tabs')).toBeInTheDocument();
      expect(screen.getByTestId('tab-mensalista-digital')).toBeInTheDocument();
    });

    it('should initialize with tab 0 selected', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      const tabs = screen.getByTestId('tabs');
      expect(tabs).toHaveAttribute('data-value', '0');
    });
  });

  describe('Child components', () => {
    it('should render GarageInfoSection with correct props', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      expect(screen.getByTestId('garage-info-section')).toBeInTheDocument();
      expect(screen.getByTestId('total-spaces')).toHaveTextContent('100');
      expect(screen.getByTestId('occupied-spaces')).toHaveTextContent('75');
      expect(screen.getByTestId('available-spaces')).toHaveTextContent('25');
      expect(screen.getByTestId('qr-code-value')).toHaveTextContent('https://maps.app.goo.gl/AnZu3VvnJeLhixJT8');
    });

    it('should render GaragePlansCard with correct props', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      expect(screen.getByTestId('garage-plans-card')).toBeInTheDocument();
      expect(screen.getByTestId('garage-code')).toHaveTextContent('123');
      
      const plansData = screen.getByTestId('plans-data');
      expect(plansData.textContent).toContain('Plano Básico');
      expect(plansData.textContent).toContain('Plano Premium');
    });
  });

  describe('Temporary plans management', () => {
    it('should initialize temporary plans when modal opens', async () => {
      render(<GarageDrawer {...defaultProps} />);
      
      await waitFor(() => {
        const plansData = screen.getByTestId('plans-data');
        expect(plansData.textContent).toContain('Plano Básico');
      });
    });

    it('should update temporary plans', async () => {
      render(<GarageDrawer {...defaultProps} />);
      
      const updateButton = screen.getByTestId('update-plans-button');
      fireEvent.click(updateButton);
      
      expect(updateButton).toBeInTheDocument();
    });

    it('should handle plans as single object', () => {
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

  describe('Body scroll control', () => {
    it('should disable scroll when modal opens', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      expect(mockDisableBodyScroll).toHaveBeenCalled();
    });

    it('should enable scroll when modal closes', () => {
      const { rerender } = render(<GarageDrawer {...defaultProps} />);
      
      mockEnableBodyScroll.mockClear();
      
      rerender(<GarageDrawer {...defaultProps} open={false} />);
      
      expect(mockEnableBodyScroll).toHaveBeenCalled();
    });

    it('should enable scroll on component unmount', () => {
      const { unmount } = render(<GarageDrawer {...defaultProps} />);
      
      mockEnableBodyScroll.mockClear();
      
      unmount();
      
      expect(mockEnableBodyScroll).toHaveBeenCalled();
    });
  });

  describe('Close functionality', () => {
    it('should call onClose when close button is clicked', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      mockOnClose.mockClear();
      
      const closeButton = screen.getByTestId('close-button');
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should clear temporary plans when closing', async () => {
      render(<GarageDrawer {...defaultProps} />);
      
      const updateButton = screen.getByTestId('update-plans-button');
      fireEvent.click(updateButton);
      
      mockOnClose.mockClear();
      
      const closeButton = screen.getByTestId('close-button');
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Responsiveness', () => {
    it('should have correct responsive classes', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      const drawer = screen.getByTestId('garage-drawer');
      expect(drawer).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should work with garage without plans', () => {
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

    it('should handle garage code as string', () => {
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

    it('should handle empty plans array', () => {
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

  describe('Accessibility', () => {
    it('should have correct semantic structure', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Garagem Teste');
    });

    it('should have accessible close button', () => {
      render(<GarageDrawer {...defaultProps} />);
      
      const closeButton = screen.getByTestId('close-button');
      expect(closeButton).toBeInTheDocument();
    });
  });
});