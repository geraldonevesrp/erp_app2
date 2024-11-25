"use client"

import dynamic from 'next/dynamic'
import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { columns, type Pessoa } from "@/components/data-tables/pessoas/columns"
import { PessoasDataTable } from "@/components/data-tables/pessoas/data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddPessoaDialog } from "@/components/erp/pessoas/add-pessoa-dialog"

// Importação dinâmica do componente PessoaEdit
const PessoaEdit = dynamic(() => import('@/components/erp/pessoas/pessoa-edit').then(mod => mod.PessoaEdit), {
  ssr: false
})

export default function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingPessoaId, setEditingPessoaId] = useState<number | null>(null)
  const supabase = createClientComponentClient()

  const loadPessoas = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('pessoas')
        .select('*')
        .order('apelido', { ascending: true })

      if (error) {
        throw error
      }

      setPessoas(data || [])
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPessoas()
  }, [])

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

  const handlePessoaAdded = (id: number) => {
    loadPessoas() // Recarrega a lista após adicionar uma nova pessoa
  }

  return (
    <div suppressHydrationWarning>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Pessoas</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Pessoa
        </Button>
      </div>

      <PessoasDataTable columns={columns} data={pessoas} loading={loading} />

      <AddPessoaDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onPessoaAdded={handlePessoaAdded}
      />

      <PessoaEdit
        pessoaId={editingPessoaId}
        isOpen={editingPessoaId !== null}
        onClose={() => setEditingPessoaId(null)}
      />
    </div>
  )
}
