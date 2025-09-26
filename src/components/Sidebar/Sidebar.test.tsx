import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { usePathname } from 'next/navigation';
import Sidebar from './index';

// Mock do Next.js
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('next/link', () => {
  return ({ children, href, className, title }: any) => (
    <a href={href} className={className} title={title}>
      {children}
    </a>
  );
});

jest.mock('next/image', () => {
  return ({ src, alt, width, height, className, onClick }: any) => (
    <button 
      type="button"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.(e);
        }
      }}
      className={className}
      style={{ border: 'none', background: 'none', padding: 0 }}
    >
      <img 
        src={src} 
        alt={alt} 
        width={width} 
        height={height}
      />
    </button>
  );
});

// Mock dos ícones do Lucide React
jest.mock('lucide-react', () => ({
  Building2: ({ className }: { className?: string }) => <div data-testid="building2-icon" className={className} />,
  Car: ({ className }: { className?: string }) => <div data-testid="car-icon" className={className} />,
  ChevronLeft: ({ className }: { className?: string }) => <div data-testid="chevron-left-icon" className={className} />,
  House: ({ className }: { className?: string }) => <div data-testid="house-icon" className={className} />,
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('Sidebar', () => {
  const mockToggleSidebar = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/authenticatedPages/welcome');
  });

  describe('Renderização básica', () => {
    it('deve renderizar corretamente quando aberto', () => {
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      expect(screen.getByAltText('Logo SmartPark')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Garagens')).toBeInTheDocument();
      expect(screen.getByText('Mensalistas')).toBeInTheDocument();
    });

    it('deve renderizar corretamente quando fechado', () => {
      render(<Sidebar isOpen={false} toggleSidebar={mockToggleSidebar} />);
      
      expect(screen.getByAltText('Logo SmartPark Reduzida')).toBeInTheDocument();
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
      expect(screen.queryByText('Garagens')).not.toBeInTheDocument();
      expect(screen.queryByText('Mensalistas')).not.toBeInTheDocument();
    });
  });

  describe('Estados do sidebar', () => {
    it('deve aplicar classes corretas quando aberto', () => {
      const { container } = render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const headerDiv = container.querySelector('.p-6');
      expect(headerDiv).toBeInTheDocument();
      
      const navElement = container.querySelector('.p-4');
      expect(navElement).toBeInTheDocument();
    });

    it('deve aplicar classes corretas quando fechado', () => {
      const { container } = render(<Sidebar isOpen={false} toggleSidebar={mockToggleSidebar} />);
      
      const headerDiv = container.querySelector('.p-2');
      expect(headerDiv).toBeInTheDocument();
      
      const navElement = container.querySelector('.p-2.space-y-2');
      expect(navElement).toBeInTheDocument();
    });
  });

  describe('Navegação e links', () => {
    it('deve renderizar todos os itens de menu', () => {
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      expect(screen.getByTestId('house-icon')).toBeInTheDocument();
      expect(screen.getByTestId('building2-icon')).toBeInTheDocument();
      expect(screen.getByTestId('car-icon')).toBeInTheDocument();
    });

    it('deve destacar o item ativo corretamente', () => {
      mockUsePathname.mockReturnValue('/authenticatedPages/welcome');
      
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink).toHaveClass('bg-[#7ad33e]', 'text-white');
    });

    it('deve aplicar estilos hover para itens não ativos', () => {
      mockUsePathname.mockReturnValue('/authenticatedPages/welcome');
      
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const garagesLink = screen.getByText('Garagens').closest('a');
      expect(garagesLink).toHaveClass('text-gray-800', 'hover:bg-gray-100');
    });

    it('deve ter links corretos para cada item de menu', () => {
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const homeLink = screen.getByText('Home').closest('a');
      const garagesLink = screen.getByText('Garagens').closest('a');
      const monthlyPayersLink = screen.getByText('Mensalistas').closest('a');
      
      expect(homeLink).toHaveAttribute('href', '/authenticatedPages/welcome');
      expect(garagesLink).toHaveAttribute('href', '/authenticatedPages/garages');
      expect(monthlyPayersLink).toHaveAttribute('href', '/authenticatedPages/monthlyPayers');
    });
  });

  describe('Funcionalidade de toggle', () => {
    it('deve chamar toggleSidebar quando botão de fechar é clicado (sidebar aberto)', () => {
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const closeButton = screen.getByLabelText('Fechar sidebar');
      fireEvent.click(closeButton);
      
      expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
    });

    it('deve chamar toggleSidebar quando logo pequeno é clicado (sidebar fechado)', () => {
      render(<Sidebar isOpen={false} toggleSidebar={mockToggleSidebar} />);
      
      const smallLogo = screen.getByAltText('Logo SmartPark Reduzida');
      fireEvent.click(smallLogo);
      
      expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
    });

    it('deve mostrar ícone ChevronLeft no botão de fechar', () => {
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      expect(screen.getByTestId('chevron-left-icon')).toBeInTheDocument();
    });
  });

  describe('Responsividade e layout', () => {
    it('deve ter estrutura de layout correta', () => {
      const { container } = render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass('h-full', 'bg-white', 'border-r', 'border-gray-200');
    });

    it('deve ter espaçamento correto entre itens de menu', () => {
      const { container } = render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('space-y-2');
    });

    it('deve centralizar ícones quando sidebar está fechado', () => {
      const { container } = render(<Sidebar isOpen={false} toggleSidebar={mockToggleSidebar} />);
      
      const links = container.querySelectorAll('a');
      links.forEach(link => {
        expect(link).toHaveClass('justify-center');
      });
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter aria-label no botão de fechar', () => {
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const closeButton = screen.getByLabelText('Fechar sidebar');
      expect(closeButton).toBeInTheDocument();
    });

    it('deve ter title nos links quando sidebar está fechado', () => {
      render(<Sidebar isOpen={false} toggleSidebar={mockToggleSidebar} />);
      
      const homeLink = screen.getByTestId('house-icon').closest('a');
      const garagesLink = screen.getByTestId('building2-icon').closest('a');
      const monthlyPayersLink = screen.getByTestId('car-icon').closest('a');
      
      expect(homeLink).toHaveAttribute('title', 'Home');
      expect(garagesLink).toHaveAttribute('title', 'Garagens');
      expect(monthlyPayersLink).toHaveAttribute('title', 'Mensalistas');
    });

    it('não deve ter title nos links quando sidebar está aberto', () => {
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink).not.toHaveAttribute('title');
    });
  });

  describe('Diferentes rotas ativas', () => {
    it('deve destacar Garagens quando na rota de garagens', () => {
      mockUsePathname.mockReturnValue('/authenticatedPages/garages');
      
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const garagesLink = screen.getByText('Garagens').closest('a');
      expect(garagesLink).toHaveClass('bg-[#7ad33e]', 'text-white');
    });

    it('deve destacar Mensalistas quando na rota de mensalistas', () => {
      mockUsePathname.mockReturnValue('/authenticatedPages/monthlyPayers');
      
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const monthlyPayersLink = screen.getByText('Mensalistas').closest('a');
      expect(monthlyPayersLink).toHaveClass('bg-[#7ad33e]', 'text-white');
    });

    it('não deve destacar nenhum item quando em rota não mapeada', () => {
      mockUsePathname.mockReturnValue('/other-route');
      
      const { container } = render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const activeLinks = container.querySelectorAll('.bg-\\[\\#7ad33e\\]');
      expect(activeLinks).toHaveLength(0);
    });
  });

  describe('Imagens e assets', () => {
    it('deve renderizar logo principal quando aberto', () => {
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const logo = screen.getByAltText('Logo SmartPark');
      expect(logo).toHaveAttribute('width', '130');
      expect(logo).toHaveAttribute('height', '90');
    });

    it('deve renderizar logo reduzido quando fechado', () => {
      render(<Sidebar isOpen={false} toggleSidebar={mockToggleSidebar} />);
      
      const smallLogo = screen.getByAltText('Logo SmartPark Reduzida');
      expect(smallLogo).toHaveAttribute('width', '40');
      expect(smallLogo).toHaveAttribute('height', '40');
      
      // Verificar se o botão pai tem as classes corretas
      const logoButton = smallLogo.closest('button');
      expect(logoButton).toHaveClass('cursor-pointer', 'rounded-md');
    });
  });
});