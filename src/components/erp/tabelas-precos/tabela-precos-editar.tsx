"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataGrid } from "@/components/ui/data-grid"
import { TabelaPrecosSheet } from "./tabela-precos-sheet"
import { NumericFormat } from "react-number-format"

interface TabelaPreco {
  id: number
  nome: string
  padrao: boolean
}

interface Item {
  id: number
  tabelas_precos_id: number
  produtos_id: number
  produto: {
    id: number
    nome: string
    codigo: string
  }
  custo: number
  custo_total: number
  margem_lucro: number
  margem_lucro_p: number
  preco: number
  frete: number
  frete_p: number
  ipi: number
  ipi_p: number
  icms_st: number
  icms_st_p: number
  icms: number
  icms_p: number
  fcp_st: number
  fcp_st_p: number
  seguro: number
  seguro_p: number
  despesas: number
  despesas_p: number
}

interface TabelaPrecosEditarProps {
  tabelaId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
}

export function TabelaPrecosEditar({
  tabelaId,
  open,
  onOpenChange,
  onSave,
}: TabelaPrecosEditarProps) {
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [tabela, setTabela] = useState<TabelaPreco | null>(null)
  const [itens, setItens] = useState<Item[]>([])
  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [hasChanges, setHasChanges] = useState(false)
  const itemsPerPage = 10

  const loadTabela = useCallback(async () => {
    if (!tabelaId) return

    try {
      const { data, error } = await supabase
        .from("tabelas_precos")
        .select("*")
        .eq("id", tabelaId)
        .single()

      if (error) {
        throw new Error("Erro ao carregar tabela: " + error.message)
      }

      setTabela(data)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Erro ao carregar tabela")
      }
    }
  }, [tabelaId, supabase])

  const loadItens = useCallback(async () => {
    if (!tabelaId) return
    setLoading(true)

    try {
      // Primeiro, pegar o total de itens para paginação
      const { count, error: countError } = await supabase
        .from("tabelas_precos_itens")
        .select("*", { count: "exact", head: true })
        .eq("tabelas_precos_id", tabelaId)

      if (countError) {
        throw new Error("Erro ao contar itens: " + countError.message)
      }
      
      setTotalItems(count || 0)

      // Depois, pegar os itens da página atual
      const { data, error } = await supabase
        .from("tabelas_precos_itens")
        .select("*, produto:produtos(id, nome, codigo)")
        .eq("tabelas_precos_id", tabelaId)
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1)
        .order("produto(nome)")

      if (error) {
        throw new Error("Erro ao carregar itens: " + error.message)
      }

      setItens(data || [])
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Erro ao carregar itens")
      }
    } finally {
      setLoading(false)
    }
  }, [tabelaId, page, supabase])

  useEffect(() => {
    if (open) {
      loadTabela()
      loadItens()
    }
  }, [open, loadTabela, loadItens])

  const handleSave = async () => {
    if (!tabela) return

    try {
      const { error } = await supabase
        .from("tabelas_precos")
        .update({
          nome: tabela.nome,
          padrao: tabela.padrao,
        })
        .eq("id", tabela.id)

      if (error) {
        throw new Error("Erro ao salvar tabela: " + error.message)
      }

      toast.success("Tabela salva com sucesso")
      setHasChanges(false)
      onSave()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Erro ao salvar tabela")
      }
    }
  }

  const handleUpdateItem = async (id: number, updates: Partial<Item>) => {
    try {
      const { error } = await supabase
        .from("tabelas_precos_itens")
        .update(updates)
        .eq("id", id)

      if (error) {
        throw new Error("Erro ao atualizar item: " + error.message)
      }

      toast.success("Item atualizado com sucesso")
      loadItens()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Erro ao atualizar item")
      }
    }
  }

  const columns = [
    {
      header: "Código",
      accessorKey: "produto.codigo",
      size: 120,
    },
    {
      header: "Produto",
      accessorKey: "produto.nome",
      size: 300,
    },
    {
      header: "Custo",
      accessorKey: "custo",
      size: 120,
      cell: ({ row }: { row: any }) => (
        <NumericFormat
          value={row.original.custo}
          displayType="input"
          thousandSeparator="."
          decimalSeparator=","
          decimalScale={2}
          fixedDecimalScale
          prefix="R$ "
          onValueChange={(values) => {
            handleUpdateItem(row.original.id, {
              custo: values.floatValue || 0,
            })
          }}
        />
      ),
    },
    {
      header: "Margem (%)",
      accessorKey: "margem_lucro_p",
      size: 120,
      cell: ({ row }: { row: any }) => (
        <NumericFormat
          value={row.original.margem_lucro_p}
          displayType="input"
          thousandSeparator="."
          decimalSeparator=","
          decimalScale={2}
          fixedDecimalScale
          suffix=" %"
          onValueChange={(values) => {
            handleUpdateItem(row.original.id, {
              margem_lucro_p: values.floatValue || 0,
            })
          }}
        />
      ),
    },
    {
      header: "Preço",
      accessorKey: "preco",
      size: 120,
      cell: ({ row }: { row: any }) => (
        <NumericFormat
          value={row.original.preco}
          displayType="input"
          thousandSeparator="."
          decimalSeparator=","
          decimalScale={2}
          fixedDecimalScale
          prefix="R$ "
          readOnly
        />
      ),
    },
  ]

  return (
    <TabelaPrecosSheet
      open={open}
      onOpenChange={onOpenChange}
      title={tabela?.nome || ""}
      hasChanges={hasChanges}
      onSave={handleSave}
    >
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Nome da tabela"
            value={tabela?.nome || ""}
            onChange={(e) => {
              setTabela((prev) =>
                prev ? { ...prev, nome: e.target.value } : null
              )
              setHasChanges(true)
            }}
          />
          <Button
            variant="outline"
            onClick={() => {
              setTabela((prev) =>
                prev ? { ...prev, padrao: !prev.padrao } : null
              )
              setHasChanges(true)
            }}
          >
            {tabela?.padrao ? "Tabela Padrão" : "Definir como Padrão"}
          </Button>
        </div>

        <DataGrid
          columns={columns}
          data={itens}
          loading={loading}
          pagination={{
            page,
            pageSize: itemsPerPage,
            totalItems,
            onPageChange: setPage,
          }}
        />
      </div>
    </TabelaPrecosSheet>
  )
}
