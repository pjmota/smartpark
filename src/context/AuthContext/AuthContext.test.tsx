import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from './AuthContext';
import { authService } from '@/services/authService/auth.service';

// Mocks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/services/authService/auth.service', () => ({
  authService: {
    isAuthenticated: jest.fn(),
    getCurrentUser: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  },
}));

const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
};

// Componente de teste para usar o hook useAuth
  const TestComponent = () => {
    const { user, loading, _error, login, logout, isAuthenticated } = useAuth();
    
    const handleLogin = async () => {
      try {
        await login({ username: 'test', password: 'test123' });
      } catch {
        // Erro já tratado pelo contexto AuthContext
        // Não é necessário re-lançar pois o contexto já gerencia o estado de erro
        // Removido console.error para evitar logs desnecessários nos testes
      }
    };
    
    return (
      <div>
        <div data-testid="user">{user ? user.username : 'null'}</div>
        <div data-testid="loading">{loading.toString()}</div>
        <div data-testid="error">{_error || 'null'}</div>
        <div data-testid="isAuthenticated">{isAuthenticated.toString()}</div>
        <button 
          data-testid="login-btn" 
          onClick={handleLogin}
        >
          Login
        </button>
        <button data-testid="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    );
  };

// Componente para testar hook fora do provider
const TestComponentOutsideProvider = () => {
  const auth = useAuth();
  return <div>{auth.user?.username}</div>;
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  describe('AuthProvider', () => {
    it('deve inicializar corretamente', async () => {
      (authService.isAuthenticated as jest.Mock).mockReturnValue(false);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Aguardar inicialização completa
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
        expect(screen.getByTestId('user')).toHaveTextContent('null');
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      });
    });

    it('deve carregar usuário autenticado na inicialização', async () => {
      const mockUser = {
        username: 'testuser',
        token: 'mock-token',
        expiredIn: '2024-12-31'
      };

      (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (authService.getCurrentUser as jest.Mock).mockReturnValue(mockUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('testuser');
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
    });

    it('deve lidar com erro na inicialização', async () => {
      (authService.isAuthenticated as jest.Mock).mockImplementation(() => {
        throw new Error('Erro de inicialização');
      });

      // Mock console.error para evitar logs no teste
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
        expect(consoleSpy).toHaveBeenCalledWith('Erro ao inicializar autenticação:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });

    it('deve realizar login com sucesso', async () => {
      const mockResponse = {
        user: { username: 'testuser' },
        token: 'mock-token',
        expiredIn: '2024-12-31'
      };

      (authService.isAuthenticated as jest.Mock).mockReturnValue(false);
      (authService.login as jest.Mock).mockResolvedValue(mockResponse);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Aguardar inicialização
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      // Realizar login
      await act(async () => {
        screen.getByTestId('login-btn').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('testuser');
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
        expect(mockPush).toHaveBeenCalledWith('/authenticatedPages/welcome');
      });
    });

    it('deve lidar com erro no login', async () => {
      const mockError = new Error('Credenciais inválidas');
      
      (authService.isAuthenticated as jest.Mock).mockReturnValue(false);
      (authService.login as jest.Mock).mockRejectedValue(mockError);

      // Mock console.error para evitar logs no teste
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Aguardar inicialização
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      // Tentar login
      await act(async () => {
        screen.getByTestId('login-btn').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Credenciais inválidas');
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      consoleSpy.mockRestore();
    });

    it('deve lidar com erro desconhecido no login', async () => {
      (authService.isAuthenticated as jest.Mock).mockReturnValue(false);
      (authService.login as jest.Mock).mockRejectedValue('Erro string');

      // Mock console.error para evitar logs no teste
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Aguardar inicialização
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      // Tentar login
      await act(async () => {
        screen.getByTestId('login-btn').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Erro desconhecido durante o login');
      });

      consoleSpy.mockRestore();
    });

    it('deve realizar logout com sucesso', async () => {
      const mockUser = {
        username: 'testuser',
        token: 'mock-token',
        expiredIn: '2024-12-31'
      };

      (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (authService.getCurrentUser as jest.Mock).mockReturnValue(mockUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Aguardar carregamento do usuário
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('testuser');
      });

      // Realizar logout
      act(() => {
        screen.getByTestId('logout-btn').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('null');
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
        expect(screen.getByTestId('error')).toHaveTextContent('null');
        expect(authService.logout).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith('/login');
      });
    });
  });

  describe('useAuth hook', () => {
    it('deve lançar erro quando usado fora do AuthProvider', () => {
      // Mock console.error para evitar logs no teste
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponentOutsideProvider />);
      }).toThrow('useAuth deve ser usado dentro de um AuthProvider');

      consoleSpy.mockRestore();
    });

    it('deve retornar o contexto quando usado dentro do AuthProvider', async () => {
      (authService.isAuthenticated as jest.Mock).mockReturnValue(false);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('null');
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
        expect(screen.getByTestId('error')).toHaveTextContent('null');
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      });
    });
  });

  describe('Memoização', () => {
    it('deve memoizar o valor do contexto corretamente', async () => {
      (authService.isAuthenticated as jest.Mock).mockReturnValue(false);

      const { rerender } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      // Re-renderizar com as mesmas props
      rerender(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // O contexto deve permanecer estável
      expect(screen.getByTestId('user')).toHaveTextContent('null');
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
    });
  });
});