'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Perfil, PerfilPublico, PerfilContextType, PERFIL_TIPOS } from '@/types/perfil'

const PerfilContext = createContext<PerfilContextType>({
  perfil: null,
  perfil_user: null,
  perfilPublico: null,
  isLoading: true,
  error: null,
  refreshPerfil: async () => {},
})

export function PerfilProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [perfil_user, setPerfil_user] = useState<Perfil | null>(null)
  const [perfilPublico, setPerfilPublico] = useState<PerfilPublico | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  const loadPerfil = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // 1. Verifica a sessão
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Erro na sessão:', sessionError)
        throw new Error(`Erro na sessão: ${sessionError.message}`)
      }
      
      if (!session) {
        console.log('Sem sessão ativa')
        setPerfil(null)
        return
      }

      console.log('Sessão encontrada:', session.user.id)

      // 2. Busca o perfil pelo subdomínio
      const hostname = window.location.hostname
      const subdomain = hostname.split('.')[0]
      console.log('Buscando perfil para subdomínio:', subdomain)

      const { data: perfilData, error: perfilError } = await supabase
        .from('perfis')
        .select('*')
        .eq('dominio', subdomain === 'localhost' ? 'thebest' : subdomain)
        .single()

      if (perfilError) {
        console.error('Erro ao buscar perfil por subdomínio:', perfilError)
        throw new Error(`Erro ao buscar perfil: ${perfilError.message}`)
      }

      if (!perfilData) {
        console.error('Nenhum perfil encontrado para o subdomínio:', subdomain)
        throw new Error('Perfil não encontrado para este subdomínio')
      }

      console.log('Perfil encontrado:', perfilData)
      setPerfil(perfilData)

      // 3. Se for um perfil de revenda, busca o perfil do usuário
      if (perfilData.tipo === PERFIL_TIPOS.REVENDA) {
        const { data: userData, error: userError } = await supabase
          .from('perfis')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        if (userError) {
          console.error('Erro ao buscar perfil do usuário:', userError)
        } else if (userData) {
          console.log('Perfil do usuário encontrado:', userData)
          setPerfil_user(userData)
        }
      }

    } catch (error: any) {
      console.error('Erro detalhado:', error)
      setError(new Error(error.message || 'Erro desconhecido ao carregar perfil'))
      setPerfil(null)
      setPerfil_user(null)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshPerfil = async () => {
    await loadPerfil()
  }

  useEffect(() => {
    loadPerfil()
  }, [])

  return (
    <PerfilContext.Provider
      value={{
        perfil,
        perfil_user,
        perfilPublico,
        isLoading,
        error,
        refreshPerfil,
      }}
    >
      {children}
    </PerfilContext.Provider>
  )
}

export function usePerfil() {
  const context = useContext(PerfilContext)
  if (!context) {
    throw new Error('usePerfil must be used within a PerfilProvider')
  }
  return context
}
