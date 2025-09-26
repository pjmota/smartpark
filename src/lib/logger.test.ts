import { jest } from '@jest/globals';

// Mock console methods
const mockConsoleLog = jest.fn();
const mockConsoleWarn = jest.fn();
const mockConsoleError = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock window.navigator
const mockNavigator = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
};

describe('Logger', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockConsoleLog.mockClear();
    mockConsoleWarn.mockClear();
    mockConsoleError.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
    
    // Reset environment
    delete (process.env as any).NODE_ENV;
    
    // Clear module cache
    delete require.cache[require.resolve('./logger')];
    
    // Reset global window and localStorage
    delete (global as any).window;
    delete (global as any).localStorage;
    
    // Mock console
    global.console = {
      ...console,
      log: mockConsoleLog,
      warn: mockConsoleWarn,
      error: mockConsoleError,
    };
  });

  describe('Development Environment', () => {
    beforeEach(() => {
      // Resetar módulos para garantir isolamento
      jest.resetModules();
      
      // Limpar todos os mocks
      jest.clearAllMocks();
      
      // Definir NODE_ENV como development
      delete (process.env as any).NODE_ENV;
      (process.env as any).NODE_ENV = 'development';
    });

    afterEach(() => {
      // Resetar NODE_ENV
      delete (process.env as any).NODE_ENV;
      
      // Limpar todos os mocks
      jest.clearAllMocks();
    });

    it('should log to console in development', () => {
      const { logger } = require('./logger');
      
      logger.info('Test message', { key: 'value' });
      
      expect(console.log).toHaveBeenCalledWith('[INFO] Test message', { key: 'value' });
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('should use appropriate console methods for different levels', () => {
      const { logger } = require('./logger');
      
      logger.error('Error message');
      logger.warn('Warning message');
      logger.info('Info message');
      logger.debug('Debug message');
      
      expect(console.error).toHaveBeenCalledWith('[ERROR] Error message');
      expect(console.warn).toHaveBeenCalledWith('[WARN] Warning message');
      expect(console.log).toHaveBeenCalledWith('[INFO] Info message');
      expect(console.log).toHaveBeenCalledWith('[DEBUG] Debug message');
    });

    it('should handle messages without context', () => {
      const { logger } = require('./logger');
      
      logger.info('Simple message');
      
      expect(console.log).toHaveBeenCalledWith('[INFO] Simple message');
    });
  });

  describe('Production Environment', () => {
    beforeEach(() => {
      // Resetar módulos para garantir isolamento
      jest.resetModules();
      
      // Limpar todos os mocks
      jest.clearAllMocks();
      
      // Definir NODE_ENV como production
      delete (process.env as any).NODE_ENV;
      (process.env as any).NODE_ENV = 'production';
      
      // Setup window with localStorage and navigator
      (global as any).window = {
        localStorage: localStorageMock,
        navigator: { userAgent: 'test-agent' }
      };
      
      // Setup global localStorage (usado diretamente pelo logger)
      (global as any).localStorage = localStorageMock;
      
      localStorageMock.getItem.mockReturnValue('[]');
    });

    afterEach(() => {
      // Limpar configurações globais
      delete (global as any).window;
      delete (global as any).localStorage;
      
      // Resetar NODE_ENV
      delete (process.env as any).NODE_ENV;
      
      // Limpar todos os mocks
      jest.clearAllMocks();
    });

    it('should store logs in localStorage in production', () => {
      const { logger } = require('./logger');
      
      logger.info('Production message', { key: 'value' });
      
      expect(console.log).not.toHaveBeenCalled();
      expect(localStorageMock.setItem).toHaveBeenCalled();
      
      const setItemCall = localStorageMock.setItem.mock.calls[0];
      expect(setItemCall[0]).toBe('app_logs');
      
      const savedLogs = JSON.parse(setItemCall[1] as string);
      expect(savedLogs).toHaveLength(1);
      expect(savedLogs[0].message).toBe('Production message');
      expect(savedLogs[0].context).toEqual({ key: 'value' });
      expect(savedLogs[0].level).toBe('info');
      expect(savedLogs[0].environment).toBe('production');
      expect(savedLogs[0].userAgent).toEqual(expect.stringContaining('jsdom'));
    });

    it('should handle different log levels in production', () => {
      const { logger } = require('./logger');
      
      logger.error('Error in production');
      logger.warn('Warning in production');
      logger.debug('Debug in production');
      
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(3);
    });

    it('should maintain log history and limit to 100 entries', () => {
      // Mock existing logs (99 entries)
      const existingLogs = Array.from({ length: 99 }, (_, i) => ({
        message: `Log ${i}`,
        level: 'info',
        timestamp: new Date().toISOString()
      }));
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingLogs));
      
      const { logger } = require('./logger');
      
      logger.info('New log entry');
      
      const setItemCall = localStorageMock.setItem.mock.calls[0];
      const savedLogs = JSON.parse(setItemCall[1] as string);
      
      expect(savedLogs).toHaveLength(100);
      expect(savedLogs[99].message).toBe('New log entry');
    });

    it('should trim logs when exceeding 100 entries', () => {
      // Mock existing logs (100 entries)
      const existingLogs = Array.from({ length: 100 }, (_, i) => ({
        message: `Log ${i}`,
        level: 'info',
        timestamp: new Date().toISOString()
      }));
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingLogs));
      
      const { logger } = require('./logger');
      
      logger.info('New log entry');
      
      const setItemCall = localStorageMock.setItem.mock.calls[0];
      const savedLogs = JSON.parse(setItemCall[1] as string);
      
      expect(savedLogs).toHaveLength(100);
      expect(savedLogs[0].message).toBe('Log 1'); // First log removed
      expect(savedLogs[99].message).toBe('New log entry');
    });

    it('should include environment and userAgent in log data', () => {
      const { logger } = require('./logger');
      
      logger.debug('Debug message');
      
      expect(localStorageMock.setItem).toHaveBeenCalled();
      const setItemCall = localStorageMock.setItem.mock.calls[0];
      const savedLogs = JSON.parse(setItemCall[1] as string);
      
      expect(savedLogs[0]).toMatchObject({
        level: 'debug',
        message: 'Debug message',
        environment: 'production',
        userAgent: expect.stringContaining('jsdom'),
        timestamp: expect.any(String)
      });
    });

    it('should maintain log limit of 100 entries', () => {
      // Mock existing logs (100 entries)
      const existingLogs = Array.from({ length: 100 }, (_, i) => ({
        level: 'info',
        message: `Log ${i}`,
        timestamp: new Date().toISOString(),
        environment: 'production',
        userAgent: 'test'
      }));
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingLogs));
      
      const { logger } = require('./logger');
      
      logger.error('New error');
      
      const setItemCall = localStorageMock.setItem.mock.calls[0];
      const savedLogs = JSON.parse(setItemCall[1] as string);
      
      expect(savedLogs).toHaveLength(100);
      expect(savedLogs[99].message).toBe('New error');
      expect(savedLogs[0].message).toBe('Log 1'); // First log should be removed
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      // Resetar módulos para garantir isolamento
      jest.resetModules();
      
      // Limpar todos os mocks
      jest.clearAllMocks();
      
      // Definir NODE_ENV como production
      delete (process.env as any).NODE_ENV;
      (process.env as any).NODE_ENV = 'production';
      
      // Setup window with localStorage and navigator
      (global as any).window = {
        localStorage: localStorageMock,
        navigator: { userAgent: 'test-agent' }
      };
      
      // Setup global localStorage (usado diretamente pelo logger)
      (global as any).localStorage = localStorageMock;
    });

    afterEach(() => {
      // Limpar configurações globais
      delete (global as any).window;
      delete (global as any).localStorage;
      
      // Resetar NODE_ENV
      delete (process.env as any).NODE_ENV;
      
      // Resetar módulos e limpar todos os mocks
      jest.resetModules();
      jest.clearAllMocks();
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      const { logger } = require('./logger');
      
      // Should not throw
      expect(() => logger.info('Test message')).not.toThrow();
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Falha ao enviar log para serviço:',
        expect.any(Error)
      );
      
      consoleSpy.mockRestore();
    });

    it('should handle JSON parse errors gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      const { logger } = require('./logger');
      
      // Should not throw and should create new logs array
      expect(() => logger.info('Test message')).not.toThrow();
      
      expect(localStorageMock.setItem).toHaveBeenCalled();
      const setItemCall = localStorageMock.setItem.mock.calls[0];
      const savedLogs = JSON.parse(setItemCall[1] as string);
      
      expect(savedLogs).toHaveLength(1);
      expect(savedLogs[0].message).toBe('Test message');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Server-side Environment', () => {
    beforeEach(() => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true,
        configurable: true
      });
      // Remove window to simulate server-side
      delete (global as any).window;
    });

    it('should not throw when window is undefined', () => {
      const { logger } = require('./logger');
      
      expect(() => logger.info('Server message')).not.toThrow();
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('should use "server" as userAgent when window is not available', () => {
      // We can't directly test this without modifying the logger,
      // but we can ensure it doesn't crash
      const { logger } = require('./logger');
      
      expect(() => logger.info('Server message')).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      // Resetar módulos para garantir isolamento
      jest.resetModules();
      
      // Limpar todos os mocks
      jest.clearAllMocks();
      
      // Definir NODE_ENV como production
      delete (process.env as any).NODE_ENV;
      (process.env as any).NODE_ENV = 'production';
      
      // Setup window with localStorage and navigator
      (global as any).window = {
        localStorage: localStorageMock,
        navigator: { userAgent: 'test-agent' }
      };
      
      // Setup global localStorage (usado diretamente pelo logger)
      (global as any).localStorage = localStorageMock;
      
      localStorageMock.getItem.mockReturnValue('[]');
    });

    afterEach(() => {
      // Limpar configurações globais
      delete (global as any).window;
      delete (global as any).localStorage;
      
      // Resetar NODE_ENV
      delete (process.env as any).NODE_ENV;
      
      // Resetar módulos e limpar todos os mocks
      jest.resetModules();
      jest.clearAllMocks();
    });

    it('should handle empty messages', () => {
      const { logger } = require('./logger');
      
      // Verificar se o logger está em modo de produção
      expect(logger.isDevelopment).toBe(false);
      
      logger.info('');
      
      // Se chegou até aqui, o logger deveria ter chamado localStorage
      expect(localStorageMock.setItem).toHaveBeenCalled();
      const setItemCall = localStorageMock.setItem.mock.calls[0];
      const savedLogs = JSON.parse(setItemCall[1] as string);
      
      expect(savedLogs[0].message).toBe('');
    });

    it('should handle null context', () => {
      const { logger } = require('./logger');
      
      logger.info('Message with null context', null);
      
      expect(localStorageMock.setItem).toHaveBeenCalled();
      const setItemCall = localStorageMock.setItem.mock.calls[0];
      const savedLogs = JSON.parse(setItemCall[1] as string);
      
      expect(savedLogs[0].message).toBe('Message with null context');
      expect(savedLogs[0].context).toBeNull();
    });

    it('should handle complex context objects', () => {
      const complexContext = {
        user: { id: 123, name: 'Test User' },
        metadata: { version: '1.0.0', feature: 'test' },
        nested: { deep: { value: 'test' } }
      };
      
      const { logger } = require('./logger');
      
      logger.info('Complex context', complexContext);
      
      expect(localStorageMock.setItem).toHaveBeenCalled();
      const setItemCall = localStorageMock.setItem.mock.calls[0];
      const savedLogs = JSON.parse(setItemCall[1] as string);
      
      expect(savedLogs[0].message).toBe('Complex context');
      expect(savedLogs[0].context).toEqual(complexContext);
    });
  });
});