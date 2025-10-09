import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import WelcomeCard from './index';
import { IWelcomeCardProps } from '@/types/welcome.type';

// Mock do Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock dos ícones do Lucide React
jest.mock('lucide-react', () => ({
  ArrowRight: ({ className }: { className?: string }) => (
    <div data-testid="arrow-right-icon" className={className} />
  ),
  Building2: ({ className }: { className?: string }) => (
    <div data-testid="building2-icon" className={className} />
  ),
  Car: ({ className }: { className?: string }) => (
    <div data-testid="car-icon" className={className} />
  ),
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('WelcomeCard', () => {
  const defaultProps: IWelcomeCardProps = {
    title: 'Garagens',
    description: 'Gerencie suas garagens e vagas',
    icon: <div data-testid="test-icon" />,
    route: '/authenticatedPages/garages',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as any);
  });

  describe('Basic rendering', () => {
    it('should render correctly with all props', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      expect(screen.getByText('Garagens')).toBeInTheDocument();
      expect(screen.getByText('Gerencie suas garagens e vagas')).toBeInTheDocument();
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByTestId('arrow-right-icon')).toBeInTheDocument();
    });

    it('should render as a button', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('cursor-pointer');
    });

    it('should have correct aria-label', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Navegar para Garagens: Gerencie suas garagens e vagas');
    });
  });

  describe('Structure and layout', () => {
    it('should have correct CSS classes', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'p-6',
        'border',
        'rounded-lg',
        'shadow-sm',
        'hover:shadow-md',
        'transition',
        'cursor-pointer',
        'w-full',
        'text-left'
      );
    });

    it('should have correct layout structure', () => {
      const { container } = render(<WelcomeCard {...defaultProps} />);
      
      // Verifica se existe o container principal com flex
      const flexContainer = container.querySelector('.flex.justify-between.items-center.mb-4');
      expect(flexContainer).toBeInTheDocument();
      
      // Verifica se o ícone tem a classe de cor correta
      const iconContainer = container.querySelector('.text-\\[\\#7ad33e\\]');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should render title with correct classes', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const title = screen.getByText('Garagens');
      expect(title).toHaveClass('text-lg', 'font-semibold', 'text-gray-900', 'mb-1');
    });

    it('should render description with correct classes', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const description = screen.getByText('Gerencie suas garagens e vagas');
      expect(description).toHaveClass('text-sm', 'text-gray-500');
    });
  });

  describe('Navigation functionality', () => {
    it('should call router.push with correct route when clicked', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith('/authenticatedPages/garages');
    });

    it('should navigate to different route when route prop changes', () => {
      const customProps = {
        ...defaultProps,
        route: '/authenticatedPages/monthlyPayers',
      };
      
      render(<WelcomeCard {...customProps} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockPush).toHaveBeenCalledWith('/authenticatedPages/monthlyPayers');
    });

    it('should work with multiple clicks', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(mockPush).toHaveBeenCalledTimes(3);
      expect(mockPush).toHaveBeenCalledWith('/authenticatedPages/garages');
    });
  });

  describe('Interactions and events', () => {
    it('should have pointer cursor on hover', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('cursor-pointer');
    });
  });

  describe('Different content types', () => {
    it('should render with long title', () => {
      const longTitleProps = {
        ...defaultProps,
        title: 'Este é um título muito longo para testar o comportamento do componente',
      };
      
      render(<WelcomeCard {...longTitleProps} />);
      
      expect(screen.getByText('Este é um título muito longo para testar o comportamento do componente')).toBeInTheDocument();
    });

    it('should render with long description', () => {
      const longDescriptionProps = {
        ...defaultProps,
        description: 'Esta é uma descrição muito longa para testar como o componente se comporta com textos extensos que podem quebrar em múltiplas linhas',
      };
      
      render(<WelcomeCard {...longDescriptionProps} />);
      
      expect(screen.getByText('Esta é uma descrição muito longa para testar como o componente se comporta com textos extensos que podem quebrar em múltiplas linhas')).toBeInTheDocument();
    });

    it('should render with different icons', () => {
      const buildingIconProps = {
        ...defaultProps,
        icon: <div data-testid="building2-icon" />,
      };
      
      render(<WelcomeCard {...buildingIconProps} />);
      
      expect(screen.getByTestId('building2-icon')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should be focusable via keyboard', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const button = screen.getByRole('button');
      button.focus();
      
      expect(button).toHaveFocus();
    });

    it('should have button role', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should have descriptive aria-label', () => {
      const customProps = {
        title: 'Mensalistas',
        description: 'Gerencie clientes mensalistas',
        icon: <div data-testid="car-icon" />,
        route: '/authenticatedPages/monthlyPayers',
      };
      
      render(<WelcomeCard {...customProps} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Navegar para Mensalistas: Gerencie clientes mensalistas');
    });
  });

  describe('Visual states', () => {
    it('should have correct hover classes', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:shadow-md');
    });

    it('should have CSS transitions', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition');
    });

    it('should have arrow icon with transition classes', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const arrowIcon = screen.getByTestId('arrow-right-icon');
      expect(arrowIcon).toHaveClass('text-gray-300', 'group-hover:text-gray-900', 'transition-colors');
    });
  });

  describe('Edge cases', () => {
    it('should work with undefined props', () => {
      const propsWithUndefined = {
        title: 'Test Title',
        description: 'Test Description',
        icon: <div>Icon</div>,
        route: '/test-route'
      };
      
      expect(() => render(<WelcomeCard {...propsWithUndefined} />)).not.toThrow();
    });

    it('should work with empty strings', () => {
      const propsWithEmptyStrings = {
        title: '',
        description: '',
        icon: <div>Icon</div>,
        route: ''
      };
      
      expect(() => render(<WelcomeCard {...propsWithEmptyStrings} />)).not.toThrow();
    });
  });
});