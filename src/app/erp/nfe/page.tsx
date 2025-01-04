"use client";

import { EmissaoNfe } from '@/components/erp/nfe/emissao-nfe';
import { NfeProvider } from '@/contexts/nfe-context';
import { useHeader } from '@/contexts/header-context';
import { useEffect } from 'react';

export default function NfePage() {
  return (
    <NfeProvider>
      <NfePageContent />
    </NfeProvider>
  );
}

function NfePageContent() {
  const { setTitle, setSubtitle } = useHeader();

  useEffect(() => {
    setTitle("Emissão de NFe");
    setSubtitle("Emissão de Nota Fiscal Eletrônica Avulsa");
  }, [setTitle, setSubtitle]);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Emissão de NFe</h1>
        <p className="text-muted-foreground">
          Emissão de Nota Fiscal Eletrônica Avulsa
        </p>
      </div>
      
      <EmissaoNfe />
    </div>
  );
}
