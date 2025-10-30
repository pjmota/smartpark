import type { MetricPayload } from '@/lib/webVitals';
import { logger } from '@/lib/logger';

type RetryOpts = { attempts?: number; baseMs?: number };

async function withRetry(fn: () => Promise<void>, { attempts = 5, baseMs = 200 }: RetryOpts) {
  for (let i = 0; i < attempts; i++) {
    try { await fn(); return; }
    catch (e) {
      const delay = baseMs * (2 ** i);
      await new Promise(r => setTimeout(r, delay));
      if (i === attempts - 1) throw e;
    }
  }
}

export type WebVitalsSenderOptions = {
  endpoint: string;
  batchSize?: number;
  headers?: Record<string, string>;
  retry?: RetryOpts;
};

export function createWebVitalsBatchSender(opts: WebVitalsSenderOptions) {
  const batchSize = opts.batchSize ?? 20;
  // Usa spread condicional para evitar espalhar objeto vazio
  const headers = opts.headers
    ? { 'Content-Type': 'application/json', ...opts.headers }
    : { 'Content-Type': 'application/json' };
  const retry = opts.retry ?? { attempts: 5, baseMs: 200 };

  let queue: MetricPayload[] = [];

  const flush = async () => {
    if (queue.length === 0) return;
    const payload = { metrics: queue, ts: Date.now() };
    const toSend = JSON.stringify(payload);
    const endpoint = opts.endpoint;
    const current = queue.slice();
    queue = [];

    try {
      await withRetry(async () => {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: toSend,
          keepalive: true,
        });
        if (!res.ok) throw new Error(`WebVitals send failed: ${res.status}`);
      }, retry);
    } catch (err) {
      // Se falhar, refile para próxima tentativa sem quebrar app e loga o erro
      logger.warn('Falha ao enviar web-vitals, re-enfileirando', {
        error: err instanceof Error ? err.message : String(err),
        batchSize: current.length,
        endpoint
      });
      queue = current.concat(queue);
    }
  };

  const report = (m: MetricPayload) => {
    queue.push(m);
    if (queue.length >= batchSize) {
      // dispara em background
      void flush();
    }
  };

  return { report, flush };
}