"use client";
import { Provider } from 'react-redux';
import { store } from '@/state/store';

type Props = Readonly<{ children: React.ReactNode }>;

export default function ReduxProvider({ children }: Props) {
  return <Provider store={store}>{children}</Provider>;
}