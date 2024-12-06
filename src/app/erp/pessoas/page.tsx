"use client"

import { columns } from "@/components/data-tables/pessoas/columns"
import { PessoasDataTable } from "@/components/data-tables/pessoas/data-table"
import { usePessoas } from "@/contexts/pessoas-context"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { AddPessoaDialog } from "@/components/erp/pessoas/add-pessoa-dialog"
import { PessoasProvider } from "@/contexts/pessoas-context"
import { useHeader } from "@/contexts/header-context"
import { PessoaEdit } from '@/components/erp/pessoas/pessoa-edit'

export default function PessoasPage() {
  return (
    <PessoasProvider>
      <PessoasPageContent />
    </PessoasProvider>
  )
}

function PessoasPageContent() {
  const { pessoas, loading, loadPessoas, updatePessoa } = usePessoas()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingPessoaId, setEditingPessoaId] = useState<number | null>(null)
  const [isPessoaEditSheetOpen, setIsPessoaEditSheetOpen] = useState(false)
  const { setTitle, setSubtitle } = useHeader()

  // Define o título ao montar o componente
  useEffect(() => {
    setTitle("Pessoas")
    setSubtitle(null)
  }, [setTitle, setSubtitle])

  // Limpa o localStorage na montagem do componente
  useEffect(() => {
    try {
      localStorage.removeItem('table_state_pessoas')
      console.log('Estado da tabela resetado')
    } catch (e) {
      console.error('Erro ao limpar estado da tabela:', e)
    }
  }, [])

  // Carrega os dados quando o componente montar
  useEffect(() => {
    console.log('PessoasPageContent montado')
    loadPessoas()
  }, [loadPessoas])

  // Debug
  useEffect(() => {
    console.log('Estado atual:', { 
      loading, 
      pessoasCount: pessoas.length,
      firstPessoa: pessoas[0]
    })
  }, [loading, pessoas])

  useEffect(() => {
    // Listener para o evento de edição
    const handleEditPessoa = (event: CustomEvent<{ pessoaId: number }>) => {
      setEditingPessoaId(event.detail.pessoaId)
      setIsPessoaEditSheetOpen(true)
    }

    window.addEventListener('editPessoa', handleEditPessoa as EventListener)

    return () => {
      window.removeEventListener('editPessoa', handleEditPessoa as EventListener)
    }
  }, [])

  const handlePessoaAdded = async (id: number) => {
    setIsAddDialogOpen(false)
    await loadPessoas()
  }

  const handlePessoaSaved = async (id: number) => {
    await updatePessoa(id)
  }

  const handleNewPessoaClick = () => {
    console.log("Abrindo diálogo de adicionar pessoa");
    setIsAddDialogOpen(true);
  };

  return (
    <div className="h-full w-full">
      <PessoasDataTable 
        columns={columns} 
        data={pessoas || []} 
        loading={loading}
        pageSize={10}
        onAddClick={() => setIsAddDialogOpen(true)}
      />

      <AddPessoaDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={handlePessoaAdded}
      />

      {editingPessoaId !== null && (
        <PessoaEdit 
          pessoaId={editingPessoaId} 
          isOpen={isPessoaEditSheetOpen} 
          onClose={() => setEditingPessoaId(null)}
          onSave={() => handlePessoaSaved(editingPessoaId)}
        />
      )}
    </div>
  )
}
