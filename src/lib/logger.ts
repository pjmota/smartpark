type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: Date;
}

class Logger {
  private get isDevelopment() {
    return process.env.NODE_ENV === 'development';
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const logEntry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date()
    };

    // Em desenvolvimento, mostra no console
    if (this.isDevelopment) {
      let consoleMethod: typeof console.log;
      
      if (level === 'error') {
        consoleMethod = console.error;
      } else if (level === 'warn') {
        consoleMethod = console.warn;
      } else {
        consoleMethod = console.log;
      }
      
      if (context) {
        consoleMethod(`[${level.toUpperCase()}] ${message}`, context);
      } else {
        consoleMethod(`[${level.toUpperCase()}] ${message}`);
      }
    }

    // Em produção, pode enviar para serviço de logging
    if (!this.isDevelopment) {
      this.sendToLoggingService(logEntry);
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, unknown>) {
    this.log('error', message, context);
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log('debug', message, context);
  }

  private sendToLoggingService(logEntry: LogEntry) {
    // Implementação básica de logging para produção
    // Em um ambiente real, aqui seria integrado com serviços como Sentry, LogRocket, etc.
    try {
      // Simula envio para serviço externo ou armazenamento local
      const logData = {
        timestamp: logEntry.timestamp.toISOString(),
        level: logEntry.level,
        message: logEntry.message,
        context: logEntry.context,
        environment: process.env.NODE_ENV,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
      };

      // Em um cenário real, aqui seria feita a requisição para o serviço de logging
      // Por exemplo: await fetch('/api/logs', { method: 'POST', body: JSON.stringify(logData) })
      
      // Por enquanto, apenas armazena no localStorage (se disponível) ou ignora
      if (typeof window !== 'undefined' && window.localStorage) {
        let logs = [];
        try {
          const existingLogs = localStorage.getItem('app_logs');
          logs = existingLogs ? JSON.parse(existingLogs) : [];
        } catch (parseError) {
          // Se houver erro no parse, começar com array vazio
          console.warn('Erro ao fazer parse dos logs existentes, criando novo array:', parseError);
          logs = [];
        }
        
        logs.push(logData);
        
        // Mantém apenas os últimos 100 logs para evitar sobrecarga
        if (logs.length > 100) {
          logs.splice(0, logs.length - 100);
        }
        
        localStorage.setItem('app_logs', JSON.stringify(logs));
      }
    } catch (error) {
      // Falha silenciosa para não quebrar a aplicação
      console.warn('Falha ao enviar log para serviço:', error);
    }
  }
}

export const logger = new Logger();