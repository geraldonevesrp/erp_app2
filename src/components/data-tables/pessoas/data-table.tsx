"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTableViewOptions } from "../base/data-table-view-options"
import { DataTablePagination } from "../base/data-table-pagination"

interface PessoasDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageSize?: number
  pageSizeOptions?: number[]
  showAllOption?: boolean
  enableRowSelection?: boolean
  enableSearch?: boolean
  enableColumnVisibility?: boolean
  gridHeight?: string
  initialSorting?: SortingState
}

export function PessoasDataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100, 200, 300, 500],
  showAllOption = true,
  enableRowSelection = true,
  enableSearch = true,
  enableColumnVisibility = true,
  gridHeight = "calc(100vh - 300px)",
  initialSorting = [],
}: PessoasDataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting)
  const [globalFilter, setGlobalFilter] = React.useState("")

  // Função de filtro específica para a tabela de pessoas
  const pessoasGlobalFilter = React.useCallback((row: any, columnId: string, filterValue: string) => {
    const searchValue = String(filterValue).toLowerCase()
    
    // Lista de campos para buscar
    const searchFields = [
      'apelido',
      'nome_razao',
      'cpf_cnpj',
      'rg_ie',
      'telefones',
      'emails',
      'tipo',
      'status_id'
    ]

    // Busca em todos os campos definidos
    return searchFields.some(field => {
      const value = row.getValue(field)
      if (value === null || value === undefined) return false
      return String(value).toLowerCase().includes(searchValue)
    })
  }, [])

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
    filterFns: {
      pessoasGlobal: pessoasGlobalFilter,
    },
    globalFilterFn: "pessoasGlobal",
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  React.useEffect(() => {
    table.setPageSize(pageSize)
  }, [pageSize, table])

  return (
    <div className="space-y-4">
      <style jsx global>{`
        .sticky-column {
          position: sticky !important;
          left: 0;
          z-index: 20;
          background-color: hsl(var(--background)) !important;
          box-shadow: 4px 0 8px rgba(0,0,0,0.1);
        }
        
        .sticky-column::after {
          content: '';
          position: absolute;
          right: -4px;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(to right, rgba(0,0,0,0.1), transparent);
        }
      `}</style>
      <div className="flex items-center justify-between">
        {enableSearch && (
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar em todos os campos..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-8"
            />
          </div>
        )}
        {enableColumnVisibility && (
          <DataTableViewOptions table={table} />
        )}
      </div>
      <div className="rounded-md border" style={{ height: gridHeight, overflow: 'auto' }}>
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead 
                      key={header.id}
                      className={header.column.columnDef.enablePinning ? 'sticky-column' : ''}
                      style={{
                        width: header.getSize()
                      }}
                    >
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id}
                      className={cell.column.columnDef.enablePinning ? 'sticky-column' : ''}
                      style={{
                        width: cell.column.getSize()
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
      <DataTablePagination 
        table={table} 
        pageSizeOptions={pageSizeOptions}
        showAllOption={showAllOption}
      />
    </div>
  )
}
