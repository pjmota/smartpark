type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: Date;
}

class Logger {
  private readonly isDevelopment = process.env.NODE_ENV === 'development';

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

  private sendToLoggingService(_logEntry: LogEntry) {
    // Implementar integração com serviço de logging (ex: Sentry, LogRocket, etc.)
    // Por enquanto, apenas um placeholder
  }
}

export const logger = new Logger();