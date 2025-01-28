import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Emissão de NFe - ERP',
  description: 'Emissão de Nota Fiscal Eletrônica Avulsa',
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
