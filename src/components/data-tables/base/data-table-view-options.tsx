"use client"

import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { RotateCcw, Settings2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { defaultVisibleColumns } from "@/components/data-tables/pessoas/columns"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const resetVisibility = () => {
    // Cria um novo estado com todas as colunas ocultas primeiro
    const newState: { [key: string]: boolean } = {}
    table.getAllColumns().forEach(column => {
      if (column.getCanHide()) {
        newState[column.id] = false
      }
    })

    // Mostra apenas as colunas padrão
    defaultVisibleColumns.forEach(columnId => {
      newState[columnId] = true
    })

    // Atualiza a visibilidade usando a função do table
    // Isso vai acionar o onColumnVisibilityChange que salvará no localStorage
    table.setColumnVisibility(newState)
  }

  // Função auxiliar para obter o título da coluna
  const getColumnTitle = (column: any) => {
    switch (column.id) {
      case "apelido":
        return "Apelido/Nome Fantasia"
      case "nome_razao":
        return "Nome Completo/Razão Social"
      case "cpf_cnpj":
        return "CPF/CNPJ"
      case "rg_ie":
        return "RG/IE"
      case "IM":
        return "Inscrição Municipal"
      case "telefones":
        return "Telefones"
      case "emails":
        return "E-mails"
      case "nascimento":
        return "Data Nascimento"
      case "genero":
        return "Gênero"
      case "tipo":
        return "Tipo"
      case "status_id":
        return "Status"
      case "ramo":
        return "Ramo de Atividade"
      case "grupos":
        return "Grupos"
      case "subgrupos":
        return "Subgrupos"
      case "atividades":
        return "Atividades"
      case "endereco_cep":
        return "CEP"
      case "endereco_logradouro":
        return "Logradouro"
      case "endereco_numero":
        return "Número"
      case "endereco_complemento":
        return "Complemento"
      case "endereco_bairro":
        return "Bairro"
      case "endereco_localidade":
        return "Cidade"
      case "endereco_uf":
        return "UF"
      case "created_at":
        return "Data de Cadastro"
      case "obs":
        return "Observações"
      default:
        return column.id
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <Settings2 className="mr-2 h-4 w-4" />
          Colunas
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col h-full">
          <SheetHeader className="mb-6">
            <SheetTitle>Colunas Visíveis</SheetTitle>
            <SheetDescription>
              Selecione as colunas que deseja exibir na tabela.
            </SheetDescription>
          </SheetHeader>
          
          <ScrollArea className="flex-1 -mx-6">
            <div className="px-6">
              {table.getAllColumns().filter(column => column.getCanHide()).map(column => {
                return (
                  <div key={column.id} className="py-2 flex items-center justify-between">
                    <span className="text-sm">{getColumnTitle(column)}</span>
                    <Switch
                      checked={column.getIsVisible()}
                      onCheckedChange={value => column.toggleVisibility(value)}
                      aria-label={`Toggle ${getColumnTitle(column)} column`}
                    />
                  </div>
                )
              })}
            </div>
          </ScrollArea>

          <div className="mt-auto pt-4 border-t">
            <Button variant="outline" onClick={resetVisibility} className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              Restaurar Padrão
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
