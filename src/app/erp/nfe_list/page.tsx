"use client"

import { columns } from "@/components/data-tables/nfe/columns"
import { NFeDataTable } from "@/components/data-tables/nfe/data-table"
import { useNfe } from "@/contexts/nfe-context"
import { useEffect, useCallback } from "react"
import { useHeader } from "@/contexts/header-context"
import { NfeProvider } from "@/contexts/nfe-context"

export default function NfeListPage() {
  return (
    <NfeProvider>
      <NfeListPageContent />
    </NfeProvider>
  )
}

function NfeListPageContent() {
  const { nfes, loading, loadNfes, updateNfe } = useNfe()
  const { setTitle, setSubtitle } = useHeader()

  // Define o título ao montar o componente
  useEffect(() => {
    setTitle("Notas Fiscais")
    setSubtitle("Listagem de Notas Fiscais Eletrônicas")
  }, [setTitle, setSubtitle])

  // Limpa o localStorage na montagem do componente
  useEffect(() => {
    try {
      localStorage.removeItem('table_state_nfe')
      console.log('Estado da tabela resetado')
    } catch (e) {
      console.error('Erro ao limpar estado da tabela:', e)
    }
  }, [])

  // Função de carregamento
  const handleLoadNfes = useCallback(async () => {
    try {
      await loadNfes()
    } catch (error) {
      console.error('Erro ao carregar NFes:', error)
    }
  }, [loadNfes])

  // Carrega os dados quando o componente montar
  useEffect(() => {
    console.log('NfeListPageContent montado')
    handleLoadNfes()
  }, [handleLoadNfes])

  const handleNewNfeClick = () => {
    console.log("Redirecionando para página de emissão");
    window.location.href = '/erp/nfe_edit';
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <NFeDataTable 
        columns={columns} 
        data={nfes || []} 
        loading={loading}
        pageSize={10}
        onAddClick={handleNewNfeClick}
      />
    </div>
  )
}
