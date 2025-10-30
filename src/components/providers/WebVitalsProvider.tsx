"use client";
import { useEffect } from 'react';
import { initWebVitals, type MetricPayload } from '@/lib/webVitals';

type Props = Readonly<{ children: React.ReactNode; reporter?: (metric: MetricPayload) => void }>;

export default function WebVitalsProvider({ children, reporter }: Props) {
  useEffect(() => {
    initWebVitals(reporter);
  }, []);
  return <>{children}</>;
}