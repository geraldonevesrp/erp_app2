"use client"

import { columns } from "@/components/data-tables/produtos/columns"
import { ProdutosDataTable } from "@/components/data-tables/produtos/data-table"
import { useProdutos } from "@/contexts/produtos-context"
import { useEffect, useState } from "react"
import { AddProdutoDialog } from "@/components/erp/produtos/add-produto-dialog"
import { ProdutosProvider } from "@/contexts/produtos-context"
import { useHeader } from "@/contexts/header-context"
import { ProdutoEdit } from '@/components/erp/produtos/produto-edit'

export default function ProdutosPage() {
  return (
    <ProdutosProvider>
      <ProdutosPageContent />
    </ProdutosProvider>
  )
}

function ProdutosPageContent() {
  const { produtos, loading, loadProdutos, updateProduto } = useProdutos()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProdutoId, setEditingProdutoId] = useState<number | null>(null)
  const [isProdutoEditSheetOpen, setIsProdutoEditSheetOpen] = useState(false)
  const { setTitle, setSubtitle } = useHeader()

  // Define o título ao montar o componente
  useEffect(() => {
    setTitle("Produtos")
    setSubtitle(null)
  }, [setTitle, setSubtitle])

  // Limpa o localStorage na montagem do componente
  useEffect(() => {
    try {
      localStorage.removeItem('table_state_produtos')
      console.log('Estado da tabela resetado')
    } catch (e) {
      console.error('Erro ao limpar estado da tabela:', e)
    }
  }, [])

  // Carrega os dados quando o componente montar
  useEffect(() => {
    console.log('ProdutosPageContent montado')
    loadProdutos()
  }, [loadProdutos])

  // Debug
  useEffect(() => {
    console.log('Estado atual:', { 
      loading, 
      produtosCount: produtos.length,
      firstProduto: produtos[0]
    })
  }, [loading, produtos])

  useEffect(() => {
    // Listener para o evento de edição
    const handleEditProduto = (event: CustomEvent<{ produtoId: number }>) => {
      setEditingProdutoId(event.detail.produtoId)
      setIsProdutoEditSheetOpen(true)
    }

    window.addEventListener('editProduto', handleEditProduto as EventListener)

    return () => {
      window.removeEventListener('editProduto', handleEditProduto as EventListener)
    }
  }, [])

  const handleProdutoAdded = async (id: number) => {
    setIsAddDialogOpen(false)
    await loadProdutos()
  }

  const handleProdutoSaved = async (id: number) => {
    await updateProduto(id)
    setEditingProdutoId(null)
    setIsProdutoEditSheetOpen(false)
  }

  return (
    <div className="h-full">
      <ProdutosDataTable 
        columns={columns} 
        data={produtos || []} 
        loading={loading}
        pageSize={10}
        onAddClick={() => setIsAddDialogOpen(true)}
      />

      <AddProdutoDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={handleProdutoAdded}
      />

      {editingProdutoId !== null && (
        <ProdutoEdit 
          produtoId={editingProdutoId} 
          isOpen={isProdutoEditSheetOpen} 
          onClose={() => setEditingProdutoId(null)}
          onSave={() => handleProdutoSaved(editingProdutoId)}
        />
      )}
    </div>
  )
}
