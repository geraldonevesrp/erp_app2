"use client"

import { Separator } from "@/components/ui/separator"
import { CategoriaDataTable } from "@/components/data-tables/produtos/categoria-data-table"

export default function CategoriaPage() {
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
