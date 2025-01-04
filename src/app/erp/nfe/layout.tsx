import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emissão de NFe - ERP',
  description: 'Emissão de Nota Fiscal Eletrônica Avulsa',
};

export default function NfeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
