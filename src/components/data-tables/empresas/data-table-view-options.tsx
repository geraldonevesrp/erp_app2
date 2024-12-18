"use client"

import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { RotateCcw, Settings2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { defaultVisibleColumns } from "./default-columns"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const resetVisibility = () => {
    // Cria um novo estado com todas as colunas ocultas primeiro
    const newState: { [key: string]: boolean } = {}
    table.getAllColumns().forEach(column => {
      if (column.getCanHide()) {
        newState[column.id] = false
      }
    })

    // Mostra apenas as colunas padrão
    defaultVisibleColumns.forEach(columnId => {
      newState[columnId] = true
    })

    // Força a coluna actions a sempre estar visível
    newState.actions = true

    // Atualiza a visibilidade usando a função do table
    table.setColumnVisibility(newState)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full">
                  <Settings2 className="h-4 w-4" />
                  <span className="sr-only">Colunas</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Configurar colunas</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SheetTrigger>
      <SheetContent className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col h-full">
          <SheetHeader className="mb-6">
            <SheetTitle>Colunas Visíveis</SheetTitle>
            <SheetDescription>
              Selecione as colunas que deseja exibir na tabela.
            </SheetDescription>
          </SheetHeader>
          
          <ScrollArea className="flex-1 -mx-6">
            <div className="px-6">
              {table
                .getAllColumns()
                .filter(column => column.getCanHide() && column.id !== 'actions')
                .map(column => {
                  return (
                    <div key={column.id} className="py-2 flex items-center justify-between">
                      <span className="text-sm">{column.id}</span>
                      <Switch
                        checked={column.getIsVisible()}
                        onCheckedChange={value => column.toggleVisibility(value)}
                        aria-label={`Toggle ${column.id} column`}
                      />
                    </div>
                  )
                })}
            </div>
          </ScrollArea>

          <div className="mt-auto pt-4 border-t">
            <Button variant="outline" onClick={resetVisibility} className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              Restaurar Padrão
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
