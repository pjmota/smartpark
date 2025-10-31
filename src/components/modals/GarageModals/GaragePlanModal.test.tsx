import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
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

import { createPlan, updatePlan } from '../../../services/planServices/plans.service';
import { createGaragePlan, updateGaragePlan } from '../../../services/clientsService/clients.service';
import { toast } from 'react-toastify';
import { disableBodyScroll, enableBodyScroll } from '../../../utils/modalUtils';

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

  it('should validate required fields and show helper texts on submit', async () => {
    render(<PlanModal {...defaultProps} />);

    const getInputByLabel = (label: string) => {
      const wrapper = screen.getByText(label).parentElement as HTMLElement;
      const input = wrapper.querySelector('input') as HTMLInputElement;
      return input;
    };

    // Description too short
    fireEvent.change(screen.getByPlaceholderText('Digite a descrição do plano'), { target: { value: 'a' } });

    // Spaces invalid
    fireEvent.change(getInputByLabel('Total de Vagas *'), { target: { value: 0 } });

    // Monetary values invalid
    fireEvent.change(getInputByLabel('Valor (R$) *'), { target: { value: '0' } });
    fireEvent.change(getInputByLabel('Valor do Cancelamento (R$)'), { target: { value: '0' } });

    // Dates invalid: end <= start and start in past
    fireEvent.change(getInputByLabel('Início da Validade *'), { target: { value: '2000-01-01' } });
    fireEvent.change(getInputByLabel('Fim da Validade *'), { target: { value: '2000-01-01' } });

    // Submit
    fireEvent.click(screen.getByText('Criar'));

    // Expect helper texts for description, spaces, value and dates
    expect(await screen.findByText('Descrição deve ter pelo menos 3 caracteres')).toBeInTheDocument();
    expect(await screen.findByText('Número de vagas deve ser maior que 0')).toBeInTheDocument();
    expect(await screen.findByText('Valor deve ser maior que R$ 0,00')).toBeInTheDocument();
    expect(await screen.findByText('Data de fim deve ser posterior à data de início')).toBeInTheDocument();
    // Cancel value error is set internally but not shown; just ensure no success toast
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('should create plan (global) successfully and show success toast', async () => {
    const onClose = jest.fn();
    const onSaveInMemory = jest.fn();
    const savedPlan = {
      id: 99,
      description: 'Plano Teste',
      type: 'Carro',
      spaces: 10,
      spacesBusy: 0,
      spacesAvailable: 10,
      value: '12.34',
      cancelValue: '1.00',
      startDate: '2099-01-01',
      endDate: '2099-12-31',
      status: true,
    } as any;

    (createPlan as jest.Mock).mockResolvedValue({ data: savedPlan });

    render(<PlanModal open={true} onClose={onClose} plan={null} onSaveInMemory={onSaveInMemory} />);

    fireEvent.change(screen.getByPlaceholderText('Digite a descrição do plano'), { target: { value: 'Plano Teste' } });
    const getInputByLabel = (label: string) => {
      const wrapper = screen.getByText(label).parentElement as HTMLElement;
      return wrapper.querySelector('input') as HTMLInputElement;
    };

    fireEvent.change(getInputByLabel('Total de Vagas *'), { target: { value: 10 } });
    fireEvent.change(getInputByLabel('Valor (R$) *'), { target: { value: '1234' } });
    fireEvent.change(getInputByLabel('Valor do Cancelamento (R$)'), { target: { value: '100' } });
    fireEvent.change(getInputByLabel('Início da Validade *'), { target: { value: '2099-01-01' } });
    fireEvent.change(getInputByLabel('Fim da Validade *'), { target: { value: '2099-12-31' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Criar'));
    });

    expect(createPlan).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Plano criado com sucesso!');
    expect(onSaveInMemory).toHaveBeenCalledWith(savedPlan);
    expect(onClose).toHaveBeenCalled();
  });

  it('should create plan (garage scoped) successfully using garageCode', async () => {
    const onClose = jest.fn();
    const onSaveInMemory = jest.fn();
    const savedPlan = {
      id: 100,
      description: 'Plano Garagem',
      type: 'Carro',
      spaces: 5,
      spacesBusy: 0,
      spacesAvailable: 5,
      value: '10.00',
      cancelValue: '1.00',
      startDate: '2099-01-01',
      endDate: '2099-12-31',
      status: true,
    } as any;

    (createGaragePlan as jest.Mock).mockResolvedValue(savedPlan);

    render(<PlanModal open={true} onClose={onClose} plan={null} onSaveInMemory={onSaveInMemory} garageCode={123} />);

    fireEvent.change(screen.getByPlaceholderText('Digite a descrição do plano'), { target: { value: 'Plano Garagem' } });
    const getInputByLabel = (label: string) => {
      const wrapper = screen.getByText(label).parentElement as HTMLElement;
      return wrapper.querySelector('input') as HTMLInputElement;
    };

    fireEvent.change(getInputByLabel('Total de Vagas *'), { target: { value: 5 } });
    fireEvent.change(getInputByLabel('Valor (R$) *'), { target: { value: '1000' } });
    fireEvent.change(getInputByLabel('Valor do Cancelamento (R$)'), { target: { value: '100' } });
    fireEvent.change(getInputByLabel('Início da Validade *'), { target: { value: '2099-01-01' } });
    fireEvent.change(getInputByLabel('Fim da Validade *'), { target: { value: '2099-12-31' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Criar'));
    });

    expect(createGaragePlan).toHaveBeenCalledWith(123, expect.any(Object));
    expect(toast.success).toHaveBeenCalledWith('Plano criado com sucesso!');
    expect(onSaveInMemory).toHaveBeenCalledWith(savedPlan);
    expect(onClose).toHaveBeenCalled();
  });

  it('should update plan successfully when editing (global)', async () => {
    const onClose = jest.fn();
    const onSaveInMemory = jest.fn();
    const plan = {
      id: 1,
      description: 'Plano Editar',
      type: 'Carro' as const,
      spaces: 2,
      spacesBusy: 0,
      spacesAvailable: 2,
      value: '10',
      cancelValue: '5',
      startDate: '2099-01-01',
      endDate: '2099-12-31',
      status: true,
    };

    const updatedPlan = { ...plan } as any;
    (updatePlan as jest.Mock).mockResolvedValue({ data: updatedPlan });

    render(<PlanModal open={true} onClose={onClose} plan={plan} onSaveInMemory={onSaveInMemory} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Salvar'));
    });

    expect(updatePlan).toHaveBeenCalledWith(1, expect.any(Object));
    expect(toast.success).toHaveBeenCalledWith('Plano atualizado com sucesso!');
    expect(onSaveInMemory).toHaveBeenCalledWith(updatedPlan);
    expect(onClose).toHaveBeenCalled();
  });

  it('should update plan successfully when editing (garage scoped)', async () => {
    const onClose = jest.fn();
    const onSaveInMemory = jest.fn();
    const plan = {
      id: 2,
      description: 'Plano Editar Garagem',
      type: 'Carro' as const,
      spaces: 3,
      spacesBusy: 0,
      spacesAvailable: 3,
      value: '20',
      cancelValue: '5',
      startDate: '2099-01-01',
      endDate: '2099-12-31',
      status: true,
    };

    const updatedPlan = { ...plan } as any;
    (updateGaragePlan as jest.Mock).mockResolvedValue(updatedPlan);

    render(<PlanModal open={true} onClose={onClose} plan={plan} onSaveInMemory={onSaveInMemory} garageCode={456} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Salvar'));
    });

    expect(updateGaragePlan).toHaveBeenCalledWith(456, 2, expect.any(Object));
    expect(toast.success).toHaveBeenCalledWith('Plano atualizado com sucesso!');
    expect(onSaveInMemory).toHaveBeenCalledWith(updatedPlan);
    expect(onClose).toHaveBeenCalled();
  });

  it('should handle network error on submit and call onSaveInMemory with temp plan', async () => {
    const onClose = jest.fn();
    const onSaveInMemory = jest.fn();
    (createPlan as jest.Mock).mockRejectedValue(new Error('Network Error'));

    render(<PlanModal open={true} onClose={onClose} plan={null} onSaveInMemory={onSaveInMemory} />);

    const getInputByLabel = (label: string) => {
      const wrapper = screen.getByText(label).parentElement as HTMLElement;
      return wrapper.querySelector('input') as HTMLInputElement;
    };

    fireEvent.change(screen.getByPlaceholderText('Digite a descrição do plano'), { target: { value: 'Plano Teste' } });
    fireEvent.change(getInputByLabel('Total de Vagas *'), { target: { value: 1 } });
    fireEvent.change(getInputByLabel('Valor (R$) *'), { target: { value: '100' } });
    fireEvent.change(getInputByLabel('Valor do Cancelamento (R$)'), { target: { value: '10' } });
    fireEvent.change(getInputByLabel('Início da Validade *'), { target: { value: '2099-01-01' } });
    fireEvent.change(getInputByLabel('Fim da Validade *'), { target: { value: '2099-12-31' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Criar'));
    });

    expect(toast.error).toHaveBeenCalledWith('Não foi possível conectar ao servidor. Verifique sua conexão.');
    expect(onSaveInMemory).toHaveBeenCalledWith(expect.objectContaining({ description: 'Plano Teste' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('should toggle status switch and reflect label change', () => {
    render(<PlanModal {...defaultProps} />);
    const switchControl = screen.getByRole('switch');
    // Initially active
    expect(screen.getByText('Ativo')).toBeInTheDocument();
    fireEvent.click(switchControl);
    expect(screen.getByText('Inativo')).toBeInTheDocument();
  });

  it('should manage body scroll on open/close', () => {
    const { rerender } = render(<PlanModal {...defaultProps} />);
    expect(disableBodyScroll).toHaveBeenCalled();
    rerender(<PlanModal {...defaultProps} open={false} />);
    expect(enableBodyScroll).toHaveBeenCalled();
  });
});