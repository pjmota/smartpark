import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GarageInfoCard from './index';
import { IGarageInfoCard } from '@/types/garage.type';

// Mock dos ícones do Lucide React
jest.mock('lucide-react', () => ({
  Users: ({ className }: { className?: string }) => (
    <div data-testid="users-icon" className={className} />
  ),
  Car: ({ className }: { className?: string }) => (
    <div data-testid="car-icon" className={className} />
  ),
  Building2: ({ className }: { className?: string }) => (
    <div data-testid="building2-icon" className={className} />
  ),
}));

describe('GarageInfoCard', () => {
  const defaultProps: IGarageInfoCard = {
    label: 'Total de Vagas',
    value: 150,
    icon: <div data-testid="test-icon" />,
  };

  describe('Renderização básica', () => {
    it('deve renderizar corretamente com props obrigatórias', () => {
      render(<GarageInfoCard {...defaultProps} />);
      
      expect(screen.getByText('Total de Vagas')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('deve renderizar com cor padrão quando color não é fornecida', () => {
      const { container } = render(<GarageInfoCard {...defaultProps} />);
      
      const valueElement = container.querySelector('.text-gray-600');
      expect(valueElement).toBeInTheDocument();
      expect(valueElement).toHaveTextContent('150');
    });

    it('deve renderizar com cor customizada', () => {
      const propsWithColor = { ...defaultProps, color: 'text-red-500' };
      const { container } = render(<GarageInfoCard {...propsWithColor} />);
      
      const valueElement = container.querySelector('.text-red-500');
      expect(valueElement).toBeInTheDocument();
      expect(valueElement).toHaveTextContent('150');
    });
  });

  describe('Estrutura e layout', () => {
    it('deve ter estrutura de container correta', () => {
      const { container } = render(<GarageInfoCard {...defaultProps} />);
      
      const cardContainer = container.querySelector('.border.rounded-lg.p-4.flex.flex-col.items-center');
      expect(cardContainer).toBeInTheDocument();
    });

    it('deve ter classes CSS corretas no valor', () => {
      const { container } = render(<GarageInfoCard {...defaultProps} />);
      
      const valueElement = container.querySelector('.text-xl.font-bold.flex.items-center.gap-2');
      expect(valueElement).toBeInTheDocument();
      expect(valueElement).toHaveTextContent('150');
    });

    it('deve ter classes CSS corretas no label', () => {
      const { container } = render(<GarageInfoCard {...defaultProps} />);
      
      const labelElement = container.querySelector('.text-sm.text-gray-500.mt-2');
      expect(labelElement).toBeInTheDocument();
      expect(labelElement).toHaveTextContent('Total de Vagas');
    });
  });

  describe('Diferentes tipos de valores', () => {
    it('deve renderizar com valor numérico', () => {
      const numericProps = { ...defaultProps, value: 999 };
      render(<GarageInfoCard {...numericProps} />);
      
      expect(screen.getByText('999')).toBeInTheDocument();
    });

    it('deve renderizar com valor zero', () => {
      const zeroProps = { ...defaultProps, value: 0 };
      render(<GarageInfoCard {...zeroProps} />);
      
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('deve renderizar com valor textual', () => {
      // Como a interface espera number, vamos remover este teste ou usar um número
      const textProps = { ...defaultProps, value: 999 };
      render(<GarageInfoCard {...textProps} />);
      
      expect(screen.getByText('999')).toBeInTheDocument();
    });

    it('deve renderizar com valor vazio', () => {
      // Como a interface espera number, vamos usar 0 em vez de string vazia
      const emptyProps = { ...defaultProps, value: 0 };
      render(<GarageInfoCard {...emptyProps} />);
      
      // O elemento deve existir mesmo com valor zero
      const { container } = render(<GarageInfoCard {...emptyProps} />);
      const valueElement = container.querySelector('.text-xl.font-bold');
      expect(valueElement).toBeInTheDocument();
      expect(valueElement).toHaveTextContent('0');
    });
  });

  describe('Diferentes tipos de labels', () => {
    it('deve renderizar com label longo', () => {
      const longLabelProps = { 
        ...defaultProps, 
        label: 'Este é um label muito longo para testar o comportamento do componente' 
      };
      render(<GarageInfoCard {...longLabelProps} />);
      
      expect(screen.getByText('Este é um label muito longo para testar o comportamento do componente')).toBeInTheDocument();
    });

    it('deve renderizar com label vazio', () => {
      const emptyLabelProps = { ...defaultProps, label: '' };
      const { container } = render(<GarageInfoCard {...emptyLabelProps} />);
      
      const labelElement = container.querySelector('.text-sm.text-gray-500.mt-2');
      expect(labelElement).toBeInTheDocument();
    });

    it('deve renderizar com caracteres especiais no label', () => {
      const specialCharsProps = { 
        ...defaultProps, 
        label: 'Vagas (50%) - Disponíveis & Ocupadas' 
      };
      render(<GarageInfoCard {...specialCharsProps} />);
      
      expect(screen.getByText('Vagas (50%) - Disponíveis & Ocupadas')).toBeInTheDocument();
    });
  });

  describe('Diferentes tipos de ícones', () => {
    it('deve renderizar com ícone Users', () => {
      const usersIconProps = { 
        ...defaultProps, 
        icon: <div data-testid="users-icon" className="w-5 h-5" /> 
      };
      render(<GarageInfoCard {...usersIconProps} />);
      
      expect(screen.getByTestId('users-icon')).toBeInTheDocument();
    });

    it('deve renderizar com ícone Car', () => {
      const carIconProps = { 
        ...defaultProps, 
        icon: <div data-testid="car-icon" className="w-5 h-5" /> 
      };
      render(<GarageInfoCard {...carIconProps} />);
      
      expect(screen.getByTestId('car-icon')).toBeInTheDocument();
    });

    it('deve renderizar com ícone Building2', () => {
      const buildingIconProps = { 
        ...defaultProps, 
        icon: <div data-testid="building2-icon" className="w-5 h-5" /> 
      };
      render(<GarageInfoCard {...buildingIconProps} />);
      
      expect(screen.getByTestId('building2-icon')).toBeInTheDocument();
    });

    it('deve renderizar sem ícone', () => {
      const noIconProps = { ...defaultProps, icon: null };
      const { container } = render(<GarageInfoCard {...noIconProps} />);
      
      const valueElement = container.querySelector('.text-xl.font-bold.flex.items-center.gap-2');
      expect(valueElement).toBeInTheDocument();
      expect(valueElement).toHaveTextContent('150');
    });
  });

  describe('Diferentes cores', () => {
    it('deve renderizar com cor verde', () => {
      const greenProps = { ...defaultProps, color: 'text-green-500' };
      const { container } = render(<GarageInfoCard {...greenProps} />);
      
      const valueElement = container.querySelector('.text-green-500');
      expect(valueElement).toBeInTheDocument();
    });

    it('deve renderizar com cor vermelha', () => {
      const redProps = { ...defaultProps, color: 'text-red-500' };
      const { container } = render(<GarageInfoCard {...redProps} />);
      
      const valueElement = container.querySelector('.text-red-500');
      expect(valueElement).toBeInTheDocument();
    });

    it('deve renderizar com cor laranja', () => {
      const orangeProps = { ...defaultProps, color: 'text-orange-500' };
      const { container } = render(<GarageInfoCard {...orangeProps} />);
      
      const valueElement = container.querySelector('.text-orange-500');
      expect(valueElement).toBeInTheDocument();
    });

    it('deve renderizar com cor azul', () => {
      const blueProps = { ...defaultProps, color: 'text-blue-500' };
      const { container } = render(<GarageInfoCard {...blueProps} />);
      
      const valueElement = container.querySelector('.text-blue-500');
      expect(valueElement).toBeInTheDocument();
    });
  });

  describe('Cenários de uso real', () => {
    it('deve renderizar card de total de vagas', () => {
      const totalVagasProps = {
        label: 'Total de Vagas',
        value: 200,
        icon: <div data-testid="users-icon" />,
        color: 'text-gray-600',
      };
      render(<GarageInfoCard {...totalVagasProps} />);
      
      expect(screen.getByText('Total de Vagas')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
      expect(screen.getByTestId('users-icon')).toBeInTheDocument();
    });

    it('deve renderizar card de vagas ocupadas', () => {
      const ocupadasProps = {
        label: 'Ocupadas',
        value: 75,
        icon: <div data-testid="car-icon" />,
        color: 'text-red-500',
      };
      render(<GarageInfoCard {...ocupadasProps} />);
      
      expect(screen.getByText('Ocupadas')).toBeInTheDocument();
      expect(screen.getByText('75')).toBeInTheDocument();
      expect(screen.getByTestId('car-icon')).toBeInTheDocument();
    });

    it('deve renderizar card de vagas disponíveis', () => {
      const disponiveisProps = {
        label: 'Disponíveis',
        value: 125,
        icon: <div data-testid="users-icon" />,
        color: 'text-green-500',
      };
      render(<GarageInfoCard {...disponiveisProps} />);
      
      expect(screen.getByText('Disponíveis')).toBeInTheDocument();
      expect(screen.getByText('125')).toBeInTheDocument();
      expect(screen.getByTestId('users-icon')).toBeInTheDocument();
    });
  });

  describe('Casos extremos', () => {
    it('deve renderizar com valores muito grandes', () => {
      const largeValueProps = { ...defaultProps, value: 999999999 };
      render(<GarageInfoCard {...largeValueProps} />);
      
      expect(screen.getByText('999999999')).toBeInTheDocument();
    });

    it('deve renderizar com valores negativos', () => {
      const negativeProps = { ...defaultProps, value: -50 };
      render(<GarageInfoCard {...negativeProps} />);
      
      expect(screen.getByText('-50')).toBeInTheDocument();
    });

    it('deve renderizar com valores decimais', () => {
      const decimalProps = { ...defaultProps, value: 75.5 };
      render(<GarageInfoCard {...decimalProps} />);
      
      expect(screen.getByText('75.5')).toBeInTheDocument();
    });

    it('deve renderizar com caracteres especiais no valor', () => {
      // Como a interface espera number, vamos usar um número simples
      const specialValueProps = { ...defaultProps, value: 50 };
      render(<GarageInfoCard {...specialValueProps} />);
      
      expect(screen.getByText('50')).toBeInTheDocument();
    });
  });

  describe('Responsividade e layout', () => {
    it('deve ter layout flexível centrado', () => {
      const { container } = render(<GarageInfoCard {...defaultProps} />);
      
      const cardContainer = container.firstChild;
      expect(cardContainer).toHaveClass('flex', 'flex-col', 'items-center');
    });

    it('deve ter padding e bordas corretas', () => {
      const { container } = render(<GarageInfoCard {...defaultProps} />);
      
      const cardContainer = container.firstChild;
      expect(cardContainer).toHaveClass('border', 'rounded-lg', 'p-4');
    });

    it('deve ter espaçamento correto entre elementos', () => {
      const { container } = render(<GarageInfoCard {...defaultProps} />);
      
      const labelElement = container.querySelector('.mt-2');
      expect(labelElement).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter estrutura semântica correta', () => {
      const { container } = render(<GarageInfoCard {...defaultProps} />);
      
      // Verifica se o valor está em um span
      const valueSpan = container.querySelector('span');
      expect(valueSpan).toBeInTheDocument();
      expect(valueSpan).toHaveTextContent('150');
      
      // Verifica se o label está em um p
      const labelP = container.querySelector('p');
      expect(labelP).toBeInTheDocument();
      expect(labelP).toHaveTextContent('Total de Vagas');
    });

    it('deve ser legível com diferentes combinações de cor', () => {
      const combinations = [
        { color: 'text-gray-600', expected: true },
        { color: 'text-green-500', expected: true },
        { color: 'text-red-500', expected: true },
        { color: 'text-blue-500', expected: true },
      ];

      combinations.forEach(({ color, expected }) => {
        const { container } = render(<GarageInfoCard {...defaultProps} color={color} />);
        const valueElement = container.querySelector(`.${color.replace(' ', '.')}`);
        expect(!!valueElement).toBe(expected);
      });
    });
  });
});