"use client"

import { Separator } from "@/components/ui/separator"
import { CategoriaDataTable } from "@/components/data-tables/produtos/categoria-data-table"
import { useEffect } from 'react'
import { useHeader } from '@/contexts/header-context'

export default function CategoriaPage() {
  const { setTitle, setSubtitle } = useHeader()

  useEffect(() => {
    setTitle('Estoque - Produtos Categorias')
    setSubtitle('Gerencie as categorias e subcategorias dos produtos.')
  }, [setTitle, setSubtitle])

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Categorias</h3>
        <p className="text-sm text-muted-foreground">
          Gerencie as categorias e subcategorias dos produtos.
        </p>
      </div>
      <Separator />
      <CategoriaDataTable />
    </div>
  )
}
