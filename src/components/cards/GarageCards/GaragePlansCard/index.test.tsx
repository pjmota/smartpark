import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GaragePlansCard from './index';
import { IPlans } from '@/types/clients.type';

jest.mock('../../../modals/GarageModals/GaragePlanModal', () => {
  return function MockPlanModal(props: any) {
    const isEdit = !!props.plan;
    
    return (
      <div data-testid="plan-modal">
        <h2>{isEdit ? 'Editar Plano' : 'Novo Plano'}</h2>
        <button onClick={props.onClose}>Cancelar</button>
        <button 
          data-testid="save-button" 
          onClick={() => {
            const newPlan = {
              id: isEdit ? props.plan.id : Date.now(),
              description: 'Plano Mensal',
              type: 'Carro',
              spaces: 10,
              spacesBusy: 5,
              spacesAvailable: 5,
              value: '100',
              cancelValue: '50',
              startDate: '2024-01-01',
              endDate: '2024-12-31',
              status: true,
            };
            props.onSaveInMemory?.(newPlan);
            props.onClose();
          }}
        >
          {isEdit ? 'Salvar' : 'Criar'}
        </button>
      </div>
    );
  };
});

describe('GaragePlansCard', () => {
  const mockPlans: IPlans[] = [
    {
      id: 1,
      description: 'Plano Mensal',
      value: '150',
      spaces: 100,
      spacesBusy: 30,
      spacesAvailable: 70,
      status: true
    },
    {
      id: 2,
      description: 'Plano Diário',
      value: '20',
      spaces: 50,
      spacesBusy: 15,
      spacesAvailable: 35,
      status: false
    }
  ];

  const defaultProps = {
    data: mockPlans,
    onUpdatePlans: jest.fn(),
    garageCode: 123
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render component with all tabs', () => {
      render(<GaragePlansCard {...defaultProps} />);

      expect(screen.getByText('Planos')).toBeInTheDocument();
      expect(screen.getByText('Descontos')).toBeInTheDocument();
      expect(screen.getByText('Configurações')).toBeInTheDocument();

      expect(screen.getByText('Planos Disponíveis')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /novo plano/i })).toBeInTheDocument();
    });

    it('should render correctly with data', () => {
      render(<GaragePlansCard {...defaultProps} />);

      expect(screen.getByText('Planos Disponíveis')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /novo plano/i })).toBeInTheDocument();
      
      expect(screen.getByText('Plano Mensal')).toBeInTheDocument();
      expect(screen.getByText('Plano Diário')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('should render plans table with data', () => {
      render(<GaragePlansCard {...defaultProps} />);

      expect(screen.getByText('Descrição')).toBeInTheDocument();
      expect(screen.getByText('Valor')).toBeInTheDocument();
      expect(screen.getByText('Vagas')).toBeInTheDocument();
      expect(screen.getByText('Ocupadas')).toBeInTheDocument();
      expect(screen.getByText('Disponíveis')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Ações')).toBeInTheDocument();

      expect(screen.getByText('Plano Mensal')).toBeInTheDocument();
      expect(screen.getByText('Plano Diário')).toBeInTheDocument();
      expect(screen.getByText('R$ 150')).toBeInTheDocument();
      expect(screen.getByText('R$ 20')).toBeInTheDocument();
      expect(screen.getByText('Ativo')).toBeInTheDocument();
      expect(screen.getByText('Inativo')).toBeInTheDocument();
    });

    it('should render correctly without data', () => {
      render(<GaragePlansCard {...defaultProps} data={[]} />);

      expect(screen.getByText('Planos Disponíveis')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /novo plano/i })).toBeInTheDocument();
      
      expect(screen.queryByText('Plano Mensal')).not.toBeInTheDocument();
    });

    it('should handle data as single object', () => {
      const singlePlan = [mockPlans[0]];
      render(<GaragePlansCard {...defaultProps} data={singlePlan} />);

      expect(screen.getByText('Plano Mensal')).toBeInTheDocument();
      expect(screen.queryByText('Plano Diário')).not.toBeInTheDocument();
    });

    it('should handle data as null/undefined', () => {
      render(<GaragePlansCard {...defaultProps} data={[]} />);

      expect(screen.getByText('Planos Disponíveis')).toBeInTheDocument();
      expect(screen.queryByText('Plano Mensal')).not.toBeInTheDocument();
    });
  });

  describe('Tab navigation', () => {
     it('should switch to discounts tab', () => {
      render(<GaragePlansCard {...defaultProps} />);

      const descontosTab = screen.getByText('Descontos');
      fireEvent.click(descontosTab);

      expect(screen.getByText('📉 Área de descontos (conteúdo futuro)')).toBeInTheDocument();
      expect(screen.queryByText('Planos Disponíveis')).not.toBeInTheDocument();
    });

    it('should switch to settings tab', () => {
      render(<GaragePlansCard {...defaultProps} />);

      const configTab = screen.getByText('Configurações');
      fireEvent.click(configTab);

      expect(screen.getByText('⚙️ Configurações da garagem (conteúdo futuro)')).toBeInTheDocument();
      expect(screen.queryByText('Planos Disponíveis')).not.toBeInTheDocument();
    });

    it('should return to plans tab', () => {
      render(<GaragePlansCard {...defaultProps} />);

      fireEvent.click(screen.getByText('Descontos'));
      expect(screen.getByText('📉 Área de descontos (conteúdo futuro)')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Planos'));
      expect(screen.getByText('Planos Disponíveis')).toBeInTheDocument();
    });

    it('should apply correct styles for active tab', () => {
      render(<GaragePlansCard {...defaultProps} />);

      const planosTab = screen.getByText('Planos').closest('button');
      const descontosTab = screen.getByText('Descontos').closest('button');

      expect(planosTab).toHaveClass('text-black', 'bg-white');
      expect(descontosTab).toHaveClass('text-gray-600', 'bg-[#ebebeb]');

      fireEvent.click(descontosTab!);

      expect(descontosTab).toHaveClass('text-black', 'bg-white');
      expect(planosTab).toHaveClass('text-gray-600', 'bg-[#ebebeb]');
    });
  });

  describe('Plan management', () => {
     it('should open modal to create new plan', async () => {
      render(<GaragePlansCard {...defaultProps} />);

      expect(screen.getByTestId('plan-modal')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /novo plano/i })).toBeInTheDocument();
    });

    it('should edit existing plan and update list', async () => {
      render(<GaragePlansCard {...defaultProps} />);

      expect(screen.getByTestId('plan-modal')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /novo plano/i })).toBeInTheDocument();
    });

    it('should close modal', async () => {
      render(<GaragePlansCard {...defaultProps} />);

      const cancelButton = screen.getByText('Cancelar');
      fireEvent.click(cancelButton);

      expect(cancelButton).toBeInTheDocument();
    });

    it('should create new plan and update list', async () => {
      const mockOnUpdatePlans = jest.fn();
      render(<GaragePlansCard {...defaultProps} onUpdatePlans={mockOnUpdatePlans} />);

      const saveButton = screen.getByTestId('save-button');
      fireEvent.click(saveButton);

      expect(mockOnUpdatePlans).toHaveBeenCalled();
    });

    it('should save edited plan and update list', async () => {
      const mockOnUpdatePlans = jest.fn();
      render(<GaragePlansCard {...defaultProps} onUpdatePlans={mockOnUpdatePlans} />);

      const saveButton = screen.getByTestId('save-button');
      fireEvent.click(saveButton);

      expect(mockOnUpdatePlans).toHaveBeenCalled();
    });

    it('should work without onUpdatePlans callback', async () => {
      render(<GaragePlansCard {...defaultProps} onUpdatePlans={undefined} />);

      const saveButton = screen.getByTestId('save-button');
      
      expect(() => {
        fireEvent.click(saveButton);
      }).not.toThrow();
    });
  });

  describe('Status rendering', () => {
     it('should render active status correctly', () => {
      render(<GaragePlansCard {...defaultProps} />);

      const statusAtivo = screen.getByText('Ativo');
      expect(statusAtivo).toHaveClass('border-[#7ad33e]', 'text-[#7ad33e]');
    });

    it('should render inactive status correctly', () => {
      render(<GaragePlansCard {...defaultProps} />);

      const statusInativo = screen.getByText('Inativo');
      expect(statusInativo).toHaveClass('border-gray-300', 'text-gray-600');
    });
  });

  describe('Accessibility', () => {
     it('should have accessible buttons', () => {
      render(<GaragePlansCard {...defaultProps} />);

      expect(screen.getByRole('button', { name: /planos/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /descontos/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /configurações/i })).toBeInTheDocument();

      expect(screen.getByRole('button', { name: /novo plano/i })).toBeInTheDocument();
    });

    it('should have table with semantic structure', () => {
      render(<GaragePlansCard {...defaultProps} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader')).toHaveLength(7);
      expect(screen.getAllByRole('row')).toHaveLength(3);
    });
  });

  describe('useEffect integration', () => {
     it('should update temporaryPlans when data changes', () => {
      const { rerender } = render(<GaragePlansCard {...defaultProps} />);

      expect(screen.getByText('Plano Mensal')).toBeInTheDocument();
      expect(screen.getByText('Plano Diário')).toBeInTheDocument();

      const newPlans = [mockPlans[0]];
      rerender(<GaragePlansCard {...defaultProps} data={newPlans} />);

      expect(screen.getByText('Plano Mensal')).toBeInTheDocument();
      expect(screen.queryByText('Plano Diário')).not.toBeInTheDocument();
    });
  });
});