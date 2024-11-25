import { ColumnDef } from "@tanstack/react-table"
import { StatusCell, DateCell } from "../base/columns"
import { DataTableColumnHeader } from "../base/data-table-header"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"

export interface Pessoa {
  [key: string]: any
}

// Colunas que serão mostradas por padrão
export const defaultVisibleColumns = [
  "actions",
  "apelido",
  "nome_razao",
  "cpf_cnpj",
  "telefones",
  "emails",
  "tipo",
  "status_id",
  "created_at"
]

export const columns: ColumnDef<Pessoa>[] = [
  // Ações
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ações" />
    ),
    cell: ({ row }) => {
      const pessoa = row.original

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={() => {
              // O evento será capturado pelo componente pai
              const event = new CustomEvent('editPessoa', {
                detail: { pessoaId: pessoa.id }
              })
              window.dispatchEvent(event)
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      )
    },
    size: 80,
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
    enableResizing: false,
  },
  // Dados Principais
  {
    accessorKey: "apelido",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Apelido/Nome Fantasia" />
    ),
    size: 180,
    enableSorting: true,
  },
  {
    accessorKey: "nome_razao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome Completo/Razão Social" />
    ),
    size: 250,
    enableSorting: true,
  },
  {
    accessorKey: "cpf_cnpj",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CPF/CNPJ" />
    ),
    size: 140,
    enableSorting: true,
  },
  {
    accessorKey: "rg_ie",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="RG/IE" />
    ),
    size: 120,
    enableSorting: true,
  },
  {
    accessorKey: "IM",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inscrição Municipal" />
    ),
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: "telefones",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Telefones" />
    ),
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: "emails",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="E-mails" />
    ),
    size: 200,
    enableSorting: true,
  },
  {
    accessorKey: "nascimento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data Nascimento" />
    ),
    cell: ({ row }) => <DateCell value={row.getValue("nascimento")} />,
    size: 130,
    enableSorting: true,
  },
  {
    accessorKey: "genero",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gênero" />
    ),
    size: 100,
    enableSorting: true,
  },
  {
    accessorKey: "tipo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    size: 100,
    enableSorting: true,
  },
  {
    accessorKey: "tipospessoas",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipos de Pessoa" />
    ),
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: "ramo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ramo" />
    ),
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: "grupos",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grupos" />
    ),
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: "subgrupos",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subgrupos" />
    ),
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: "atividades",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Atividades" />
    ),
    size: 150,
    enableSorting: true,
  },
  // Endereço
  {
    accessorKey: "endereco_titulo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Título Endereço" />
    ),
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: "endereco_cep",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CEP" />
    ),
    size: 100,
    enableSorting: true,
  },
  {
    accessorKey: "endereco_logradouro",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Logradouro" />
    ),
    size: 250,
    enableSorting: true,
  },
  {
    accessorKey: "endereco_numero",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Número" />
    ),
    size: 100,
    enableSorting: true,
  },
  {
    accessorKey: "endereco_complemento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Complemento" />
    ),
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: "endereco_bairro",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bairro" />
    ),
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: "endereco_localidade",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cidade" />
    ),
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: "endereco_uf",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="UF" />
    ),
    size: 80,
    enableSorting: true,
  },
  // Outros
  {
    accessorKey: "status_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <StatusCell value={row.getValue("status_id")} />,
    size: 100,
    enableSorting: true,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data Cadastro" />
    ),
    cell: ({ row }) => <DateCell value={row.getValue("created_at")} />,
    size: 130,
    enableSorting: true,
  },
  {
    accessorKey: "obs",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Observações" />
    ),
    size: 200,
    enableSorting: true,
  },
]
