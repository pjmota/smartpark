import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './index';

// Mock do contexto de autenticação
const mockLogout = jest.fn();
const mockUseAuth = jest.fn();

jest.mock('@/context/AuthContext/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock do Material-UI
jest.mock('@mui/material', () => ({
  Button: ({ children, onClick, variant, size }: any) => (
    <button
      data-testid="logout-button"
      onClick={onClick}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  ),
  InputAdornment: ({ children, position }: any) => (
    <div data-testid={`input-adornment-${position}`}>
      {children}
    </div>
  ),
}));

// Mock dos ícones lucide-react
jest.mock('lucide-react', () => ({
  LogOut: ({ className, ...props }: any) => (
    <div data-testid="logout-icon" className={className} {...props}>
      LogOut
    </div>
  ),
  User: ({ className, ...props }: any) => (
    <div data-testid="user-icon" className={className} {...props}>
      User
    </div>
  ),
}));

describe('Header', () => {
  const defaultUser = {
    id: '1',
    username: 'João Silva',
    email: 'joao@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: defaultUser,
      logout: mockLogout,
    });
  });

  describe('Basic rendering', () => {
    it('should render header correctly', () => {
      render(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('flex', 'justify-end', 'items-center');
    });

    it('should render user icon', () => {
      render(<Header />);
      
      const userIcon = screen.getByTestId('user-icon');
      expect(userIcon).toBeInTheDocument();
      expect(userIcon).toHaveAttribute('aria-label', 'Ícone de usuário');
    });

    it('should render logout button', () => {
      render(<Header />);
      
      const logoutButton = screen.getByTestId('logout-button');
      expect(logoutButton).toBeInTheDocument();
      expect(logoutButton).toHaveAttribute('data-variant', 'outlined');
      expect(logoutButton).toHaveAttribute('data-size', 'small');
    });

    it('should render logout icon', () => {
      render(<Header />);
      
      const logoutIcon = screen.getByTestId('logout-icon');
      expect(logoutIcon).toBeInTheDocument();
    });
  });

  describe('User display', () => {
    it('should display username when available', () => {
      render(<Header />);
      
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });

    it('should display "Usuário" when user.username is not available', () => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', email: 'test@example.com' },
        logout: mockLogout,
      });
      
      render(<Header />);
      
      expect(screen.getAllByText('Usuário')).toHaveLength(2); // Uma para desktop, uma para mobile
    });

    it('should display "Usuário" when user is null', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        logout: mockLogout,
      });
      
      render(<Header />);
      
      expect(screen.getAllByText('Usuário')).toHaveLength(2); // Uma para desktop, uma para mobile
    });

    it('should display full name on larger screens', () => {
      render(<Header />);
      
      const fullNameElement = screen.getByText('João Silva');
      expect(fullNameElement).toHaveClass('hidden', 'sm:inline');
    });

    it('should display only first name on smaller screens', () => {
      render(<Header />);
      
      const firstNameElement = screen.getByText('João');
      expect(firstNameElement).toHaveClass('sm:hidden');
    });
  });

  describe('Logout functionality', () => {
    it('should call logout when button is clicked', () => {
      render(<Header />);
      
      const logoutButton = screen.getByTestId('logout-button');
      fireEvent.click(logoutButton);
      
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('should work even when logout is not available', () => {
      const mockLogoutUndefined = jest.fn();
      mockUseAuth.mockReturnValue({
        user: defaultUser,
        logout: mockLogoutUndefined,
      });
      
      render(<Header />);
      
      const logoutButton = screen.getByTestId('logout-button');
      fireEvent.click(logoutButton);
      
      expect(mockLogoutUndefined).toHaveBeenCalledTimes(1);
    });
  });

  describe('Responsiveness', () => {
    it('should have responsive classes for height', () => {
      render(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('h-12', 'sm:h-16');
    });

    it('should have responsive classes for padding', () => {
      render(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('px-2', 'sm:px-6');
    });

    it('should have responsive classes for spacing', () => {
      render(<Header />);
      
      const container = screen.getByRole('banner').querySelector('div');
      expect(container).toHaveClass('space-x-2', 'sm:space-x-4');
    });

    it('should have responsive classes for text', () => {
      render(<Header />);
      
      const container = screen.getByRole('banner').querySelector('div');
      expect(container).toHaveClass('text-xs', 'sm:text-sm');
    });
  });

  describe('Accessibility', () => {
    it('should have banner role for header', () => {
      render(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('should have aria-label on user icon', () => {
      render(<Header />);
      
      const userIcon = screen.getByTestId('user-icon');
      expect(userIcon).toHaveAttribute('aria-label', 'Ícone de usuário');
    });

    it('should have pointer cursor on user icon', () => {
      render(<Header />);
      
      const userIcon = screen.getByTestId('user-icon');
      expect(userIcon).toHaveClass('cursor-pointer');
    });
  });

  describe('Styles and layout', () => {
    it('should have white background', () => {
      render(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('bg-white');
    });

    it('should have flex layout with justify-end', () => {
      render(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('flex', 'justify-end', 'items-center');
    });

    it('should have correct colors for icons', () => {
      render(<Header />);
      
      const userIcon = screen.getByTestId('user-icon');
      expect(userIcon).toHaveClass('text-gray-400');
    });
  });

  describe('Different user types', () => {
    it('should handle user with only first name', () => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', username: 'João', email: 'joao@example.com' },
        logout: mockLogout,
      });
      
      render(<Header />);
      
      expect(screen.getAllByText('João')).toHaveLength(2); // Uma para desktop, uma para mobile
    });

    it('should handle user with multiple names', () => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', username: 'Maria da Silva Santos', email: 'maria@example.com' },
        logout: mockLogout,
      });
      
      render(<Header />);
      
      expect(screen.getByText('Maria da Silva Santos')).toBeInTheDocument();
      expect(screen.getByText('Maria')).toBeInTheDocument();
    });

    it('should handle user with special characters in name', () => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', username: '', email: 'test@example.com' },
        logout: mockLogout,
      });
      
      render(<Header />);
      
      expect(screen.getAllByText('Usuário')).toHaveLength(2); // Uma para desktop, uma para mobile
    });
  });

  describe('Edge cases', () => {
    it('should work when useAuth returns incomplete data', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        logout: mockLogout,
      });
      
      render(<Header />);
      
      expect(screen.getAllByText('Usuário')).toHaveLength(2); // Uma para desktop, uma para mobile
    });

    it('should work with empty user object', () => {
      mockUseAuth.mockReturnValue({
        user: {},
        logout: mockLogout,
      });
      
      render(<Header />);
      
      expect(screen.getAllByText('Usuário')).toHaveLength(2); // Uma para desktop, uma para mobile
    });
  });
});