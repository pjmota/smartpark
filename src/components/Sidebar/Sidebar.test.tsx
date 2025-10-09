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
  const MockLink = ({ children, href, className, title }: any) => (
    <a href={href} className={className} title={title}>
      {children}
    </a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

jest.mock('next/image', () => {
  const MockImage = ({ src, alt, width, height, className, onClick }: any) => (
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
      aria-label={alt}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={src} 
        alt={alt} 
        width={width} 
        height={height}
      />
    </button>
  );
  MockImage.displayName = 'MockImage';
  return MockImage;
});

jest.mock('next/image', () => {
  const MockImage = ({ src, alt, width, height, className, onClick }: any) => (
    <button 
      type="button"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.(e);
        }
      }}
      className={className}
      style={{ 
        width: width || 'auto', 
        height: height || 'auto',
        border: 'none',
        background: 'none',
        padding: 0,
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={width} height={height} />
    </button>
  );
  MockImage.displayName = 'MockImage';
  return MockImage;
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

  describe('Basic rendering', () => {
    it('should render correctly when open', () => {
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      expect(screen.getByAltText('Logo SmartPark')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Garagens')).toBeInTheDocument();
      expect(screen.getByText('Mensalistas')).toBeInTheDocument();
    });

    it('should render correctly when closed', () => {
      render(<Sidebar isOpen={false} toggleSidebar={mockToggleSidebar} />);
      
      expect(screen.getByAltText('Logo SmartPark Reduzida')).toBeInTheDocument();
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
      expect(screen.queryByText('Garagens')).not.toBeInTheDocument();
      expect(screen.queryByText('Mensalistas')).not.toBeInTheDocument();
    });
  });

  describe('Sidebar states', () => {
    it('should apply correct classes when open', () => {
      const { container } = render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const headerDiv = container.querySelector('.p-6');
      expect(headerDiv).toBeInTheDocument();
      
      const navElement = container.querySelector('.p-4');
      expect(navElement).toBeInTheDocument();
    });

    it('should apply correct classes when closed', () => {
      const { container } = render(<Sidebar isOpen={false} toggleSidebar={mockToggleSidebar} />);
      
      const headerDiv = container.querySelector('.p-2');
      expect(headerDiv).toBeInTheDocument();
      
      const navElement = container.querySelector('.p-2.space-y-2');
      expect(navElement).toBeInTheDocument();
    });
  });

  describe('Navigation and links', () => {
    it('should render all menu items', () => {
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      expect(screen.getByTestId('house-icon')).toBeInTheDocument();
      expect(screen.getByTestId('building2-icon')).toBeInTheDocument();
      expect(screen.getByTestId('car-icon')).toBeInTheDocument();
    });

    it('should highlight active item correctly', () => {
      mockUsePathname.mockReturnValue('/authenticatedPages/welcome');
      
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink).toHaveClass('bg-[#7ad33e]', 'text-white');
    });

    it('should apply hover styles for non-active items', () => {
      mockUsePathname.mockReturnValue('/authenticatedPages/welcome');
      
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const garagesLink = screen.getByText('Garagens').closest('a');
      expect(garagesLink).toHaveClass('text-gray-800', 'hover:bg-gray-100');
    });

    it('should have correct links for each menu item', () => {
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const homeLink = screen.getByText('Home').closest('a');
      const garagesLink = screen.getByText('Garagens').closest('a');
      const monthlyPayersLink = screen.getByText('Mensalistas').closest('a');
      
      expect(homeLink).toHaveAttribute('href', '/authenticatedPages/welcome');
      expect(garagesLink).toHaveAttribute('href', '/authenticatedPages/garages');
      expect(monthlyPayersLink).toHaveAttribute('href', '/authenticatedPages/monthlyPayers');
    });
  });

  describe('Toggle functionality', () => {
    it('should call toggleSidebar when close button is clicked (sidebar open)', () => {
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const closeButton = screen.getByLabelText('Fechar sidebar');
      fireEvent.click(closeButton);
      
      expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
    });

    it('should call toggleSidebar when small logo is clicked (sidebar closed)', () => {
      render(<Sidebar isOpen={false} toggleSidebar={mockToggleSidebar} />);
      
      const smallLogo = screen.getByAltText('Logo SmartPark Reduzida');
      fireEvent.click(smallLogo);
      
      expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
    });

    it('should show ChevronLeft icon in close button', () => {
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      expect(screen.getByTestId('chevron-left-icon')).toBeInTheDocument();
    });
  });

  describe('Responsiveness and layout', () => {
    it('should have correct layout structure', () => {
      const { container } = render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass('h-full', 'bg-white', 'border-r', 'border-gray-200');
    });

    it('should have correct spacing between menu items', () => {
      const { container } = render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('space-y-2');
    });

    it('should center icons when sidebar is closed', () => {
      const { container } = render(<Sidebar isOpen={false} toggleSidebar={mockToggleSidebar} />);
      
      const links = container.querySelectorAll('a');
      links.forEach(link => {
        expect(link).toHaveClass('justify-center');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label on close button', () => {
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const closeButton = screen.getByLabelText('Fechar sidebar');
      expect(closeButton).toBeInTheDocument();
    });

    it('should have title on links when sidebar is closed', () => {
      render(<Sidebar isOpen={false} toggleSidebar={mockToggleSidebar} />);
      
      const homeLink = screen.getByTestId('house-icon').closest('a');
      const garagesLink = screen.getByTestId('building2-icon').closest('a');
      const monthlyPayersLink = screen.getByTestId('car-icon').closest('a');
      
      expect(homeLink).toHaveAttribute('title', 'Home');
      expect(garagesLink).toHaveAttribute('title', 'Garagens');
      expect(monthlyPayersLink).toHaveAttribute('title', 'Mensalistas');
    });

    it('should not have title on links when sidebar is open', () => {
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink).not.toHaveAttribute('title');
    });
  });

  describe('Different active routes', () => {
    it('should highlight Garages when on garages route', () => {
      mockUsePathname.mockReturnValue('/authenticatedPages/garages');
      
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const garagesLink = screen.getByText('Garagens').closest('a');
      expect(garagesLink).toHaveClass('bg-[#7ad33e]', 'text-white');
    });

    it('should highlight Monthly Payers when on monthly payers route', () => {
      mockUsePathname.mockReturnValue('/authenticatedPages/monthlyPayers');
      
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const monthlyPayersLink = screen.getByText('Mensalistas').closest('a');
      expect(monthlyPayersLink).toHaveClass('bg-[#7ad33e]', 'text-white');
    });

    it('should not highlight any item when on unmapped route', () => {
      mockUsePathname.mockReturnValue('/other-route');
      
      const { container } = render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const activeLinks = container.querySelectorAll('.bg-\\[\\#7ad33e\\]');
      expect(activeLinks).toHaveLength(0);
    });
  });

  describe('Images and assets', () => {
    it('should render main logo when open', () => {
      render(<Sidebar isOpen={true} toggleSidebar={mockToggleSidebar} />);
      
      const logo = screen.getByAltText('Logo SmartPark');
      expect(logo).toHaveAttribute('width', '130');
      expect(logo).toHaveAttribute('height', '90');
    });

    it('should render reduced logo when closed', () => {
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