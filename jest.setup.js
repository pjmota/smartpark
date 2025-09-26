import '@testing-library/jest-dom'

// Mock do Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))

// Configuração mais robusta para suprimir avisos do jsdom
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    // Lista de avisos do jsdom que queremos suprimir
    const jsdomWarnings = [
      'Not implemented: navigation',
      'Not implemented: HTMLFormElement.prototype.requestSubmit',
      'Not implemented: HTMLCanvasElement.prototype.getContext',
      'Error: Not implemented',
      'Erro ao recarregar dados da garagem', // Suprimir erros de teste específicos
      'validateDOMNesting', // Suprimir avisos de DOM nesting do React
      'cannot contain a nested', // Suprimir avisos de elementos aninhados inválidos
      'cannot be a descendant of', // Suprimir avisos de descendência HTML inválida
      'This will cause a hydration error' // Suprimir avisos de hidratação
    ];
    
    const message = args[0]?.toString() || '';
    const shouldSuppress = jsdomWarnings.some(warning => message.includes(warning));
    
    if (!shouldSuppress) {
      originalConsoleError.apply(console, args);
    }
  };
  
  // Suprimir console.log durante os testes para logs mais limpos
  const originalConsoleLog = console.log;
  console.log = (...args) => {
    const message = args[0]?.toString() || '';
    const debugMessages = [
      'Alterando status do plano'
    ];
    
    const shouldSuppress = debugMessages.some(debug => message.includes(debug));
    
    if (!shouldSuppress) {
      originalConsoleLog.apply(console, args);
    }
  };
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Mock de fetch para testes de API
global.fetch = jest.fn()

// Setup para limpar mocks após cada teste
afterEach(() => {
  jest.clearAllMocks()
})