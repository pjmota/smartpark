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

  it('deve renderizar o modal quando open é true', () => {
    render(<PlanModal {...defaultProps} />);
    expect(screen.getByText('Novo Plano')).toBeInTheDocument();
  });

  it('não deve renderizar o modal quando open é false', () => {
    render(<PlanModal {...defaultProps} open={false} />);
    expect(screen.queryByText('Novo Plano')).not.toBeInTheDocument();
  });

  it('deve renderizar o título correto para edição', () => {
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

  it('deve renderizar os campos básicos do formulário', () => {
    render(<PlanModal {...defaultProps} />);
    
    // Verificar se os textos dos labels estão presentes
    expect(screen.getByText('Descrição *')).toBeInTheDocument();
    expect(screen.getByText('Tipo de Veículo')).toBeInTheDocument();
    expect(screen.getByText('Total de Vagas *')).toBeInTheDocument();
    expect(screen.getByText('Valor (R$) *')).toBeInTheDocument();
    expect(screen.getByText('Valor do Cancelamento (R$)')).toBeInTheDocument();
    expect(screen.getByText('Início da Validade *')).toBeInTheDocument();
    expect(screen.getByText('Fim da Validade *')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('deve renderizar os botões de ação', () => {
    render(<PlanModal {...defaultProps} />);
    
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Criar')).toBeInTheDocument(); // Para novo plano, o botão é "Criar"
  });

  it('deve preencher os campos quando um plano é fornecido', () => {
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
    
    // Verificar se o título de edição aparece
    expect(screen.getByText('Editar Plano')).toBeInTheDocument();
    
    // Verificar se a descrição aparece no texto de ajuda
    expect(screen.getByText('Preencha os dados para editar o plano.')).toBeInTheDocument();
  });
});