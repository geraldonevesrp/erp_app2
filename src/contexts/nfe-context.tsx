"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"
import { emitirNfe } from '@/lib/nuvemfiscal/api/nfe'
import type { NfePedidoEmissao, NfeResposta } from '@/lib/nuvemfiscal/api/nfe/types'

interface NFe {
  id: number;
  created_at: string;
  data_emissao: string | null;
  chave: string | null;
  api_status: string | null;
  api_id: string | null;
  destinatario?: {
    id: number;
    nome_razao: string;
    cpf_cnpj: string | null;
  } | null;
  transportador?: {
    id: number;
    nome_razao: string;
    cpf_cnpj: string | null;
  } | null;
  empresa?: {
    id: number;
    razao_social: string;
    fantasia: string | null;
  } | null;
}

interface NfeContextData {
  loading: boolean;
  nfes: NFe[];
  emitirNota: (pedido: NfePedidoEmissao) => Promise<NfeResposta>;
  loadNfes: () => Promise<void>;
  updateNfe: (id: number) => Promise<void>;
}

const initialState: NfeContextData = {
  loading: false,
  nfes: [],
  emitirNota: async () => {
    throw new Error('NfeContext not initialized')
  },
  loadNfes: async () => {
    throw new Error('NfeContext not initialized')
  },
  updateNfe: async () => {
    throw new Error('NfeContext not initialized')
  },
}

const NfeContext = createContext<NfeContextData>(initialState)

export function NfeProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false)
  const [nfes, setNfes] = useState<NFe[]>([])
  const supabase = createClientComponentClient()

  const loadNfes = useCallback(async () => {
    try {
      setLoading(true)
      
      // Primeiro, verifica se o usuário está autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw new Error('Erro ao obter usuário: ' + userError.message)
      if (!user) throw new Error('Usuário não autenticado')

      // Busca as NFes
      const { data, error } = await supabase
        .from('nfe')
        .select(`
          id,
          created_at,
          data_emissao,
          chave,
          api_status,
          api_id,
          destinatario:pessoas!nfe_pessoas_id_fkey (
            id,
            nome_razao,
            cpf_cnpj
          ),
          transportador:pessoas!nfe_transportador_id_fkey (
            id,
            nome_razao,
            cpf_cnpj
          ),
          empresa:empresas!Nfe_empresas_id_fkey (
            id,
            razao_social,
            fantasia
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro Supabase:', error)
        throw new Error(error.message || 'Erro ao carregar NFes')
      }

      console.log('NFes carregadas:', data)
      setNfes(data || [])
    } catch (error: any) {
      console.error('Erro ao carregar NFes:', error)
      toast.error('Erro ao carregar NFes: ' + (error.message || 'Erro desconhecido'))
      throw error
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const updateNfe = useCallback(async (id: number) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('nfe')
        .select(`
          id,
          created_at,
          data_emissao,
          chave,
          api_status,
          api_id,
          destinatario:pessoas!nfe_pessoas_id_fkey (
            id,
            nome_razao,
            cpf_cnpj
          ),
          transportador:pessoas!nfe_transportador_id_fkey (
            id,
            nome_razao,
            cpf_cnpj
          ),
          empresa:empresas!Nfe_empresas_id_fkey (
            id,
            razao_social,
            fantasia
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Erro Supabase:', error)
        throw new Error(error.message || 'Erro ao atualizar NFe')
      }

      setNfes(prev => {
        const index = prev.findIndex(p => p.id === id)
        if (index >= 0) {
          const updated = [...prev]
          updated[index] = data
          return updated
        }
        return prev
      })
    } catch (error: any) {
      console.error('Erro ao atualizar NFe:', error)
      toast.error('Erro ao atualizar NFe: ' + (error.message || 'Erro desconhecido'))
      throw error
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const emitirNota = useCallback(async (pedido: NfePedidoEmissao) => {
    try {
      setLoading(true)

      // Busca a empresa do usuário logado
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw new Error('Erro ao obter usuário: ' + userError.message)
      if (!user) throw new Error('Usuário não autenticado')

      const { data: empresa, error: empresaError } = await supabase
        .from('empresas')
        .select('cnpj')
        .eq('user_id', user.id)
        .single()

      if (empresaError) throw new Error('Erro ao buscar empresa: ' + empresaError.message)
      if (!empresa) throw new Error('Empresa não encontrada')

      // Emite a nota
      const nfe = await emitirNfe(empresa.cnpj, pedido)

      toast.success('NFe emitida com sucesso')
      return nfe
    } catch (error: any) {
      console.error('Erro ao emitir NFe:', error)
      toast.error('Erro ao emitir NFe: ' + (error.message || 'Erro desconhecido'))
      throw error
    } finally {
      setLoading(false)
    }
  }, [supabase])

  return (
    <NfeContext.Provider value={{
      loading,
      nfes,
      emitirNota,
      loadNfes,
      updateNfe,
    }}>
      {children}
    </NfeContext.Provider>
  )
}

export function useNfe() {
  const context = useContext(NfeContext)
  if (!context) {
    throw new Error('useNfe must be used within a NfeProvider')
  }
  return context
}
