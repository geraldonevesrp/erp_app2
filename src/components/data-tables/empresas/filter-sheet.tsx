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
import { Label } from "@/components/ui/label"
import { Table } from "@tanstack/react-table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Empresa } from "@/types/empresas"
import { MultiSelect } from "@/components/ui/multi-select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface FilterSheetProps {
  table: Table<Empresa>
}

export function FilterSheet({ table }: FilterSheetProps) {
  const [open, setOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})
  const supabase = createClientComponentClient()

  // Função para atualizar os filtros ativos
  const updateActiveFilters = () => {
    const filters: Record<string, any> = {}
    
    // Pegar todos os filtros ativos da tabela
    table.getState().columnFilters.forEach((filter) => {
      filters[filter.id] = filter.value
    })

    setActiveFilters(filters)
  }

  // Atualizar filtros ativos quando os filtros da tabela mudarem
  useEffect(() => {
    updateActiveFilters()
  }, [table.getState().columnFilters])

  // Limpar todos os filtros
  const clearFilters = () => {
    table.resetColumnFilters()
    setActiveFilters({})
  }

  // Contar filtros ativos
  const activeFilterCount = Object.keys(activeFilters).length

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 relative rounded-full"
              onClick={() => setOpen(true)}
            >
              <Filter className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <Badge
                  className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center"
                  variant="secondary"
                >
                  {activeFilterCount}
                </Badge>
              )}
              <span className="sr-only">Filtrar empresas</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Filtrar empresas</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Filtrar Empresas</SheetTitle>
            <SheetDescription>
              Defina os filtros para encontrar empresas específicas
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="grid gap-4 py-4 px-4">
              {/* Status */}
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={(table.getColumn("status")?.getFilterValue() as string) ?? "todos"}
                  onValueChange={(value) =>
                    table.getColumn("status")?.setFilterValue(value === "todos" ? "" : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* CNPJ */}
              <div className="grid gap-2">
                <Label>CNPJ</Label>
                <Input
                  placeholder="Digite o CNPJ"
                  value={(table.getColumn("cnpj")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("cnpj")?.setFilterValue(event.target.value)
                  }
                />
              </div>

              <Separator />

              {/* IE */}
              <div className="grid gap-2">
                <Label>Inscrição Estadual</Label>
                <Input
                  placeholder="Digite a IE"
                  value={(table.getColumn("ie")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("ie")?.setFilterValue(event.target.value)
                  }
                />
              </div>
            </div>
          </ScrollArea>

          <SheetFooter className="absolute bottom-0 left-0 right-0 bg-background p-4 border-t">
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={activeFilterCount === 0}
              >
                Limpar Filtros
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
              <Button onClick={() => setOpen(false)}>Concluído</Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
