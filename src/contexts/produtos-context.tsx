"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { usePerfil } from './perfil'
import { useToast } from '@/components/ui/use-toast'

interface Produto {
  id: number
  nome: string
  cod_barras: string
  sku: string
  descricao: string
  ativo: boolean
  visivel_catalogo: boolean
  prod_categorias_id: number
  prod_subcategorias_id: number
  prod_marcas_id: number
  prod_tipos_id: number
  prod_generos_id: number
  unid_venda: number
  unid_compra: number
  unid_fator_conversao: number
  estoque_negativo: boolean
  controlado_lote: boolean
  composto: boolean
  food: boolean
  peso_bruto: number
  peso_liquido: number
  embalagem: string
  estoque_ideal: number
  custo_ultima_comp: number
  comissao: number
  cashback: number
  cashback_p: number
  compra_frete: number
  compra_frete_p: number
  variacao1: string
  variacao2: string
  prod_variacao1_id: number
  prod_variacao2_id: number
  grade_de: number
}

interface ProdutosContextType {
  produtos: Produto[]
  loading: boolean
  loadProdutos: () => Promise<void>
  updateProduto: (id: number) => Promise<void>
}

const ProdutosContext = createContext<ProdutosContextType | undefined>(undefined)

export function ProdutosProvider({ children }: { children: React.ReactNode }) {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const { perfil } = usePerfil()
  const { toast } = useToast()

  const loadProdutos = async () => {
    try {
      // Se não tiver perfil, não carrega os produtos
      if (!perfil?.id) {
        console.log('Aguardando perfil...')
        return
      }

      setLoading(true)
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('perfis_id', perfil.id)
        .order('nome')

      if (error) throw error

      setProdutos(data || [])
    } catch (error: any) {
      console.error('Erro ao carregar produtos:', error.message)
      toast({
        title: 'Erro ao carregar produtos',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateProduto = async (id: number) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      setProdutos(prev => prev.map(p => p.id === id ? data : p))
    } catch (error: any) {
      console.error('Erro ao atualizar produto:', error.message)
      toast({
        title: 'Erro ao atualizar produto',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (perfil?.id) {
      loadProdutos()
    }
  }, [perfil?.id])

  const value = {
    produtos,
    loading,
    loadProdutos,
    updateProduto
  }

  return (
    <ProdutosContext.Provider value={value}>
      {children}
    </ProdutosContext.Provider>
  )
}

export function useProdutos() {
  const context = useContext(ProdutosContext)
  if (context === undefined) {
    throw new Error('useProdutos must be used within a ProdutosProvider')
  }
  return context
}
