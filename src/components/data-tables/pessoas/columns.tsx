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

// Função auxiliar para filtrar valores
const basicFilter = (value: any, filterValue: string) => {
  if (!filterValue || filterValue === "all") return true
  return String(value).toLowerCase() === String(filterValue).toLowerCase()
}

// Função auxiliar para filtrar arrays
const arrayFilter = (value: any, filterValue: any) => {
  if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) return true
  
  try {
    let array: string[] = []
    if (typeof value === 'string') {
      array = JSON.parse(value)
    } else if (Array.isArray(value)) {
      array = value
    }
    
    console.log('Filtrando array:', {
      value,
      filterValue,
      parsedArray: array
    })
    
    // Se filterValue é um array (MultiSelect), verifica se algum valor do filtro está no array do item
    if (Array.isArray(filterValue)) {
      const result = filterValue.some(filter => 
        array.some(item => {
          console.log('Comparando:', { filter, item, equal: String(item) === String(filter) })
          return String(item) === String(filter)
        })
      )
      console.log('Resultado do filtro:', result)
      return result
    }
    
    // Se filterValue é string (Input), verifica se algum item do array contém o texto
    return array.some(item => String(item) === String(filterValue))
  } catch (error) {
    console.log('Erro no filtro:', error)
    return String(value) === String(filterValue)
  }
}

// Função auxiliar para renderizar arrays
const arrayRenderer = (value: any) => {
  if (!value) return "-"
  
  try {
    if (typeof value === 'string') {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        return parsed.map(item => item.trim()).join(", ")
      }
    }
    
    if (Array.isArray(value)) {
      return value.map(item => item.trim()).join(", ")
    }
    
    return String(value)
  } catch (error) {
    return String(value)
  }
}

export const columns: ColumnDef<Pessoa>[] = [
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
      const pessoa = row.original
      return (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={() => {
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
    }
  },
  // Dados básicos
  {
    accessorKey: "apelido",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Apelido" />
    ),
    size: 180,
    enableSorting: true,
  },
  {
    accessorKey: "nome_razao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome/Razão Social" />
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
      <DataTableColumnHeader column={column} title="IM" />
    ),
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: "telefones",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Telefones" />
    ),
    cell: ({ row }) => arrayRenderer(row.getValue("telefones")),
    filterFn: (row, id, value) => arrayFilter(row.getValue(id), value),
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: "emails",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="E-mails" />
    ),
    cell: ({ row }) => arrayRenderer(row.getValue("emails")),
    filterFn: (row, id, value) => arrayFilter(row.getValue(id), value),
    size: 200,
    enableSorting: true,
  },
  {
    accessorKey: "nascimento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nascimento" />
    ),
    cell: ({ row }) => <DateCell date={row.getValue("nascimento")} />,
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
    cell: ({ row }) => {
      const tipo = row.getValue("tipo")
      return tipo
    },
    filterFn: (row, id, value) => basicFilter(row.getValue(id), value),
    size: 100,
    enableSorting: true,
  },
  {
    accessorKey: "tipospessoas",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipos de Pessoa" />
    ),
    cell: ({ row }) => arrayRenderer(row.getValue("tipospessoas")),
    filterFn: (row, id, value) => {
      // Pega os IDs dos tipos de pessoa do registro
      const tiposIds = row.original.pessoas_tipos || []
      
      // Converte o valor do filtro para array se não for
      const filterValue = Array.isArray(value) ? value : [value]
      
      // Verifica se algum dos IDs selecionados está no array de IDs do registro
      return filterValue.some(filterId => 
        tiposIds.includes(Number(filterId))
      )
    },
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: "ramo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ramo" />
    ),
    cell: ({ row }) => row.getValue("ramo"),
    filterFn: (row, id, value) => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return true
      }

      const rowRamoId = row.original.ramo_id
      const filterValue = Array.isArray(value) ? value : [value]
      
      return filterValue.includes(String(rowRamoId))
    },
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: "grupos",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grupos" />
    ),
    cell: ({ row }) => arrayRenderer(row.getValue("grupos")),
    filterFn: (row, id, value) => {
      // Se não houver valor de filtro ou array vazio, não filtra
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return true
      }

      // Pega os IDs dos grupos do registro
      const gruposIds = row.original.grupos_ids || []
      
      // Converte o valor do filtro para array se não for
      const filterValue = Array.isArray(value) ? value : [value]
      
      // Verifica se algum dos IDs selecionados está no array de IDs do registro
      return filterValue.some(filterId => 
        gruposIds.includes(Number(filterId))
      )
    },
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: "subgrupos",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subgrupos" />
    ),
    cell: ({ row }) => arrayRenderer(row.getValue("subgrupos")),
    filterFn: (row, id, value) => {
      // Se não houver valor de filtro ou array vazio, não filtra
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return true
      }

      // Pega os IDs dos subgrupos do registro
      const subgruposIds = row.original.subgrupos_ids || []
      
      // Converte o valor do filtro para array se não for
      const filterValue = Array.isArray(value) ? value : [value]
      
      // Verifica se algum dos IDs selecionados está no array de IDs do registro
      return filterValue.some(filterId => 
        subgruposIds.includes(Number(filterId))
      )
    },
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: "atividades",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Atividades" />
    ),
    cell: ({ row }) => arrayRenderer(row.getValue("atividades")),
    filterFn: (row, id, value) => arrayFilter(row.getValue(id), value),
    size: 150,
    enableSorting: true,
  },
  // Endereço
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
      <DataTableColumnHeader column={column} title="Município" />
    ),
    filterFn: (row, id, value) => {
      // Se não houver valor de filtro ou array vazio, não filtra
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return true
      }

      const filterValue = Array.isArray(value) ? value : [value]
      return filterValue.includes(row.getValue(id))
    },
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: "endereco_uf",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="UF" />
    ),
    filterFn: (row, id, value) => {
      // Se não houver valor de filtro ou array vazio, não filtra
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return true
      }

      const filterValue = Array.isArray(value) ? value : [value]
      return filterValue.includes(row.getValue(id))
    },
    size: 80,
    enableSorting: true,
  },
  // Outros
  {
    accessorKey: "status_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status_id")
      return status === 1 ? "Ativo" : "Inativo"
    },
    filterFn: (row, id, value) => basicFilter(row.getValue(id), value),
    size: 100,
    enableSorting: true,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado em" />
    ),
    cell: ({ row }) => <DateCell date={row.getValue("created_at")} />,
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
