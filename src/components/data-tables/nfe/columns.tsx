import { ColumnDef } from "@tanstack/react-table"
import { StatusCell, DateCell } from "../base/columns"
import { DataTableColumnHeader } from "../base/data-table-header"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"

export interface NFe {
  [key: string]: any
}

// Colunas que serão mostradas por padrão
export const defaultVisibleColumns = [
  "actions",
  "chave",
  "data_emissao",
  "api_status",
  "created_at"
]

// Função auxiliar para filtrar valores
const basicFilter = (value: any, filterValue: string) => {
  if (!filterValue || filterValue === "all") return true
  return String(value).toLowerCase() === String(filterValue).toLowerCase()
}

export const columns: ColumnDef<NFe>[] = [
  {
    id: "actions",
    enableHiding: false,
    enableSorting: false,
    enableResizing: false,
    size: 80,
    meta: {
      fixed: true
    },
    header: () => <div className="text-center font-medium">Ações</div>,
    cell: ({ row }) => {
      const handleEdit = () => {
        const event = new CustomEvent('editNFe', {
          detail: { nfeId: row.original.id }
        })
        window.dispatchEvent(event)
      }

      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  },
  {
    accessorKey: "chave",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Chave NFe" />
    ),
    size: 250,
    enableSorting: true,
  },
  {
    accessorKey: "data_emissao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data Emissão" />
    ),
    cell: ({ row }) => <DateCell value={row.getValue("data_emissao")} />,
    size: 130,
    enableSorting: true,
  },
  {
    accessorKey: "api_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <StatusCell value={row.getValue("api_status")} />,
    filterFn: (row, id, value) => basicFilter(row.getValue(id), value),
    size: 100,
    enableSorting: true,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado em" />
    ),
    cell: ({ row }) => <DateCell value={row.getValue("created_at")} />,
    size: 130,
    enableSorting: true,
  },
]
