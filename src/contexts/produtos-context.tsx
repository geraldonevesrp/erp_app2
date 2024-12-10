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

interface ProdutoFilters {
  tipo: string | null
  genero: string | null
  marca: string | null
  categoria: string | null
  subcategoria: string | null
}

interface ProdutosContextType {
  produtos: Produto[]
  loading: boolean
  filters: ProdutoFilters
  setFilters: (filters: ProdutoFilters) => void
  loadProdutos: () => Promise<void>
  updateProduto: (id: number) => Promise<void>
}

const ProdutosContext = createContext<ProdutosContextType | undefined>(undefined)

export function ProdutosProvider({ children }: { children: React.ReactNode }) {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<ProdutoFilters>({
    tipo: null,
    genero: null,
    marca: null,
    categoria: null,
    subcategoria: null
  })
  const supabase = createClientComponentClient()
  const { perfil } = usePerfil()
  const { toast } = useToast()

  const loadProdutos = async () => {
    try {
      setLoading(true)

      if (!perfil?.id) {
        throw new Error('Perfil não encontrado')
      }

      let query = supabase
        .from('v_produtos')
        .select('*')
        .eq('perfis_id', perfil.id)
        .neq('prod_tipos_id', 3) // Excluir itens de grade

      // Aplicar filtros
      if (filters.tipo) {
        query = query.eq('prod_tipos_id', filters.tipo)
      }
      if (filters.genero) {
        query = query.eq('prod_generos_id', filters.genero)
      }
      if (filters.marca) {
        query = query.eq('prod_marcas_id', filters.marca)
      }
      if (filters.categoria) {
        query = query.eq('prod_categorias_id', filters.categoria)
      }
      if (filters.subcategoria) {
        query = query.eq('prod_subcategorias_id', filters.subcategoria)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      setProdutos(data || [])
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar produtos",
        description: error.message
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
    filters,
    setFilters,
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
