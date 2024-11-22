"use client"

import { Settings2 } from "lucide-react"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { defaultVisibleColumns } from "../pessoas/columns"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <Settings2 className="mr-2 h-4 w-4" />
          Colunas
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Colunas Visíveis</SheetTitle>
          <SheetDescription>
            Selecione as colunas que deseja exibir na tabela.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-200px)] mt-4">
          <div className="space-y-4">
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" && column.getCanHide()
              )
              .map((column) => {
                return (
                  <div
                    key={column.id}
                    className="flex items-center space-x-2"
                  >
                    <Switch
                      id={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    />
                    <Label htmlFor={column.id}>
                      {column.columnDef.header?.toString()}
                    </Label>
                  </div>
                )
              })}
          </div>
        </ScrollArea>
        <Separator className="my-4" />
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => {
              // Primeiro esconde todas as colunas
              table.getAllColumns().forEach((column) => {
                column.toggleVisibility(false)
              })
              // Depois mostra apenas as colunas padrão
              defaultVisibleColumns.forEach((columnId) => {
                const column = table.getColumn(columnId)
                if (column) {
                  column.toggleVisibility(true)
                }
              })
            }}
          >
            Restaurar Padrão
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
