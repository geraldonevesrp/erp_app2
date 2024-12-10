"use client"

import { useState, useEffect } from "react"
import { HierarchicalDataGrid } from "@/components/data-tables/produtos/hierarchical-data-grid"
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProdutoId, setEditingProdutoId] = useState<number | null>(null)
  const [isProdutoEditSheetOpen, setIsProdutoEditSheetOpen] = useState(false)
  const { setTitle, setSubtitle } = useHeader()

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
  }

  const handleProdutoSaved = async (id: number) => {
    setEditingProdutoId(null)
    setIsProdutoEditSheetOpen(false)
  }

  return (
    <div className="container mx-auto py-4 mt-4">
      <div className="mt-4">
        <HierarchicalDataGrid 
          onAddClick={() => setIsAddDialogOpen(true)} 
        />
        
        <AddProdutoDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSuccess={handleProdutoAdded}
        />
        
        {editingProdutoId && (
          <ProdutoEdit
            open={isProdutoEditSheetOpen}
            onOpenChange={setIsProdutoEditSheetOpen}
            produtoId={editingProdutoId}
            onSave={handleProdutoSaved}
          />
        )}
      </div>
    </div>
  )
}
