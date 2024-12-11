"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
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

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTablePagination } from "../base/data-table-pagination"
import { DataTableViewOptions } from "../base/data-table-view-options"
import { Plus } from "lucide-react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from "@/types/database.types"
import { AddEditCategoriaDialog } from "./add-edit-categoria-dialog"
import { toast } from "sonner"

const supabase = createClientComponentClient<Database>()

type Categoria = Database['public']['Tables']['prod_categorias']['Row']
type Subcategoria = Database['public']['Tables']['prod_subcategorias']['Row']

interface CategoriaWithSubcategorias extends Categoria {
  subcategorias: Subcategoria[]
}

export function CategoriaDataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = React.useState<CategoriaWithSubcategorias[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [selectedCategoria, setSelectedCategoria] = React.useState<CategoriaWithSubcategorias | null>(null)

  const columns: ColumnDef<CategoriaWithSubcategorias>[] = [
    {
      accessorKey: "categoria",
      header: "Categoria",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("categoria")}</div>
      ),
    },
    {
      accessorKey: "subcategorias",
      header: "Subcategorias",
      cell: ({ row }) => {
        const subcategorias = row.original.subcategorias || []
        return (
          <div className="flex flex-wrap gap-1">
            {subcategorias.map((sub) => (
              <div key={sub.id} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                {sub.subcategoria}
              </div>
            ))}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => {
                setSelectedCategoria(row.original)
                setIsAddDialogOpen(true)
              }}
            >
              Editar
            </Button>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => handleDeleteCategoria(row.original.id)}
            >
              Excluir
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const fetchCategorias = async () => {
    try {
      setLoading(true)
      const { data: categorias, error: categoriasError } = await supabase
        .from('prod_categorias')
        .select('*')
        .order('categoria', { ascending: true })

      if (categoriasError) throw categoriasError

      const { data: subcategorias, error: subcategoriasError } = await supabase
        .from('prod_subcategorias')
        .select('*')
        .order('subcategoria', { ascending: true })

      if (subcategoriasError) throw subcategoriasError

      const categoriasWithSubs = categorias.map(cat => ({
        ...cat,
        subcategorias: subcategorias.filter(sub => sub.categoria_id === cat.id)
      }))

      setData(categoriasWithSubs)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
      toast.error('Erro ao carregar categorias')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategoria = async (id: number) => {
    try {
      const { error } = await supabase
        .from('prod_categorias')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Categoria excluída com sucesso')
      fetchCategorias()
    } catch (error) {
      console.error('Erro ao excluir categoria:', error)
      toast.error('Erro ao excluir categoria')
    }
  }

  React.useEffect(() => {
    fetchCategorias()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filtrar categorias..."
          value={(table.getColumn("categoria")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("categoria")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <DataTableViewOptions table={table} />
          <Button onClick={() => {
            setSelectedCategoria(null)
            setIsAddDialogOpen(true)
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Categoria
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
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Carregando...
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
      <DataTablePagination table={table} />
      <AddEditCategoriaDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        categoria={selectedCategoria}
        onSave={fetchCategorias}
      />
    </div>
  )
}
