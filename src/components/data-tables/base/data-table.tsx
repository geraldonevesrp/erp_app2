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
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTablePagination } from "./data-table-pagination"
import { defaultVisibleColumns } from "@/components/data-tables/pessoas/columns"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchPlaceholder?: string
  pageSize?: number
  pageSizeOptions?: number[]
  showAllOption?: boolean
  enableRowSelection?: boolean
  enableSearch?: boolean
  enableColumnVisibility?: boolean
  gridHeight?: string
  initialSorting?: SortingState
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Filtrar registros...",
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100, 200, 300, 500],
  showAllOption = true,
  enableRowSelection = true,
  enableSearch = true,
  enableColumnVisibility = true,
  gridHeight = "calc(100vh - 300px)",
  initialSorting = [],
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting)
  const [globalFilter, setGlobalFilter] = React.useState("")

  // Gera uma chave única baseada nas colunas da tabela
  const tableKey = React.useMemo(() => {
    return 'pessoas_table_visibility'
  }, [])

  // Carrega a visibilidade das colunas do localStorage
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(tableKey)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error('Erro ao carregar visibilidade das colunas:', e)
        }
      }
    }
    // Se não houver configuração salva, usa as colunas padrão
    const defaultVisibility: VisibilityState = {}
    columns.forEach(col => {
      const columnId = col.id || col.accessorKey as string
      defaultVisibility[columnId] = defaultVisibleColumns.includes(columnId)
    })
    return defaultVisibility
  })

  // Salva a visibilidade das colunas no localStorage quando mudar
  React.useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(columnVisibility).length > 0) {
      localStorage.setItem(tableKey, JSON.stringify(columnVisibility))
    }
  }, [columnVisibility, tableKey])

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
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      if (value === null || value === undefined) return false
      return String(value)
        .toLowerCase()
        .includes(String(filterValue).toLowerCase())
    },
  })

  React.useEffect(() => {
    table.setPageSize(pageSize)
  }, [pageSize, table])

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {enableSearch && (
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative w-[250px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={globalFilter ?? ""}
                  onChange={(event) => setGlobalFilter(event.target.value)}
                  className="h-9 pl-8 pr-8 bg-white"
                />
                {globalFilter && (
                  <Button
                    variant="ghost"
                    onClick={() => setGlobalFilter("")}
                    className="absolute right-1 top-1.5 h-6 w-6 p-0 hover:bg-transparent"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
          {enableColumnVisibility && (
            <DataTableViewOptions table={table} />
          )}
        </div>
      </div>

      <div className="rounded-md border mt-4 flex-1">
        <div className="relative" style={{ height: gridHeight }}>
          <div className="absolute inset-0 overflow-auto">
            <div className="relative">
              <Table>
                <TableHeader className="relative">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        const isFixed = header.column.columnDef.meta?.fixed;
                        return (
                          <TableHead 
                            key={header.id}
                            className="bg-gray-100/75 backdrop-blur border-b-2 border-gray-200"
                            style={{ 
                              width: header.getSize(),
                              ...(isFixed ? {
                                position: 'sticky',
                                left: 0,
                                zIndex: 40,
                                backgroundColor: 'white',
                                boxShadow: '4px 0 4px -2px rgba(0,0,0,0.1)'
                              } : {})
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
                        {row.getVisibleCells().map((cell) => {
                          const isFixed = cell.column.columnDef.meta?.fixed;
                          return (
                            <TableCell 
                              key={cell.id}
                              style={{ 
                                width: cell.column.getSize(),
                                ...(isFixed ? {
                                  position: 'sticky',
                                  left: 0,
                                  zIndex: 30,
                                  backgroundColor: 'white',
                                  boxShadow: '4px 0 4px -2px rgba(0,0,0,0.1)'
                                } : {})
                              }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          )
                        })}
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
        </div>
      </div>

      <div className="py-4">
        <DataTablePagination 
          table={table} 
          pageSizeOptions={pageSizeOptions}
          showAllOption={showAllOption}
        />
      </div>
    </div>
  )
}
