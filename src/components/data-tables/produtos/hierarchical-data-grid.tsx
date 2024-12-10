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
  ExpandedState,
  getExpandedRowModel,
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
import { Search, X, Plus, ChevronRight, ChevronDown } from "lucide-react"
import { FilterSheet } from "./filter-sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from "@/types/database.types"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const supabase = createClientComponentClient<Database>()

type ProdutoRow = Database['public']['Views']['v_produtos']['Row']

interface HierarchicalDataGridProps {
  onAddClick: () => void
}

export function HierarchicalDataGrid({ onAddClick }: HierarchicalDataGridProps) {
  const [data, setData] = React.useState<ProdutoRow[]>([])
  const [loading, setLoading] = React.useState(true)
  const [expanded, setExpanded] = React.useState<ExpandedState>({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")

  // Filtra os produtos principais (não são itens de grade)
  const mainProducts = React.useMemo(() => {
    return data.filter(produto => produto.prod_tipos_id !== 3)
  }, [data])

  const fetchProdutos = async () => {
    setLoading(true)
    try {
      const { data: produtos, error } = await supabase
        .from('v_produtos')
        .select('*')
        .order('cod_sequencial', { ascending: true })

      if (error) throw error
      setData(produtos || [])
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchProdutos()
  }, [])

  const columns: ColumnDef<ProdutoRow>[] = [
    {
      id: "expander",
      header: () => null,
      cell: ({ row }) => {
        // Verifica se o produto tem itens de grade
        const hasSubItems = data.some(item => 
          item.prod_tipos_id === 3 && 
          item.grade_de === row.original.id
        )

        if (row.original.prod_tipos_id === 2 && hasSubItems) {
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    onClick={() => row.toggleExpanded()}
                    className="p-0 h-6 w-6"
                  >
                    {row.getIsExpanded() ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{row.getIsExpanded() ? "Fechar" : "Abrir"} itens da grade</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        }
        return null
      },
    },
    {
      accessorKey: "cod_sequencial",
      header: "Código",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.cod_sequencial}
          {row.original.sub_codigo_sequencial > 1 && (
            <Badge variant="secondary" className="text-xs">
              {row.original.sub_codigo_sequencial}
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "nome",
      header: "Nome",
      cell: ({ row }) => {
        const isSubItem = row.original.prod_tipos_id === 3
        return (
          <div className={`flex items-center gap-2 ${isSubItem ? 'pl-4' : ''}`}>
            <span>{row.original.nome}</span>
            {row.original.prod_tipos_id === 2 && (
              <Badge variant="outline" className="text-xs">Grade</Badge>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: "prod_marca",
      header: "Marca",
      cell: ({ row }) => row.original.prod_marca || '-'
    },
    {
      accessorKey: "prod_categoria",
      header: "Categoria",
      cell: ({ row }) => row.original.prod_categoria || '-'
    },
    {
      accessorKey: "prod_subcategoria",
      header: "Subcategoria",
      cell: ({ row }) => row.original.prod_subcategoria || '-'
    },
    {
      accessorKey: "unid_venda_nome",
      header: "Unid. Venda",
      cell: ({ row }) => row.original.unid_venda_nome || '-'
    },
    {
      accessorKey: "ativo",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.ativo ? "success" : "secondary"}>
          {row.original.ativo ? "Ativo" : "Inativo"}
        </Badge>
      )
    }
  ]

  const table = useReactTable({
    data: mainProducts,
    columns,
    state: {
      expanded,
      columnVisibility,
      globalFilter,
    },
    onExpandedChange: setExpanded,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: row => row.original.prod_tipos_id === 2,
    getSubRows: row => {
      if (row.prod_tipos_id === 2) {
        return data.filter(item => 
          item.prod_tipos_id === 3 && 
          item.grade_de === row.id
        )
      }
      return []
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar produtos..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-8"
            />
            {globalFilter && (
              <Button
                variant="ghost"
                onClick={() => setGlobalFilter("")}
                className="absolute right-0 top-0 h-full px-2 py-0 hover:bg-transparent"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <FilterSheet table={table} />
        </div>
        <div className="flex items-center space-x-2">
          <DataTableViewOptions table={table} />
          <DataTableExport table={table} />
          <Button onClick={onAddClick} className="whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" /> Novo Produto
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isSubItem = row.original.prod_tipos_id === 3
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`
                      ${isSubItem ? 'bg-muted/50 hover:bg-muted/80' : 'hover:bg-muted/50'}
                      transition-colors
                    `}
                    onClick={(e) => {
                      if (!e.defaultPrevented) {
                        const event = new CustomEvent('editProduto', {
                          detail: { produtoId: row.original.id }
                        })
                        window.dispatchEvent(event)
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {loading ? "Carregando..." : "Nenhum produto encontrado."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}
