"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "../base/data-table-header"
import { DataTableRowActions } from "../base/data-table-row-actions"
import { formatCurrency } from "@/lib/utils"

export type Produto = {
  id: number
  nome: string
  cod_barras: string
  sku: string
  ativo: boolean
  visivel_catalogo: boolean
  estoque_ideal: number
  custo_ultima_comp: number
}

export const columns: ColumnDef<Produto>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nome",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("nome")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "cod_barras",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Código de Barras" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("cod_barras")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "sku",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SKU" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("sku")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "ativo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const ativo = row.getValue("ativo")

      return (
        <Badge variant={ativo ? "success" : "destructive"}>
          {ativo ? "Ativo" : "Inativo"}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "visivel_catalogo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Catálogo" />
    ),
    cell: ({ row }) => {
      const visivel = row.getValue("visivel_catalogo")

      return (
        <Badge variant={visivel ? "success" : "secondary"}>
          {visivel ? "Visível" : "Oculto"}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "estoque_ideal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estoque Ideal" />
    ),
    cell: ({ row }) => {
      const valor = parseFloat(row.getValue("estoque_ideal")) || 0
      return <div className="font-medium">{valor}</div>
    },
  },
  {
    accessorKey: "custo_ultima_comp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Último Custo" />
    ),
    cell: ({ row }) => {
      const valor = parseFloat(row.getValue("custo_ultima_comp")) || 0
      return <div className="font-medium">{formatCurrency(valor)}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
