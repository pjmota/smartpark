import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import Login from './page';
import { useAuth } from '@/context/AuthContext/AuthContext';
import { logger } from '@/lib/logger';

jest.mock('@/context/AuthContext/AuthContext');
jest.mock('react-toastify');
jest.mock('@/lib/logger');
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
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

  describe('Rendering', () => {
    it('should render all page elements', () => {
      render(<Login />);

      expect(screen.getByAltText('Logo SmartPark')).toBeInTheDocument();
      expect(screen.getByText('Entre com suas credenciais para acessar o sistema')).toBeInTheDocument();
      expect(screen.getByLabelText('Usuário')).toBeInTheDocument();
      expect(screen.getByLabelText('Senha')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite seu usuário')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
    });

    it('should have proper semantic structure', () => {
      render(<Login />);

      const usernameInput = screen.getByLabelText('Usuário');
      const passwordInput = screen.getByLabelText('Senha');

      expect(usernameInput).toHaveAttribute('type', 'text');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(usernameInput).toHaveAttribute('id', 'user');
      expect(passwordInput).toHaveAttribute('id', 'password');
    });
  });

  describe('Form interaction', () => {
    it('should update field values when typing', () => {
      render(<Login />);

      const usernameInput = screen.getByLabelText('Usuário');
      const passwordInput = screen.getByLabelText('Senha');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'testpass' } });

      expect(usernameInput).toHaveValue('testuser');
      expect(passwordInput).toHaveValue('testpass');
    });

    it('should clear validation errors when typing', () => {
      render(<Login />);

      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      const usernameInput = screen.getByLabelText('Usuário');

      fireEvent.click(submitButton);
      fireEvent.change(usernameInput, { target: { value: 'test' } });

      expect(screen.queryByText('O usuário é obrigatório')).not.toBeInTheDocument();
    });
  });

  describe('Form validation', () => {
    it('should show error when username is empty', () => {
      render(<Login />);

      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      const passwordInput = screen.getByLabelText('Senha');

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('should show error when password is empty', () => {
      render(<Login />);

      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      const usernameInput = screen.getByLabelText('Usuário');

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.click(submitButton);

      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('should validate form with filled fields', async () => {
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
      });
    });
  });

  describe('Form submission', () => {
    it('should login successfully', async () => {
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

    it('should handle login error', async () => {
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

  describe('Loading state', () => {
    it('should show loading during submission', () => {
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

      expect(submitButton).toBeDisabled();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should allow submission when not loading', () => {
      render(<Login />);

      const submitButton = screen.getByRole('button', { name: 'Entrar' });

      expect(submitButton).not.toBeDisabled();
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have labels associated with inputs', () => {
      render(<Login />);

      const usernameInput = screen.getByLabelText('Usuário');
      const passwordInput = screen.getByLabelText('Senha');

      expect(usernameInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it('should have informative placeholders', () => {
      render(<Login />);

      expect(screen.getByPlaceholderText('Digite seu usuário')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument();
    });

    it('should have button with clear text', () => {
      render(<Login />);

      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('Default submission prevention', () => {
    it('should call preventDefault on submit event', async () => {
      render(<Login />);

      const usernameInput = screen.getByLabelText('Usuário');
      const passwordInput = screen.getByLabelText('Senha');
      const submitButton = screen.getByRole('button', { name: 'Entrar' });

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          username: 'testuser',
          password: 'password123'
        });
      });
    });
  });
});