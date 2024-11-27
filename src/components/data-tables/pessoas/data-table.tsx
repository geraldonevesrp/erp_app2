"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DataTablePagination } from "../base/data-table-pagination"
import { DataTableViewOptions } from "../base/data-table-view-options"
import { DataTableExport } from "../base/data-table-export"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Plus } from "lucide-react"
import { FilterSheet } from "./filter-sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"

interface PessoasDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  pageSize?: number
  onAddClick: () => void
}

const STORAGE_KEY = 'pessoas-table-column-visibility'

export function PessoasDataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  pageSize = 10,
  onAddClick
}: PessoasDataTableProps<TData, TValue>) {
  // Inicializa o estado com os valores salvos no localStorage
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error('Erro ao carregar visibilidade das colunas:', e)
        }
      }
    }
    return {}
  })

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState([])
  const [sorting, setSorting] = React.useState([])
  const [globalFilter, setGlobalFilter] = React.useState("")

  // Salva no localStorage quando a visibilidade muda
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(columnVisibility))
    }
  }, [columnVisibility])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: (visibility) => {
      setColumnVisibility(visibility)
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(visibility))
      }
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  })

  const router = useRouter()

  return (
    <div className="flex flex-col h-full">
      {/* Barra de Ferramentas */}
      <div className="flex items-center justify-between gap-4 p-4">
        {/* Busca */}
        <div className="flex items-center flex-1 gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={(table.getColumn("nome_razao")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("nome_razao")?.setFilterValue(event.target.value)
              }
              className="pl-8"
            />
            {(table.getColumn("nome_razao")?.getFilterValue() as string)?.length > 0 && (
              <X
                className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
                onClick={() => table.getColumn("nome_razao")?.setFilterValue("")}
              />
            )}
          </div>
          <FilterSheet table={table} />
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onAddClick}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Adicionar Pessoa</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Adicionar Pessoa</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DataTableViewOptions table={table} storageKey={STORAGE_KEY} />
          <DataTableExport data={data} />
        </div>
      </div>

      {/* Container da Tabela com scroll */}
      <div className="flex-1 min-h-0 px-4 pb-2">
        <div className="rounded-md border h-full overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="px-4 pt-1 pb-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
