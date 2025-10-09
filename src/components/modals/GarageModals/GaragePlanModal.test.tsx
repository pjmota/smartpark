import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlanModal from './GaragePlanModal';

// Mocks simples
jest.mock('../../../services/clientsService/clients.service', () => ({
  updateGaragePlan: jest.fn(),
  createGaragePlan: jest.fn(),
}));

jest.mock('../../../services/planServices/plans.service', () => ({
  createPlan: jest.fn(),
  updatePlan: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../../utils/formatCurrency', () => jest.fn((value) => value || ''));

jest.mock('../../../utils/modalUtils', () => ({
  disableBodyScroll: jest.fn(),
  enableBodyScroll: jest.fn(),
}));

jest.mock('../../../lib/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe('PlanModal', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    plan: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render modal when open is true', () => {
    render(<PlanModal {...defaultProps} />);
    expect(screen.getByText('Novo Plano')).toBeInTheDocument();
  });

  it('should not render modal when open is false', () => {
    render(<PlanModal {...defaultProps} open={false} />);
    expect(screen.queryByText('Novo Plano')).not.toBeInTheDocument();
  });

  it('should render correct title for editing', () => {
    const plan = {
      id: 1,
      description: 'Plano Teste',
      type: 'Carro' as const,
      spaces: 10,
      spacesBusy: 5,
      spacesAvailable: 5,
      value: '100',
      cancelValue: '50',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: true,
    };
    
    render(<PlanModal {...defaultProps} plan={plan} />);
    expect(screen.getByText('Editar Plano')).toBeInTheDocument();
  });

  it('should render basic form fields', () => {
    render(<PlanModal {...defaultProps} />);
    
    // Check if label texts are present
    expect(screen.getByText('Descrição *')).toBeInTheDocument();
    expect(screen.getByText('Tipo de Veículo')).toBeInTheDocument();
    expect(screen.getByText('Total de Vagas *')).toBeInTheDocument();
    expect(screen.getByText('Valor (R$) *')).toBeInTheDocument();
    expect(screen.getByText('Valor do Cancelamento (R$)')).toBeInTheDocument();
    expect(screen.getByText('Início da Validade *')).toBeInTheDocument();
    expect(screen.getByText('Fim da Validade *')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('should render action buttons', () => {
    render(<PlanModal {...defaultProps} />);
    
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Criar')).toBeInTheDocument(); // For new plan, button is "Criar"
  });

  it('should fill fields when a plan is provided', () => {
    const plan = {
      id: 1,
      description: 'Plano Premium',
      type: 'Carro' as const,
      spaces: 20,
      spacesBusy: 10,
      spacesAvailable: 10,
      value: '150',
      cancelValue: '75',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: true,
    };
    
    render(<PlanModal {...defaultProps} plan={plan} />);
    
    // Check if edit title appears
    expect(screen.getByText('Editar Plano')).toBeInTheDocument();
    
    // Check if description appears in help text
    expect(screen.getByText('Preencha os dados para editar o plano.')).toBeInTheDocument();
  });
});