import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthProviderWrapper from './AuthProviderWrapper';

// Mock do AuthProvider
jest.mock('@/context/AuthContext/AuthContext', () => ({
  AuthProvider: jest.fn(({ children }) => (
    <div data-testid="auth-provider-mock">{children}</div>
  )),
}));

// Importar o mock após a definição
import { AuthProvider } from '@/context/AuthContext/AuthContext';
const mockAuthProvider = AuthProvider as jest.MockedFunction<typeof AuthProvider>;

describe('AuthProviderWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização básica', () => {
    it('deve renderizar o AuthProvider com children', () => {
      render(
        <AuthProviderWrapper>
          <div data-testid="test-child">Test Child</div>
        </AuthProviderWrapper>
      );

      expect(screen.getByTestId('auth-provider-mock')).toBeInTheDocument();
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('deve chamar AuthProvider com as props corretas', () => {
      const testChild = <div data-testid="test-child">Test Content</div>;
      
      render(<AuthProviderWrapper>{testChild}</AuthProviderWrapper>);

      expect(mockAuthProvider).toHaveBeenCalledTimes(1);
      expect(mockAuthProvider).toHaveBeenCalledWith(
        { children: testChild },
        undefined
      );
    });

    it('deve renderizar sem children', () => {
      render(<AuthProviderWrapper>{null}</AuthProviderWrapper>);

      expect(screen.getByTestId('auth-provider-mock')).toBeInTheDocument();
      expect(mockAuthProvider).toHaveBeenCalledWith(
        { children: null },
        undefined
      );
    });
  });

  describe('Funcionalidade de wrapper', () => {
    it('deve passar múltiplos children para o AuthProvider', () => {
      render(
        <AuthProviderWrapper>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <span data-testid="child-3">Child 3</span>
        </AuthProviderWrapper>
      );

      expect(screen.getByTestId('auth-provider-mock')).toBeInTheDocument();
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('deve preservar a estrutura dos children', () => {
      render(
        <AuthProviderWrapper>
          <div data-testid="parent">
            <span data-testid="nested-child">Nested Content</span>
          </div>
        </AuthProviderWrapper>
      );

      expect(screen.getByTestId('auth-provider-mock')).toBeInTheDocument();
      expect(screen.getByTestId('parent')).toBeInTheDocument();
      expect(screen.getByTestId('nested-child')).toBeInTheDocument();
      expect(screen.getByText('Nested Content')).toBeInTheDocument();
    });

    it('deve funcionar com diferentes tipos de children', () => {
      render(
        <AuthProviderWrapper>
          <div>Div Element</div>
          <span>Span Element</span>
          <p>Paragraph Element</p>
          {'String Child'}
          {123}
        </AuthProviderWrapper>
      );

      expect(screen.getByTestId('auth-provider-mock')).toBeInTheDocument();
      expect(screen.getByText('Div Element')).toBeInTheDocument();
      expect(screen.getByText('Span Element')).toBeInTheDocument();
      expect(screen.getByText('Paragraph Element')).toBeInTheDocument();
      // String Child e 123 podem estar quebrados por elementos adjacentes, então vamos verificar se existem no DOM
      expect(screen.getByTestId('auth-provider-mock')).toHaveTextContent('String Child');
      expect(screen.getByTestId('auth-provider-mock')).toHaveTextContent('123');
    });
  });

  describe('Integração com AuthProvider', () => {
    it('deve importar AuthProvider do caminho correto', () => {
      render(
        <AuthProviderWrapper>
          <div>Test</div>
        </AuthProviderWrapper>
      );

      // Verifica se o mock foi chamado, indicando que a importação funcionou
      expect(mockAuthProvider).toHaveBeenCalled();
    });

    it('deve funcionar como um wrapper transparente', () => {
      const TestComponent = () => <div data-testid="test-component">Test</div>;
      
      render(
        <AuthProviderWrapper>
          <TestComponent />
        </AuthProviderWrapper>
      );

      expect(screen.getByTestId('auth-provider-mock')).toBeInTheDocument();
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });

    it('deve manter a hierarquia de componentes', () => {
      render(
        <AuthProviderWrapper>
          <div data-testid="level-1">
            <div data-testid="level-2">
              <div data-testid="level-3">Deep nested</div>
            </div>
          </div>
        </AuthProviderWrapper>
      );

      expect(screen.getByTestId('auth-provider-mock')).toBeInTheDocument();
      expect(screen.getByTestId('level-1')).toBeInTheDocument();
      expect(screen.getByTestId('level-2')).toBeInTheDocument();
      expect(screen.getByTestId('level-3')).toBeInTheDocument();
    });
  });

  describe('Props e TypeScript', () => {
    it('deve aceitar children como ReactNode', () => {
      const reactNode = (
        <>
          <div>Fragment Child 1</div>
          <div>Fragment Child 2</div>
        </>
      );

      render(<AuthProviderWrapper>{reactNode}</AuthProviderWrapper>);

      expect(screen.getByTestId('auth-provider-mock')).toBeInTheDocument();
      expect(screen.getByText('Fragment Child 1')).toBeInTheDocument();
      expect(screen.getByText('Fragment Child 2')).toBeInTheDocument();
    });

    it('deve funcionar com children undefined', () => {
      render(<AuthProviderWrapper>{undefined}</AuthProviderWrapper>);

      expect(screen.getByTestId('auth-provider-mock')).toBeInTheDocument();
      expect(mockAuthProvider).toHaveBeenCalledWith(
        { children: undefined },
        undefined
      );
    });

    it('deve funcionar com children como array', () => {
      const childrenArray = [
        <div key="1" data-testid="array-child-1">Array Child 1</div>,
        <div key="2" data-testid="array-child-2">Array Child 2</div>,
      ];

      render(<AuthProviderWrapper>{childrenArray}</AuthProviderWrapper>);

      expect(screen.getByTestId('auth-provider-mock')).toBeInTheDocument();
      expect(screen.getByTestId('array-child-1')).toBeInTheDocument();
      expect(screen.getByTestId('array-child-2')).toBeInTheDocument();
    });
  });

  describe('Casos extremos', () => {
    it('deve funcionar com children como boolean false', () => {
      render(<AuthProviderWrapper>{false}</AuthProviderWrapper>);

      expect(screen.getByTestId('auth-provider-mock')).toBeInTheDocument();
      expect(mockAuthProvider).toHaveBeenCalledWith(
        { children: false },
        undefined
      );
    });

    it('deve funcionar com children como boolean true', () => {
      render(<AuthProviderWrapper>{true}</AuthProviderWrapper>);

      expect(screen.getByTestId('auth-provider-mock')).toBeInTheDocument();
      expect(mockAuthProvider).toHaveBeenCalledWith(
        { children: true },
        undefined
      );
    });

    it('deve funcionar com children como número zero', () => {
      render(<AuthProviderWrapper>{0}</AuthProviderWrapper>);

      expect(screen.getByTestId('auth-provider-mock')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('deve funcionar com children como string vazia', () => {
      render(<AuthProviderWrapper>{''}</AuthProviderWrapper>);

      expect(screen.getByTestId('auth-provider-mock')).toBeInTheDocument();
      expect(mockAuthProvider).toHaveBeenCalledWith(
        { children: '' },
        undefined
      );
    });

    it('deve lidar com re-renderizações', () => {
      const { rerender } = render(
        <AuthProviderWrapper>
          <div data-testid="initial">Initial</div>
        </AuthProviderWrapper>
      );

      expect(screen.getByTestId('initial')).toBeInTheDocument();

      rerender(
        <AuthProviderWrapper>
          <div data-testid="updated">Updated</div>
        </AuthProviderWrapper>
      );

      expect(screen.getByTestId('updated')).toBeInTheDocument();
      expect(screen.queryByTestId('initial')).not.toBeInTheDocument();
    });
  });

  describe('Renderização condicional', () => {
    it('deve renderizar consistentemente', () => {
      const { rerender } = render(
        <AuthProviderWrapper>
          <div>Content 1</div>
        </AuthProviderWrapper>
      );

      expect(screen.getByTestId('auth-provider-mock')).toBeInTheDocument();

      rerender(
        <AuthProviderWrapper>
          <div>Content 2</div>
        </AuthProviderWrapper>
      );

      expect(screen.getByTestId('auth-provider-mock')).toBeInTheDocument();
    });

    it('deve manter a estrutura do provider', () => {
      render(
        <AuthProviderWrapper>
          <div data-testid="content">Dynamic Content</div>
        </AuthProviderWrapper>
      );

      const providerElement = screen.getByTestId('auth-provider-mock');
      const contentElement = screen.getByTestId('content');

      expect(providerElement).toBeInTheDocument();
      expect(contentElement).toBeInTheDocument();
      expect(providerElement).toContainElement(contentElement);
    });
  });
});