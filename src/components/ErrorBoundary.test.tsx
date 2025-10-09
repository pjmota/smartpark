import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from './ErrorBoundary';
import { logger } from '@/lib/logger';

jest.mock('@/lib/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Erro de teste');
  }
  return <div data-testid="success">Componente funcionando</div>;
};

const CustomFallback = () => (
  <div data-testid="custom-fallback">Erro customizado</div>
);

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Normal rendering', () => {
    it('should render children when there is no error', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('success')).toBeInTheDocument();
      expect(screen.getByText('Componente funcionando')).toBeInTheDocument();
    });

    it('should render multiple children when there is no error', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
    });
  });

  describe('Error capture', () => {
    it('should capture error and render default fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.queryByTestId('success')).not.toBeInTheDocument();
      expect(screen.getByText('Oops! Algo deu errado')).toBeInTheDocument();
      expect(screen.getByText(/Ocorreu um erro inesperado/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /recarregar página/i })).toBeInTheDocument();
    });

    it('should render custom fallback when provided', () => {
      render(
        <ErrorBoundary fallback={<CustomFallback />}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.queryByTestId('success')).not.toBeInTheDocument();
      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Erro customizado')).toBeInTheDocument();
      expect(screen.queryByText('Oops! Algo deu errado')).not.toBeInTheDocument();
    });

    it('should log error when captured', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(logger.error).toHaveBeenCalledWith(
        'ErrorBoundary capturou um erro',
        expect.objectContaining({
          error: 'Erro de teste',
          stack: expect.any(String),
          componentStack: expect.any(String),
        })
      );
    });
  });

  describe('UI de fallback padrão', () => {
    beforeEach(() => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
    });

    it('deve ter estrutura visual correta', () => {
      const container = screen.getByText('Oops! Algo deu errado').closest('.min-h-screen');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center', 'bg-gray-50');
    });

    it('should have error icon', () => {
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('w-6', 'h-6', 'text-red-600');
    });

    it('should have correct title and description', () => {
      expect(screen.getByText('Oops! Algo deu errado')).toBeInTheDocument();
      expect(screen.getByText(/Nossa equipe foi notificada/)).toBeInTheDocument();
    });

    it('should have reload button with correct styles', () => {
      const button = screen.getByRole('button', { name: /recarregar página/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('mt-4', 'inline-flex', 'items-center');
    });
  });

  describe('Reload button functionality', () => {
    it('should have reload function on button', () => {
      const ThrowingComponent = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      );

      const button = screen.getByRole('button', { name: /recarregar página/i });
      
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Recarregar página');
      
      expect(button).not.toBeDisabled();
      
      expect(button).toHaveClass('mt-4', 'inline-flex', 'items-center');
      
      fireEvent.click(button);
    });

    it('should have button that calls window.location.reload', () => {
      const ThrowingComponent = () => {
        throw new Error('Test error');
      };

      const { container } = render(
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Recarregar página');
      
      expect(button).toHaveAttribute('class');
      expect(button?.getAttribute('class')).toContain('mt-4');
    });
  });

  describe('Component states', () => {
    it('should have correct initial state', () => {
      const errorBoundary = new ErrorBoundary({ children: null });
      expect(errorBoundary.state).toEqual({ hasError: false });
    });

    it('should update state when getDerivedStateFromError is called', () => {
      const error = new Error('Teste');
      const newState = ErrorBoundary.getDerivedStateFromError(error);
      
      expect(newState).toEqual({
        hasError: true,
        error: error,
      });
    });
  });

  describe('Different error types', () => {
    it('should capture rendering error', () => {
      const ErrorComponent = () => {
        throw new Error('Erro de renderização');
      };

      render(
        <ErrorBoundary>
          <ErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Oops! Algo deu errado')).toBeInTheDocument();
      expect(logger.error).toHaveBeenCalledWith(
        'ErrorBoundary capturou um erro',
        expect.objectContaining({
          error: 'Erro de renderização',
        })
      );
    });

    it('should capture error in useEffect', () => {
      const SafeComponent = () => <div>Component</div>;

      render(
        <ErrorBoundary>
          <SafeComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Component')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
    });

    it('should have adequate semantic structure', () => {
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Oops! Algo deu errado');
    });

    it('should have accessible button', () => {
      const button = screen.getByRole('button', { name: /recarregar página/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Logger integration', () => {
    it('should log with complete error information', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(logger.error).toHaveBeenCalledTimes(1);
      expect(logger.error).toHaveBeenCalledWith(
        'ErrorBoundary capturou um erro',
        expect.objectContaining({
          error: expect.any(String),
          stack: expect.any(String),
          componentStack: expect.any(String),
        })
      );
    });
  });
});