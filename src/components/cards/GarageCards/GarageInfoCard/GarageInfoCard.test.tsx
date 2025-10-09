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

  describe('Basic rendering', () => {
    it('should render correctly with required props', () => {
      render(<GarageInfoCard {...defaultProps} />);
      
      expect(screen.getByText('Total de Vagas')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should render with default color when color is not provided', () => {
      const { container } = render(<GarageInfoCard {...defaultProps} />);
      
      const valueElement = container.querySelector('.text-gray-600');
      expect(valueElement).toBeInTheDocument();
      expect(valueElement).toHaveTextContent('150');
    });

    it('should render with custom color', () => {
      const propsWithColor = { ...defaultProps, color: 'text-red-500' };
      const { container } = render(<GarageInfoCard {...propsWithColor} />);
      
      const valueElement = container.querySelector('.text-red-500');
      expect(valueElement).toBeInTheDocument();
      expect(valueElement).toHaveTextContent('150');
    });

    it('should render with numeric value', () => {
      const numericProps = { ...defaultProps, value: 42 };
      render(<GarageInfoCard {...numericProps} />);
      
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should render with zero value', () => {
      const zeroProps = { ...defaultProps, value: 0 };
      render(<GarageInfoCard {...zeroProps} />);
      
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should render with empty value', () => {
      const emptyProps = { ...defaultProps, value: 0 };
      render(<GarageInfoCard {...emptyProps} />);
      
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('0')).toHaveTextContent('0');
    });

    it('should render with large value', () => {
      const largeValueProps = { ...defaultProps, value: 999999 };
      render(<GarageInfoCard {...largeValueProps} />);
      
      expect(screen.getByText('999999')).toBeInTheDocument();
    });

    it('should render with negative value', () => {
      const negativeProps = { ...defaultProps, value: -10 };
      render(<GarageInfoCard {...negativeProps} />);
      
      expect(screen.getByText('-10')).toBeInTheDocument();
    });

    it('should render with decimal value', () => {
      const decimalProps = { ...defaultProps, value: 75.5 };
      render(<GarageInfoCard {...decimalProps} />);
      
      expect(screen.getByText('75.5')).toBeInTheDocument();
    });
  });

  describe('Different icon types', () => {
    it('should render with Users icon', () => {
      const usersProps = { ...defaultProps, icon: <div data-testid="users-icon" /> };
      render(<GarageInfoCard {...usersProps} />);
      
      expect(screen.getByTestId('users-icon')).toBeInTheDocument();
    });

    it('should render with Car icon', () => {
      const carProps = { ...defaultProps, icon: <div data-testid="car-icon" /> };
      render(<GarageInfoCard {...carProps} />);
      
      expect(screen.getByTestId('car-icon')).toBeInTheDocument();
    });

    it('should render with Building2 icon', () => {
      const buildingProps = { ...defaultProps, icon: <div data-testid="building2-icon" /> };
      render(<GarageInfoCard {...buildingProps} />);
      
      expect(screen.getByTestId('building2-icon')).toBeInTheDocument();
    });

    it('should render without icon', () => {
      const noIconProps = { ...defaultProps, icon: undefined };
      render(<GarageInfoCard {...noIconProps} />);
      
      expect(screen.getByText('Total de Vagas')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
    });

    it('should render with custom icon', () => {
      const customIcon = <div data-testid="custom-icon">Custom</div>;
      const customIconProps = { ...defaultProps, icon: customIcon };
      render(<GarageInfoCard {...customIconProps} />);
      
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });

    it('should render with complex icon', () => {
      const complexIcon = (
        <div data-testid="complex-icon">
          <span>Icon</span>
          <span>Text</span>
        </div>
      );
      const complexIconProps = { ...defaultProps, icon: complexIcon };
      render(<GarageInfoCard {...complexIconProps} />);
      
      expect(screen.getByTestId('complex-icon')).toBeInTheDocument();
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    it('should render with null icon', () => {
      const nullIconProps = { ...defaultProps, icon: null };
      render(<GarageInfoCard {...nullIconProps} />);
      
      expect(screen.getByText('Total de Vagas')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
    });
  });

  describe('Real usage scenarios', () => {
    it('should render available spots card', () => {
      const availableSpotsProps = {
        label: 'Vagas Disponíveis',
        value: 25,
        icon: <div data-testid="car-icon" />,
        color: 'text-green-600'
      };
      render(<GarageInfoCard {...availableSpotsProps} />);
      
      expect(screen.getByText('Vagas Disponíveis')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByTestId('car-icon')).toBeInTheDocument();
    });

    it('should render occupied spots card', () => {
      const occupiedSpotsProps = {
        label: 'Vagas Ocupadas',
        value: 125,
        icon: <div data-testid="users-icon" />,
        color: 'text-red-600'
      };
      render(<GarageInfoCard {...occupiedSpotsProps} />);
      
      expect(screen.getByText('Vagas Ocupadas')).toBeInTheDocument();
      expect(screen.getByText('125')).toBeInTheDocument();
      expect(screen.getByTestId('users-icon')).toBeInTheDocument();
    });

    it('should render total capacity card', () => {
      const totalCapacityProps = {
        label: 'Capacidade Total',
        value: 150,
        icon: <div data-testid="building2-icon" />,
        color: 'text-blue-600'
      };
      render(<GarageInfoCard {...totalCapacityProps} />);
      
      expect(screen.getByText('Capacidade Total')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByTestId('building2-icon')).toBeInTheDocument();
    });

    it('should render with special characters in value', () => {
      const specialValueProps = { ...defaultProps, value: 50 };
      render(<GarageInfoCard {...specialValueProps} />);
      
      expect(screen.getByText('50')).toBeInTheDocument();
    });
  });

  describe('Responsiveness and layout', () => {
    it('should have centered flex layout', () => {
      const { container } = render(<GarageInfoCard {...defaultProps} />);
      
      const cardContainer = container.firstChild;
      expect(cardContainer).toHaveClass('flex', 'flex-col', 'items-center');
    });

    it('should have correct padding and borders', () => {
      const { container } = render(<GarageInfoCard {...defaultProps} />);
      
      const cardContainer = container.firstChild;
      expect(cardContainer).toHaveClass('border', 'rounded-lg', 'p-4');
    });

    it('should have correct spacing between elements', () => {
      const { container } = render(<GarageInfoCard {...defaultProps} />);
      
      const labelElement = container.querySelector('.mt-2');
      expect(labelElement).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have correct semantic structure', () => {
      const { container } = render(<GarageInfoCard {...defaultProps} />);
      
      const valueSpan = container.querySelector('span');
      expect(valueSpan).toBeInTheDocument();
      expect(valueSpan).toHaveTextContent('150');
      
      const labelP = container.querySelector('p');
      expect(labelP).toBeInTheDocument();
      expect(labelP).toHaveTextContent('Total de Vagas');
    });

    it('should be readable with different color combinations', () => {
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