import { ColumnDef } from "@tanstack/react-table"

export interface BaseColumn {
  id: string
  label: string
  isVisible?: boolean
}

export const getDefaultColumns = <T extends object>(columns: BaseColumn[]): ColumnDef<T>[] => {
  return columns.map((col) => ({
    accessorKey: col.id,
    header: col.label,
    enableHiding: true,
    ...(col.isVisible === false && { enableHiding: false })
  }))
}

// Funções utilitárias para formatação de células
export const formatDate = (value: string) => {
  const date = new Date(value)
  return date.toLocaleDateString("pt-BR")
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export const formatCpfCnpj = (value: string) => {
  if (!value) return ""
  value = value.replace(/\D/g, "")
  if (value.length === 11) {
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4")
  }
  return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5")
}

export const formatPhone = (value: string) => {
  if (!value) return ""
  value = value.replace(/\D/g, "")
  if (value.length === 11) {
    return value.replace(/(\d{2})(\d{5})(\d{4})/g, "($1) $2-$3")
  }
  return value.replace(/(\d{2})(\d{4})(\d{4})/g, "($1) $2-$3")
}

// Componentes de células comuns
export const StatusCell = ({ value }: { value: number }) => (
  <div className={`px-2 py-1 rounded-full text-xs inline-block ${
    value === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }`}>
    {value === 1 ? "Ativo" : "Inativo"}
  </div>
)

export const DateCell = ({ value }: { value: string }) => (
  <span>{formatDate(value)}</span>
)
