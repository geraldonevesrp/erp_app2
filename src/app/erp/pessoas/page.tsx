"use client"

import { columns } from "@/components/data-tables/pessoas/columns"
import { PessoasDataTable } from "@/components/data-tables/pessoas/data-table"
import { usePessoas } from "@/contexts/pessoas-context"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import dynamic from 'next/dynamic'
import { useEffect, useState } from "react"
import { AddPessoaDialog } from "@/components/erp/pessoas/add-pessoa-dialog"
import { PessoasProvider } from "@/contexts/pessoas-context"

// Importação dinâmica do componente PessoaEdit
const PessoaEdit = dynamic(() => import('@/components/erp/pessoas/pessoa-edit').then(mod => mod.PessoaEdit), {
  ssr: false
})

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
    }

    window.addEventListener('editPessoa', handleEditPessoa as EventListener)

    return () => {
      window.removeEventListener('editPessoa', handleEditPessoa as EventListener)
    }
  }, [])

  const handlePessoaAdded = async () => {
    setIsAddDialogOpen(false)
    await loadPessoas()
  }

  const handlePessoaSaved = async (id: number) => {
    await updatePessoa(id)
    setEditingPessoaId(null)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between py-4 px-8 border-b">
        <h2 className="text-2xl font-semibold tracking-tight">Pessoas</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Pessoa
        </Button>
      </div>

      {/* Conteúdo com altura dinâmica */}
      <div className="flex-1 p-8 min-h-0">
        <PessoasDataTable 
          columns={columns} 
          data={pessoas || []} 
          loading={loading}
          pageSize={10}
        />

        <AddPessoaDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onPessoaAdded={handlePessoaAdded}
        />

        {editingPessoaId && (
          <PessoaEdit
            pessoaId={editingPessoaId}
            isOpen={true}
            onClose={() => setEditingPessoaId(null)}
            onSave={() => handlePessoaSaved(editingPessoaId)}
          />
        )}
      </div>
    </div>
  )
}