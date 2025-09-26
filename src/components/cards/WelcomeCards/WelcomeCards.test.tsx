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

  describe('Renderização básica', () => {
    it('deve renderizar corretamente com todas as props', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      expect(screen.getByText('Garagens')).toBeInTheDocument();
      expect(screen.getByText('Gerencie suas garagens e vagas')).toBeInTheDocument();
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByTestId('arrow-right-icon')).toBeInTheDocument();
    });

    it('deve renderizar como um botão', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('cursor-pointer');
    });

    it('deve ter aria-label correto', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Navegar para Garagens: Gerencie suas garagens e vagas');
    });
  });

  describe('Estrutura e layout', () => {
    it('deve ter classes CSS corretas', () => {
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

    it('deve ter estrutura de layout correta', () => {
      const { container } = render(<WelcomeCard {...defaultProps} />);
      
      // Verifica se existe o container principal com flex
      const flexContainer = container.querySelector('.flex.justify-between.items-center.mb-4');
      expect(flexContainer).toBeInTheDocument();
      
      // Verifica se o ícone tem a classe de cor correta
      const iconContainer = container.querySelector('.text-\\[\\#7ad33e\\]');
      expect(iconContainer).toBeInTheDocument();
    });

    it('deve renderizar título com classes corretas', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const title = screen.getByText('Garagens');
      expect(title).toHaveClass('text-lg', 'font-semibold', 'text-gray-900', 'mb-1');
    });

    it('deve renderizar descrição com classes corretas', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const description = screen.getByText('Gerencie suas garagens e vagas');
      expect(description).toHaveClass('text-sm', 'text-gray-500');
    });
  });

  describe('Funcionalidade de navegação', () => {
    it('deve chamar router.push com rota correta quando clicado', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith('/authenticatedPages/garages');
    });

    it('deve navegar para rota diferente quando prop route muda', () => {
      const customProps = {
        ...defaultProps,
        route: '/authenticatedPages/monthlyPayers',
      };
      
      render(<WelcomeCard {...customProps} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockPush).toHaveBeenCalledWith('/authenticatedPages/monthlyPayers');
    });

    it('deve funcionar com múltiplos cliques', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(mockPush).toHaveBeenCalledTimes(3);
      expect(mockPush).toHaveBeenCalledWith('/authenticatedPages/garages');
    });
  });

  describe('Interações e eventos', () => {
    it('deve ter cursor pointer no hover', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('cursor-pointer');
    });
  });

  describe('Diferentes tipos de conteúdo', () => {
    it('deve renderizar com título longo', () => {
      const longTitleProps = {
        ...defaultProps,
        title: 'Este é um título muito longo para testar o comportamento do componente',
      };
      
      render(<WelcomeCard {...longTitleProps} />);
      
      expect(screen.getByText('Este é um título muito longo para testar o comportamento do componente')).toBeInTheDocument();
    });

    it('deve renderizar com descrição longa', () => {
      const longDescriptionProps = {
        ...defaultProps,
        description: 'Esta é uma descrição muito longa para testar como o componente se comporta com textos extensos que podem quebrar em múltiplas linhas',
      };
      
      render(<WelcomeCard {...longDescriptionProps} />);
      
      expect(screen.getByText('Esta é uma descrição muito longa para testar como o componente se comporta com textos extensos que podem quebrar em múltiplas linhas')).toBeInTheDocument();
    });

    it('deve renderizar com diferentes ícones', () => {
      const buildingIconProps = {
        ...defaultProps,
        icon: <div data-testid="building2-icon" />,
      };
      
      render(<WelcomeCard {...buildingIconProps} />);
      
      expect(screen.getByTestId('building2-icon')).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ser focável via teclado', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const button = screen.getByRole('button');
      button.focus();
      
      expect(button).toHaveFocus();
    });

    it('deve ter role de button', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('deve ter aria-label descritivo', () => {
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

  describe('Estados visuais', () => {
    it('deve ter classes de hover corretas', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:shadow-md');
    });

    it('deve ter transições CSS', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition');
    });

    it('deve ter ícone de seta com classes de transição', () => {
      render(<WelcomeCard {...defaultProps} />);
      
      const arrowIcon = screen.getByTestId('arrow-right-icon');
      expect(arrowIcon).toHaveClass('text-gray-300', 'group-hover:text-gray-900', 'transition-colors');
    });
  });

  describe('Casos extremos', () => {
    it('deve funcionar com props undefined', () => {
      const propsWithUndefined = {
        title: 'Test Title',
        description: 'Test Description',
        icon: <div>Icon</div>,
        route: '/test-route'
      };
      
      expect(() => render(<WelcomeCard {...propsWithUndefined} />)).not.toThrow();
    });

    it('deve funcionar com strings vazias', () => {
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