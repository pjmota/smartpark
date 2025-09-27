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

  describe('Renderização básica', () => {
    it('deve renderizar o header corretamente', () => {
      render(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('flex', 'justify-end', 'items-center');
    });

    it('deve renderizar o ícone de usuário', () => {
      render(<Header />);
      
      const userIcon = screen.getByTestId('user-icon');
      expect(userIcon).toBeInTheDocument();
      expect(userIcon).toHaveAttribute('aria-label', 'Ícone de usuário');
    });

    it('deve renderizar o botão de logout', () => {
      render(<Header />);
      
      const logoutButton = screen.getByTestId('logout-button');
      expect(logoutButton).toBeInTheDocument();
      expect(logoutButton).toHaveAttribute('data-variant', 'outlined');
      expect(logoutButton).toHaveAttribute('data-size', 'small');
    });

    it('deve renderizar o ícone de logout', () => {
      render(<Header />);
      
      const logoutIcon = screen.getByTestId('logout-icon');
      expect(logoutIcon).toBeInTheDocument();
    });
  });

  describe('Exibição do usuário', () => {
    it('deve exibir o nome do usuário quando disponível', () => {
      render(<Header />);
      
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });

    it('deve exibir "Usuário" quando user.username não está disponível', () => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', email: 'test@example.com' },
        logout: mockLogout,
      });
      
      render(<Header />);
      
      expect(screen.getAllByText('Usuário')).toHaveLength(2); // Uma para desktop, uma para mobile
    });

    it('deve exibir "Usuário" quando user é null', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        logout: mockLogout,
      });
      
      render(<Header />);
      
      expect(screen.getAllByText('Usuário')).toHaveLength(2); // Uma para desktop, uma para mobile
    });

    it('deve exibir nome completo em telas maiores', () => {
      render(<Header />);
      
      const fullNameElement = screen.getByText('João Silva');
      expect(fullNameElement).toHaveClass('hidden', 'sm:inline');
    });

    it('deve exibir apenas primeiro nome em telas menores', () => {
      render(<Header />);
      
      const firstNameElement = screen.getByText('João');
      expect(firstNameElement).toHaveClass('sm:hidden');
    });
  });

  describe('Funcionalidade de logout', () => {
    it('deve chamar logout quando botão é clicado', () => {
      render(<Header />);
      
      const logoutButton = screen.getByTestId('logout-button');
      fireEvent.click(logoutButton);
      
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('deve funcionar mesmo quando logout não está disponível', () => {
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

  describe('Responsividade', () => {
    it('deve ter classes responsivas para altura', () => {
      render(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('h-12', 'sm:h-16');
    });

    it('deve ter classes responsivas para padding', () => {
      render(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('px-2', 'sm:px-6');
    });

    it('deve ter classes responsivas para espaçamento', () => {
      render(<Header />);
      
      const container = screen.getByRole('banner').querySelector('div');
      expect(container).toHaveClass('space-x-2', 'sm:space-x-4');
    });

    it('deve ter classes responsivas para texto', () => {
      render(<Header />);
      
      const container = screen.getByRole('banner').querySelector('div');
      expect(container).toHaveClass('text-xs', 'sm:text-sm');
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter role banner para o header', () => {
      render(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('deve ter aria-label no ícone de usuário', () => {
      render(<Header />);
      
      const userIcon = screen.getByTestId('user-icon');
      expect(userIcon).toHaveAttribute('aria-label', 'Ícone de usuário');
    });

    it('deve ter cursor pointer no ícone de usuário', () => {
      render(<Header />);
      
      const userIcon = screen.getByTestId('user-icon');
      expect(userIcon).toHaveClass('cursor-pointer');
    });
  });

  describe('Estilos e layout', () => {
    it('deve ter fundo branco', () => {
      render(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('bg-white');
    });

    it('deve ter layout flex com justify-end', () => {
      render(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('flex', 'justify-end', 'items-center');
    });

    it('deve ter cores corretas para ícones', () => {
      render(<Header />);
      
      const userIcon = screen.getByTestId('user-icon');
      expect(userIcon).toHaveClass('text-gray-400');
    });
  });

  describe('Diferentes tipos de usuário', () => {
    it('deve funcionar com nome de usuário simples', () => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', username: 'João', email: 'joao@example.com' },
        logout: mockLogout,
      });
      
      render(<Header />);
      
      expect(screen.getAllByText('João')).toHaveLength(2); // Uma para desktop, uma para mobile
    });

    it('deve funcionar com nome de usuário composto', () => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', username: 'Maria da Silva Santos', email: 'maria@example.com' },
        logout: mockLogout,
      });
      
      render(<Header />);
      
      expect(screen.getByText('Maria da Silva Santos')).toBeInTheDocument();
      expect(screen.getByText('Maria')).toBeInTheDocument();
    });

    it('deve funcionar com username vazio', () => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', username: '', email: 'test@example.com' },
        logout: mockLogout,
      });
      
      render(<Header />);
      
      expect(screen.getAllByText('Usuário')).toHaveLength(2); // Uma para desktop, uma para mobile
    });
  });

  describe('Casos extremos', () => {
    it('deve funcionar quando useAuth retorna dados incompletos', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        logout: mockLogout,
      });
      
      render(<Header />);
      
      expect(screen.getAllByText('Usuário')).toHaveLength(2); // Uma para desktop, uma para mobile
    });

    it('deve funcionar com user object vazio', () => {
      mockUseAuth.mockReturnValue({
        user: {},
        logout: mockLogout,
      });
      
      render(<Header />);
      
      expect(screen.getAllByText('Usuário')).toHaveLength(2); // Uma para desktop, uma para mobile
    });
  });
});