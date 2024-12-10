"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useProdutos } from "@/contexts/produtos-context"

interface FilterDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterDialog({ isOpen, onClose }: FilterDialogProps) {
  const [loading, setLoading] = useState(false)
  const { filters, setFilters } = useProdutos()

  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleClearFilters = () => {
    setFilters({
      tipo: null,
      genero: null,
      marca: null,
      categoria: null,
      subcategoria: null
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tipo */}
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={filters.tipo || ""}
              onValueChange={(value) => handleFilterChange("tipo", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Produto</SelectItem>
                <SelectItem value="2">Serviço</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gênero */}
          <div className="space-y-2">
            <Label>Gênero</Label>
            <Select
              value={filters.genero || ""}
              onValueChange={(value) => handleFilterChange("genero", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Feminino</SelectItem>
                <SelectItem value="U">Unissex</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Marca */}
          <div className="space-y-2">
            <Label>Marca</Label>
            <Select
              value={filters.marca || ""}
              onValueChange={(value) => handleFilterChange("marca", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma marca" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[200px]">
                  <SelectItem value="1">Nike</SelectItem>
                  <SelectItem value="2">Adidas</SelectItem>
                  <SelectItem value="3">Puma</SelectItem>
                  {/* Adicionar mais marcas conforme necessário */}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={filters.categoria || ""}
              onValueChange={(value) => handleFilterChange("categoria", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[200px]">
                  <SelectItem value="1">Calçados</SelectItem>
                  <SelectItem value="2">Roupas</SelectItem>
                  <SelectItem value="3">Acessórios</SelectItem>
                  {/* Adicionar mais categorias conforme necessário */}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          {/* Subcategoria */}
          <div className="space-y-2">
            <Label>Subcategoria</Label>
            <Select
              value={filters.subcategoria || ""}
              onValueChange={(value) => handleFilterChange("subcategoria", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma subcategoria" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[200px]">
                  <SelectItem value="1">Tênis</SelectItem>
                  <SelectItem value="2">Camisetas</SelectItem>
                  <SelectItem value="3">Bonés</SelectItem>
                  {/* Adicionar mais subcategorias conforme necessário */}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              disabled={loading}
            >
              Limpar Filtros
            </Button>
            <Button
              onClick={onClose}
              disabled={loading}
            >
              Aplicar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
