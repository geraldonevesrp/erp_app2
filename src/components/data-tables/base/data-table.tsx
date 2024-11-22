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
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTablePagination } from "./data-table-pagination"

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
  gridHeight = "calc(100vh - 300px)", // Altura padrão que considera o cabeçalho e footer da página
  initialSorting = [],
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting)
  const [globalFilter, setGlobalFilter] = React.useState("")

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
      if (!value) return false
      
      const searchValue = filterValue.toLowerCase()
      
      // Se o valor for um array (como emails ou telefones)
      if (Array.isArray(value)) {
        return value.some(item => 
          String(item).toLowerCase().includes(searchValue)
        )
      }
      
      // Para valores normais
      return String(value).toLowerCase().includes(searchValue)
    },
  })

  React.useEffect(() => {
    table.setPageSize(pageSize)
  }, [pageSize, table])

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder={searchPlaceholder || "Filtrar..."}
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          </div>
          {enableColumnVisibility && (
            <DataTableViewOptions table={table} />
          )}
        </div>

        <div className="rounded-md border">
          <div style={{ height: gridHeight }} className="relative overflow-hidden">
            <div className="absolute inset-0 overflow-auto">
              <div className="min-w-full inline-block align-middle">
                <Table>
                  <TableHeader className="sticky top-0 bg-gray-100/75 backdrop-blur supports-[backdrop-filter]:bg-gray-100/60">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead 
                              key={header.id}
                              style={{ width: header.getSize() }}
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
                              style={{ width: cell.column.getSize() }}
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
            </div>
          </div>
        </div>
      </div>
      <div className="-mt-2">
        <DataTablePagination 
          table={table} 
          pageSizeOptions={pageSizeOptions}
          showAllOption={showAllOption}
        />
      </div>
    </div>
  )
}
