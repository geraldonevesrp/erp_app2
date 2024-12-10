"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Table } from "@tanstack/react-table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/database.types"

type ProdutoRow = Database['public']['Views']['v_produtos']['Row']

interface FilterSheetProps {
  table: Table<ProdutoRow>
}

export function FilterSheet<TData>({
  table,
}: {
  table: Table<TData>
}) {
  const [open, setOpen] = useState(false)
  const [prodTipos, setProdTipos] = useState<any[]>([])
  const [prodGeneros, setProdGeneros] = useState<any[]>([])
  const [prodMarcas, setProdMarcas] = useState<any[]>([])
  const [prodCategorias, setProdCategorias] = useState<any[]>([])
  const [prodSubcategorias, setProdSubcategorias] = useState<any[]>([])
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null)
  const [isSubcategoriaDisabled, setIsSubcategoriaDisabled] = useState(true)

  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchFilterData = async () => {
      // Buscar tipos de produto
      const { data: tiposData } = await supabase
        .from('prod_tipos')
        .select('id, tipo')
        .order('tipo')
      if (tiposData) setProdTipos(tiposData)

      // Buscar gêneros
      const { data: generosData } = await supabase
        .from('prod_genero')
        .select('id, genero')
        .order('genero')
      if (generosData) setProdGeneros(generosData)

      // Buscar marcas
      const { data: marcasData } = await supabase
        .from('prod_marcas')
        .select('id, marca')
        .order('marca')
      if (marcasData) setProdMarcas(marcasData)

      // Buscar categorias
      const { data: categoriasData } = await supabase
        .from('prod_categorias')
        .select('id, categoria')
        .order('categoria')
      if (categoriasData) setProdCategorias(categoriasData)
    }

    fetchFilterData()
  }, [])

  useEffect(() => {
    const fetchSubcategorias = async () => {
      if (selectedCategoria) {
        const { data: subcategoriasData } = await supabase
          .from('prod_subcategorias')
          .select('id, subcategoria')
          .eq('prod_categorias_id', selectedCategoria)
          .order('subcategoria')
        if (subcategoriasData) setProdSubcategorias(subcategoriasData)
        setIsSubcategoriaDisabled(false)
      } else {
        setProdSubcategorias([])
        setIsSubcategoriaDisabled(true)
      }
    }

    fetchSubcategorias()
  }, [selectedCategoria])

  const handleCategoriaChange = (value: string) => {
    setSelectedCategoria(value)
    // Limpar o filtro de subcategoria quando mudar a categoria
    table.getColumn('prod_subcategoria')?.setFilterValue('')
  }

  const handleClearFilters = () => {
    table.getColumn('prod_tipo')?.setFilterValue('')
    table.getColumn('prod_genero')?.setFilterValue('')
    table.getColumn('prod_marca')?.setFilterValue('')
    table.getColumn('prod_categoria')?.setFilterValue('')
    table.getColumn('prod_subcategoria')?.setFilterValue('')
    setSelectedCategoria(null)
    setIsSubcategoriaDisabled(true)
  }

  // Conta quantos filtros estão ativos
  const activeFilters = [
    table.getColumn('prod_tipo')?.getFilterValue(),
    table.getColumn('prod_genero')?.getFilterValue(),
    table.getColumn('prod_marca')?.getFilterValue(),
    table.getColumn('prod_categoria')?.getFilterValue(),
    table.getColumn('prod_subcategoria')?.getFilterValue(),
  ].filter(Boolean).length

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full relative"
              onClick={() => setOpen(true)}
            >
              <Filter className="h-4 w-4" />
              {activeFilters > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {activeFilters}
                </Badge>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Filtros</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
            <SheetDescription>
              Filtre os produtos por suas características
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            <div className="space-y-5 py-4">
              {/* Tipo de Produto */}
              <div className="space-y-2">
                <Label>Tipo de Produto</Label>
                <Select
                  value={table.getColumn('prod_tipo')?.getFilterValue() || ''}
                  onValueChange={(value) => table.getColumn('prod_tipo')?.setFilterValue(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      {prodTipos.map((tipo) => (
                        <SelectItem key={tipo.id} value={tipo.id}>
                          {tipo.tipo}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>

              {/* Gênero */}
              <div className="space-y-2">
                <Label>Gênero</Label>
                <Select
                  value={table.getColumn('prod_genero')?.getFilterValue() || ''}
                  onValueChange={(value) => table.getColumn('prod_genero')?.setFilterValue(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      {prodGeneros.map((genero) => (
                        <SelectItem key={genero.id} value={genero.id}>
                          {genero.genero}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>

              {/* Marca */}
              <div className="space-y-2">
                <Label>Marca</Label>
                <Select
                  value={table.getColumn('prod_marca')?.getFilterValue() || ''}
                  onValueChange={(value) => table.getColumn('prod_marca')?.setFilterValue(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma marca" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      {prodMarcas.map((marca) => (
                        <SelectItem key={marca.id} value={marca.id}>
                          {marca.marca}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={table.getColumn('prod_categoria')?.getFilterValue() || ''}
                  onValueChange={(value) => handleCategoriaChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      {prodCategorias.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.id}>
                          {categoria.categoria}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>

              {/* Subcategoria */}
              <div className="space-y-2">
                <Label>Subcategoria</Label>
                <Select
                  value={table.getColumn('prod_subcategoria')?.getFilterValue() || ''}
                  onValueChange={(value) => table.getColumn('prod_subcategoria')?.setFilterValue(value)}
                  disabled={isSubcategoriaDisabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedCategoria ? "Selecione uma subcategoria" : "Selecione primeiro uma categoria"} />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      {prodSubcategorias.map((subcategoria) => (
                        <SelectItem key={subcategoria.id} value={subcategoria.id}>
                          {subcategoria.subcategoria}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </ScrollArea>

          <SheetFooter className="absolute bottom-0 left-0 right-0 bg-background p-4 border-t">
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                onClick={handleClearFilters}
              >
                Limpar Filtros
              </Button>
              <Button
                onClick={() => setOpen(false)}
              >
                Aplicar Filtros
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
