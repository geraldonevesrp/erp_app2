"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSupabase } from "@/contexts/supabase"
import { toast } from "sonner"
import { Copy, Edit, Plus } from "lucide-react"
import { TabelaPrecosEditar } from "@/components/erp/tabelas-precos/tabela-precos-editar"
import { useHeader } from '@/contexts/header-context'

interface TabelaPreco {
  id: number
  nome: string
  padrao: boolean
}

export default function TabelasPrecos() {
  const { supabase } = useSupabase()
  const { setTitle, setSubtitle } = useHeader()
  const [tabelas, setTabelas] = useState<TabelaPreco[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedTabelaId, setSelectedTabelaId] = useState<number | null>(null)
  const [editarOpen, setEditarOpen] = useState(false)

  useEffect(() => {
    setTitle('Comercial - Tabelas de Preços')
    setSubtitle('Gerencie suas tabelas de preços.')
  }, [setTitle, setSubtitle])

  const loadTabelas = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("tabelas_precos")
        .select("*")
        .order("nome")

      if (error) throw error
      setTabelas(data || [])
    } catch (error) {
      toast.error("Erro ao carregar tabelas de preços")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    loadTabelas()
  }, [loadTabelas])

  const handleDuplicar = async (tabela: TabelaPreco) => {
    try {
      // 1. Criar nova tabela
      const { data: novaTabelaData, error: tabelaError } = await supabase
        .from("tabelas_precos")
        .insert({
          nome: `${tabela.nome} (Cópia)`,
          padrao: false
        })
        .select()
        .single()

      if (tabelaError) throw tabelaError

      // 2. Copiar todos os itens da tabela original
      const { data: itensOriginais, error: itensError } = await supabase
        .from("tabelas_precos_itens")
        .select("*")
        .eq("tabela_id", tabela.id)

      if (itensError) throw itensError

      if (itensOriginais && itensOriginais.length > 0) {
        const novosItens = itensOriginais.map(item => ({
          ...item,
          id: undefined, // Remove o ID para criar novos registros
          tabela_id: novaTabelaData.id
        }))

        const { error: insertError } = await supabase
          .from("tabelas_precos_itens")
          .insert(novosItens)

        if (insertError) throw insertError
      }

      toast.success("Tabela duplicada com sucesso")
      loadTabelas()
    } catch (error) {
      toast.error("Erro ao duplicar tabela")
      console.error(error)
    }
  }

  const handleEditar = (tabelaId: number) => {
    setSelectedTabelaId(tabelaId)
    setEditarOpen(true)
  }

  const tabelasFiltradas = tabelas.filter((tabela) =>
    tabela.nome.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Buscar tabela..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => handleEditar(0)}>
          <Plus className="w-4 h-4 mr-2" />
          Incluir
        </Button>
      </div>

      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-4">Nome</th>
              <th className="w-32"></th>
            </tr>
          </thead>
          <tbody>
            {tabelasFiltradas.map((tabela) => (
              <tr key={tabela.id} className="border-b">
                <td className="p-4">{tabela.nome}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditar(tabela.id)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicar(tabela)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {tabelasFiltradas.length === 0 && (
              <tr>
                <td colSpan={2} className="p-4 text-center text-muted-foreground">
                  {loading ? "Carregando..." : "Nenhuma tabela encontrada"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TabelaPrecosEditar
        tabelaId={selectedTabelaId}
        open={editarOpen}
        onOpenChange={setEditarOpen}
        onSave={loadTabelas}
      />
    </div>
  )
}
