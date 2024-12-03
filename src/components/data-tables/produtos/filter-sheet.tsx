"use client"

import { Table } from "@tanstack/react-table"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { DataTableFilters } from "../base/data-table-filters"

interface FilterSheetProps<TData> {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function FilterSheet<TData>({
  open,
  onOpenChange,
  table,
}: FilterSheetProps<TData>) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Busca avançada</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <DataTableFilters table={table} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
