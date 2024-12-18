"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

export type Empresa = {
  id: number
  razao_social: string
  fantasia: string
  cnpj: string
  ie: string
  padrao: boolean
  status: string
  endereco: string
  cidade: string
  estado: string
  telefone: string
  email: string
}

export const columns: ColumnDef<Empresa>[] = [
  {
    accessorKey: "razao_social",
    header: "Razão Social",
    enableHiding: true,
  },
  {
    accessorKey: "fantasia",
    header: "Nome Fantasia",
    enableHiding: true,
  },
  {
    accessorKey: "cnpj",
    header: "CNPJ",
    enableHiding: true,
    cell: ({ row }) => {
      const cnpj = row.getValue("cnpj") as string
      return cnpj ? cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5") : ""
    }
  },
  {
    accessorKey: "ie",
    header: "IE",
    enableHiding: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    enableHiding: true,
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "Ativo" ? "success" : "destructive"}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "endereco",
    header: "Endereço",
    enableHiding: true,
  },
  {
    accessorKey: "cidade",
    header: "Cidade",
    enableHiding: true,
  },
  {
    accessorKey: "estado",
    header: "Estado",
    enableHiding: true,
  },
  {
    accessorKey: "telefone",
    header: "Telefone",
    enableHiding: true,
    cell: ({ row }) => {
      const telefone = row.getValue("telefone") as string
      return telefone ? telefone.replace(/^(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3") : ""
    }
  },
  {
    accessorKey: "email",
    header: "E-mail",
    enableHiding: true,
  },
  {
    accessorKey: "padrao",
    header: "Padrão",
    enableHiding: true,
    cell: ({ row }) => (
      <Badge variant={row.original.padrao ? "default" : "secondary"}>
        {row.original.padrao ? "Sim" : "Não"}
      </Badge>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const empresa = row.original

      return (
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const event = new CustomEvent('editEmpresa', {
                      detail: { empresaId: empresa.id }
                    })
                    window.dispatchEvent(event)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar empresa</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const event = new CustomEvent('deleteEmpresa', {
                      detail: { empresaId: empresa.id }
                    })
                    window.dispatchEvent(event)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Excluir empresa</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    },
  },
]
