"use client";

import { NfeEdit } from '@/components/erp/nfe/nfe-edit';
import { NfeProvider } from '@/contexts/nfe-context';
import { useHeader } from '@/contexts/header-context';
import { useEffect } from 'react';

export default function NfeEditPage() {
  return (
    <NfeProvider>
      <NfeEditPageContent />
    </NfeProvider>
  );
}

function NfeEditPageContent() {
  const { setTitle, setSubtitle } = useHeader();

  useEffect(() => {
    setTitle("Emissão de NFe");
    setSubtitle("Emissão de Nota Fiscal Eletrônica Avulsa");
  }, [setTitle, setSubtitle]);

  return (
    <div className="container mx-auto py-6">
      <NfeEdit />
    </div>
  );
}
