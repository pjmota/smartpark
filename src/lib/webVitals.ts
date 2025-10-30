import { onCLS, onINP, onLCP, onTTFB } from 'web-vitals';
import { logger } from '@/lib/logger';

export type MetricPayload = {
  name: string;
  value: number;
  id: string;
};

export function initWebVitals(reporter?: (metric: MetricPayload) => void) {
  if (globalThis.window === undefined) return; // apenas cliente

  const report = ({ name, value, id }: MetricPayload) => {
    try {
      if (reporter) {
        reporter({ name, value, id });
      } else {
        logger.info('web-vitals', { name, value, id });
      }
    } catch (error) {
      // Tratar exceção: logar aviso com contexto para diagnóstico
      logger.warn('Falha ao reportar web-vitals', {
        name,
        value,
        id,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  onCLS((m) => report({ name: m.name, value: m.value, id: m.id }));
  onINP((m) => report({ name: m.name, value: m.value, id: m.id }));
  onLCP((m) => report({ name: m.name, value: m.value, id: m.id }));
  onTTFB((m) => report({ name: m.name, value: m.value, id: m.id }));
}