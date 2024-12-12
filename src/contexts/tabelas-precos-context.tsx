"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { useSupabase } from "./supabase"
import { toast } from "sonner"

interface TabelaPreco {
  id: number
  nome: string
  padrao: boolean
}

interface TabelaPrecoItem {
  id: number
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

interface TabelasPrecosContextType {
  tabelas: TabelaPreco[]
  selectedTabela: TabelaPreco | null
  itens: TabelaPrecoItem[]
  loadTabelas: () => Promise<void>
  loadItens: (tabelaId: number) => Promise<void>
  handleUpdateItem: (id: number, field: string, value: string) => Promise<void>
  handleCreateTabela: () => Promise<void>
  handleUpdateTabela: (id: number, nome: string) => Promise<void>
  setSelectedTabela: (tabela: TabelaPreco | null) => void
}

const TabelasPrecosContext = createContext<TabelasPrecosContextType | undefined>(undefined)

export function TabelasPrecosProvider({ children }: { children: ReactNode }) {
  const { supabase } = useSupabase()
  const [selectedTabela, setSelectedTabela] = useState<TabelaPreco | null>(null)
  const [tabelas, setTabelas] = useState<TabelaPreco[]>([])
  const [itens, setItens] = useState<TabelaPrecoItem[]>([])

  const loadTabelas = useCallback(async () => {
    const { data, error } = await supabase
      .from("tabelas_precos")
      .select("*")
      .order("nome")
    
    if (error) {
      toast.error("Erro ao carregar tabelas de preços")
      return
    }

    setTabelas(data)
    if (data.length > 0 && !selectedTabela) {
      setSelectedTabela(data[0])
      loadItens(data[0].id)
    }
  }, [supabase, selectedTabela])

  const loadItens = useCallback(async (tabelaId: number) => {
    const { data, error } = await supabase
      .from("tabelas_precos_itens")
      .select(`
        *,
        produto:produtos (
          id,
          nome,
          codigo
        )
      `)
      .eq("tabelas_precos_id", tabelaId)
      .order("id")
    
    if (error) {
      toast.error("Erro ao carregar itens da tabela")
      return
    }

    setItens(data)
  }, [supabase])

  const handleUpdateItem = useCallback(async (id: number, field: string, value: string) => {
    const { error } = await supabase
      .from("tabelas_precos_itens")
      .update({ [field]: value })
      .eq("id", id)
    
    if (error) {
      toast.error("Erro ao atualizar item")
      return
    }

    // Recarrega os itens para obter os valores calculados pelo trigger
    if (selectedTabela) {
      loadItens(selectedTabela.id)
    }
  }, [supabase, selectedTabela, loadItens])

  const handleCreateTabela = useCallback(async () => {
    const { data, error } = await supabase
      .from("tabelas_precos")
      .insert({ nome: "Nova Tabela" })
      .select()
      .single()
    
    if (error) {
      toast.error("Erro ao criar tabela")
      return
    }

    loadTabelas()
    setSelectedTabela(data)
  }, [supabase, loadTabelas])

  const handleUpdateTabela = useCallback(async (id: number, nome: string) => {
    const { error } = await supabase
      .from("tabelas_precos")
      .update({ nome })
      .eq("id", id)
    
    if (error) {
      toast.error("Erro ao atualizar tabela")
      return
    }

    loadTabelas()
  }, [supabase, loadTabelas])

  return (
    <TabelasPrecosContext.Provider
      value={{
        tabelas,
        selectedTabela,
        itens,
        loadTabelas,
        loadItens,
        handleUpdateItem,
        handleCreateTabela,
        handleUpdateTabela,
        setSelectedTabela,
      }}
    >
      {children}
    </TabelasPrecosContext.Provider>
  )
}

export function useTabelasPrecos() {
  const context = useContext(TabelasPrecosContext)
  if (context === undefined) {
    throw new Error("useTabelasPrecos must be used within a TabelasPrecosProvider")
  }
  return context
}
