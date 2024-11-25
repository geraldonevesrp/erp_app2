"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { columns, type Pessoa } from "@/components/data-tables/pessoas/columns"
import { PessoasDataTable } from "@/components/data-tables/pessoas/data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddPessoaDialog } from "@/components/erp/pessoas/add-pessoa-dialog"
import { PessoaEdit } from "@/components/erp/pessoas/pessoa-edit"

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
    <div className="h-full flex-1 flex-col space-y-6 overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cadastro de Pessoas</h2>
          <p className="text-muted-foreground">
            Gerencie seus clientes, fornecedores e colaboradores
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
      </div>

      <div className="h-[calc(100%-5rem)] overflow-hidden">
        {loading ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <PessoasDataTable
            data={pessoas}
            columns={columns}
            pageSize={50}
            pageSizeOptions={[10, 20, 50, 100, 200, 300, 500]}
            showAllOption={true}
            gridHeight="calc(100vh - 290px)"
            initialSorting={[{ id: "apelido", desc: false }]}
          />
        )}
      </div>

      <AddPessoaDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={handlePessoaAdded}
      />

      <PessoaEdit
        pessoaId={editingPessoaId}
        isOpen={editingPessoaId !== null}
        onClose={() => setEditingPessoaId(null)}
      />
    </div>
  )
}
