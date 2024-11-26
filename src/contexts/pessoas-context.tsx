"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { type Pessoa } from "@/components/data-tables/pessoas/columns"
import { toast } from "sonner"

interface PessoasContextData {
  pessoas: Pessoa[]
  loading: boolean
  loadPessoas: () => Promise<void>
  updatePessoa: (id: number) => Promise<void>
}

const initialState: PessoasContextData = {
  pessoas: [],
  loading: true,
  loadPessoas: async () => {},
  updatePessoa: async () => {}
}

const PessoasContext = createContext<PessoasContextData>(initialState)

export function PessoasProvider({ children }: { children: React.ReactNode }) {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [loading, setLoading] = useState(true)
  const loadingRef = useRef(false)
  const initialized = useRef(false)
  const supabase = createClientComponentClient()

  const loadPessoas = useCallback(async () => {
    if (loadingRef.current) {
      console.log('Já está carregando dados...')
      return
    }
    
    try {
      console.log('Iniciando carregamento de pessoas...')
      loadingRef.current = true
      setLoading(true)
      
      const { data, error } = await supabase
        .from('v_pessoas')
        .select('*')
        .order('apelido', { ascending: true })

      if (error) {
        console.error('Erro ao carregar pessoas:', error)
        toast.error('Erro ao carregar pessoas: ' + error.message)
        throw error
      }

      if (!data) {
        console.warn('Nenhum dado retornado da consulta')
        setPessoas([])
        return
      }

      console.log('Dados carregados com sucesso:', {
        quantidade: data.length,
        primeiroRegistro: data[0],
        ultimoRegistro: data[data.length - 1]
      })

      setPessoas(data)
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error)
      setPessoas([])
      toast.error('Erro ao carregar pessoas')
    } finally {
      setTimeout(() => {
        setLoading(false)
        loadingRef.current = false
        console.log('Finalizando carregamento...')
      }, 300)
    }
  }, [supabase])

  const updatePessoa = useCallback(async (id: number) => {
    try {
      console.log('Atualizando pessoa:', id)
      setLoading(true)

      const { data, error } = await supabase
        .from('v_pessoas')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Erro ao atualizar pessoa:', error)
        toast.error('Erro ao atualizar pessoa: ' + error.message)
        throw error
      }

      console.log('Pessoa atualizada:', data)
      setPessoas(prev => prev.map(p => p.id === id ? data : p))
    } catch (error) {
      console.error('Erro ao atualizar pessoa:', error)
      toast.error('Erro ao atualizar pessoa')
    } finally {
      setTimeout(() => setLoading(false), 300)
    }
  }, [supabase])

  // Carrega os dados iniciais
  useEffect(() => {
    if (!initialized.current) {
      console.log('Carregamento inicial de pessoas')
      initialized.current = true
      loadPessoas()
    }
  }, [loadPessoas])

  const contextValue = useMemo(() => ({
    pessoas,
    loading,
    loadPessoas,
    updatePessoa
  }), [pessoas, loading, loadPessoas, updatePessoa])

  return (
    <PessoasContext.Provider value={contextValue}>
      {children}
    </PessoasContext.Provider>
  )
}

export const usePessoas = () => {
  const context = useContext(PessoasContext)
  if (!context) {
    throw new Error('usePessoas must be used within a PessoasProvider')
  }
  return context
}
