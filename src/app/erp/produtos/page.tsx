"use client"

import { useState, useEffect } from "react"
import { Plus, Filter, Search, Settings2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FilterDialog } from "@/components/erp/produtos/filter-dialog"
import { AddProdutoDialog } from "@/components/erp/produtos/add-produto-dialog"
import { ProdutoEdit } from '@/components/erp/produtos/produto-edit'
import { ProdutosProvider } from "@/contexts/produtos-context"
import { useHeader } from "@/contexts/header-context"
import { HierarchicalDataGrid } from "@/components/data-tables/produtos/hierarchical-data-grid"

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
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
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

  const handleApplyFilters = () => {
    console.log('Filters applied')
  }

  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-between gap-4 p-4">
        {/* Título */}
        <h2 className="text-xl font-semibold">Produtos</h2>
      </div>

      {/* Tabela de Produtos */}
      <div className="px-4">
        <HierarchicalDataGrid 
          onAddClick={() => setIsAddDialogOpen(true)}
        />
      </div>

      <AddProdutoDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleProdutoAdded}
      />

      <FilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        onApplyFilters={handleApplyFilters}
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
  )
}
