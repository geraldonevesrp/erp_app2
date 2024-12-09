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
          {row.original.sub_codigo_sequencial > 1 && 
            <Badge variant="outline">{row.original.sub_codigo_sequencial}</Badge>
          }
        </div>
      ),
    },
    {
      accessorKey: "nome",
      header: "Nome",
    },
    {
      accessorKey: "prod_tipo",
      header: "Tipo",
      cell: ({ row }) => (
        <Badge variant={row.original.prod_tipos_id === 2 ? "secondary" : "default"}>
          {row.original.prod_tipo}
        </Badge>
      ),
    },
    {
      accessorKey: "prod_categoria",
      header: "Categoria",
    },
    {
      accessorKey: "prod_marca",
      header: "Marca",
    },
    {
      accessorKey: "unid_venda_nome",
      header: "Unid. Venda",
    },
    {
      accessorKey: "ativo",
      header: "Ativo",
      cell: ({ row }) => (
        <Badge variant={row.original.ativo ? "success" : "destructive"}>
          {row.original.ativo ? "Sim" : "Não"}
        </Badge>
      ),
    },
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
    getSubRows: (row) => {
      if (row.prod_tipos_id === 2) {
        const subItems = data.filter(item => 
          item.prod_tipos_id === 3 && 
          item.grade_de === row.id
        )
        return subItems.length > 0 ? subItems : undefined
      }
      return undefined
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const { data: produtos, error } = await supabase
          .from('v_produtos')
          .select('*')
          .order('cod_sequencial', { ascending: true })
          .order('sub_codigo_sequencial', { ascending: true })

        if (error) throw error
        
        // Debug dos dados carregados
        console.log('Produtos carregados:', produtos)
        if (produtos) {
          const grades = produtos.filter(p => p.prod_tipos_id === 2)
          console.log('Produtos tipo Grade:', grades)
          const itensGrade = produtos.filter(p => p.prod_tipos_id === 3)
          console.log('Itens de Grade:', itensGrade)
        }

        setData(produtos || [])
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
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
                className="absolute right-0 top-0 h-full px-2"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <FilterSheet table={table} />
          <DataTableViewOptions table={table} />
          <DataTableExport table={table} />
        </div>
        <Button onClick={onAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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
                    <TableCell key={cell.id}>
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
