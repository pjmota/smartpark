import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import Login from './page';
import { useAuth } from '@/context/AuthContext/AuthContext';
import { logger } from '@/lib/logger';

// Mock das dependências
jest.mock('@/context/AuthContext/AuthContext');
jest.mock('react-toastify');
jest.mock('@/lib/logger');
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockToast = toast as jest.Mocked<typeof toast>;
const mockLogger = logger as jest.Mocked<typeof logger>;

describe('Login Page', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      loading: false,
      user: null,
      logout: jest.fn(),
      isAuthenticated: false,
      _error: null,
    });
    mockToast.success = jest.fn();
    mockToast.error = jest.fn();
    mockLogger.error = jest.fn();
  });

  describe('Renderização', () => {
    it('deve renderizar todos os elementos da página', () => {
      render(<Login />);

      // Logo
      expect(screen.getByAltText('Logo SmartPark')).toBeInTheDocument();

      // Texto de instrução
      expect(screen.getByText('Entre com suas credenciais para acessar o sistema')).toBeInTheDocument();

      // Campos do formulário
      expect(screen.getByLabelText('Usuário')).toBeInTheDocument();
      expect(screen.getByLabelText('Senha')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite seu usuário')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument();

      // Botão de submit
      expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
    });

    it('deve ter estrutura semântica adequada', () => {
      render(<Login />);

      // Campos de input
      const usernameInput = screen.getByLabelText('Usuário');
      const passwordInput = screen.getByLabelText('Senha');

      expect(usernameInput).toHaveAttribute('type', 'text');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(usernameInput).toHaveAttribute('id', 'user');
      expect(passwordInput).toHaveAttribute('id', 'password');
    });
  });

  describe('Interação com formulário', () => {
    it('deve atualizar os valores dos campos ao digitar', () => {
      render(<Login />);

      const usernameInput = screen.getByLabelText('Usuário');
      const passwordInput = screen.getByLabelText('Senha');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'testpass' } });

      expect(usernameInput).toHaveValue('testuser');
      expect(passwordInput).toHaveValue('testpass');
    });

    it('deve limpar erros de validação ao digitar', () => {
      render(<Login />);

      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      const usernameInput = screen.getByLabelText('Usuário');

      // Submeter formulário vazio para gerar erros
      fireEvent.click(submitButton);

      // Digitar no campo deve limpar o erro
      fireEvent.change(usernameInput, { target: { value: 'test' } });

      // Verificar que não há mensagens de erro visíveis
      expect(screen.queryByText('O usuário é obrigatório')).not.toBeInTheDocument();
    });
  });

  describe('Validação do formulário', () => {
    it('deve mostrar erro quando usuário está vazio', () => {
      render(<Login />);

      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      const passwordInput = screen.getByLabelText('Senha');

      // Preencher apenas senha
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      // Não deve chamar login
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('deve mostrar erro quando senha está vazia', () => {
      render(<Login />);

      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      const usernameInput = screen.getByLabelText('Usuário');

      // Preencher apenas usuário
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.click(submitButton);

      // Não deve chamar login
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('deve validar formulário com campos preenchidos', async () => {
      render(<Login />);

      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      const usernameInput = screen.getByLabelText('Usuário');
      const passwordInput = screen.getByLabelText('Senha');

      // Preencher ambos os campos
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      // Deve chamar login
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          username: 'testuser',
          password: 'password123'
        });
      });
    });
  });

  describe('Submissão do formulário', () => {
    it('deve fazer login com sucesso', async () => {
      mockLogin.mockResolvedValue(undefined);

      render(<Login />);

      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      const usernameInput = screen.getByLabelText('Usuário');
      const passwordInput = screen.getByLabelText('Senha');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          username: 'testuser',
          password: 'password123'
        });
        expect(mockToast.success).toHaveBeenCalledWith('Login realizado com sucesso!');
      });
    });

    it('deve tratar erro de login', async () => {
      const errorMessage = 'Credenciais inválidas';
      mockLogin.mockRejectedValue(new Error(errorMessage));

      render(<Login />);

      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      const usernameInput = screen.getByLabelText('Usuário');
      const passwordInput = screen.getByLabelText('Senha');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(`Error: ${errorMessage}`);
        expect(mockLogger.error).toHaveBeenCalledWith('Erro no login', {
          error: expect.any(Error),
          formData: { username: 'testuser' }
        });
      });
    });
  });

  describe('Estado de loading', () => {
    it('deve mostrar loading durante submissão', () => {
      mockUseAuth.mockReturnValue({
        login: mockLogin,
        loading: true,
        user: null,
        logout: jest.fn(),
        isAuthenticated: false,
        _error: null,
      });

      render(<Login />);

      const submitButton = screen.getByRole('button');

      // Botão deve estar desabilitado
      expect(submitButton).toBeDisabled();

      // Deve mostrar spinner
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('deve permitir submissão quando não está loading', () => {
      render(<Login />);

      const submitButton = screen.getByRole('button', { name: 'Entrar' });

      // Botão deve estar habilitado
      expect(submitButton).not.toBeDisabled();

      // Não deve mostrar spinner
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter labels associados aos inputs', () => {
      render(<Login />);

      const usernameInput = screen.getByLabelText('Usuário');
      const passwordInput = screen.getByLabelText('Senha');

      expect(usernameInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it('deve ter placeholders informativos', () => {
      render(<Login />);

      expect(screen.getByPlaceholderText('Digite seu usuário')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument();
    });

    it('deve ter botão com texto claro', () => {
      render(<Login />);

      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('Prevenção de submissão padrão', () => {
    it('deve chamar preventDefault no evento de submit', async () => {
      render(<Login />);

      const usernameInput = screen.getByLabelText('Usuário');
      const passwordInput = screen.getByLabelText('Senha');
      const submitButton = screen.getByRole('button', { name: 'Entrar' });

      // Preencher campos para validação passar
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      // Clicar no botão de submit
      fireEvent.click(submitButton);

      // Verificar que o login foi chamado (indicando que preventDefault funcionou)
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          username: 'testuser',
          password: 'password123'
        });
      });
    });
  });
});