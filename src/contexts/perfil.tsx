'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Perfil, PerfilPublico } from '@/types/perfil'

interface PerfilContextType {
  perfil: Perfil | null
  perfilPublico: PerfilPublico | null
  isLoading: boolean
  error: Error | null
  refreshPerfil: () => Promise<void>
}

const PerfilContext = createContext<PerfilContextType>({
  perfil: null,
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
  const [perfilPublico, setPerfilPublico] = useState<PerfilPublico | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  // Carrega apenas os dados públicos do perfil
  const loadPerfilPublico = async () => {
    try {
      // Pega o hostname
      const hostname = window.location.hostname
      // Extrai o subdomínio
      const subdomain = hostname.split('.')[0]
      
      console.log('Hostname:', hostname)
      console.log('Subdomínio detectado:', subdomain)
      
      // Em desenvolvimento, localhost retorna string vazia como subdomínio
      if (!subdomain || subdomain === 'localhost') {
        console.log('Ambiente de desenvolvimento detectado, usando thebest como domínio')
        
        // Busca o perfil de teste
        const { data, error } = await supabase
          .from('perfis')
          .select('nome_completo, foto_url, apelido, dominio')
          .eq('dominio', 'thebest')
          .maybeSingle()

        if (error) {
          console.error('Erro ao buscar perfil:', error.message)
          throw error
        }

        if (!data) {
          console.log('Nenhum perfil encontrado para domínio thebest')
          return
        }

        // Filtra apenas os campos públicos
        const perfilPublico: PerfilPublico = {
          nome: data.nome_completo,
          foto_url: data.foto_url,
          apelido: data.apelido,
          dominio: data.dominio
        }

        console.log('Dados do perfil público:', perfilPublico)
        setPerfilPublico(perfilPublico)
        return
      }
      
      // Busca apenas os dados públicos do perfil
      const { data, error } = await supabase
        .from('perfis')
        .select('nome_completo, foto_url, apelido, dominio')
        .eq('dominio', subdomain)
        .maybeSingle()

      if (error) {
        console.error('Erro ao buscar perfil:', error.message)
        throw error
      }

      if (!data) {
        console.log('Nenhum perfil encontrado para domínio', subdomain)
        return
      }

      // Filtra apenas os campos públicos
      const perfilPublico: PerfilPublico = {
        nome: data.nome_completo,
        foto_url: data.foto_url,
        apelido: data.apelido,
        dominio: data.dominio
      }

      console.log('Dados do perfil público:', perfilPublico)
      setPerfilPublico(perfilPublico)
    } catch (error) {
      console.error('Erro ao carregar dados públicos do perfil:', error)
      setPerfilPublico(null)
    }
  }

  // Carrega o perfil completo (requer autenticação)
  const loadPerfil = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Verifica se tem sessão
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setPerfil(null)
        return
      }

      // Pega o hostname
      const hostname = window.location.hostname
      // Extrai o subdomínio
      const subdomain = hostname.split('.')[0]
      
      // Busca o perfil completo
      const { data: perfilData, error: perfilError } = await supabase
        .from('perfis')
        .select('*')
        .eq('dominio', subdomain)
        .single()

      if (perfilError) throw perfilError

      // Verifica se o usuário é dono ou tem acesso ao perfil
      const isOwner = perfilData.user_id === session.user.id

      if (!isOwner) {
        // Verifica se tem acesso via perfis_users
        const { data: userPerfil, error: userPerfilError } = await supabase
          .from('perfis_users')
          .select('*')
          .eq('perfil_id', perfilData.id)
          .eq('user_id', session.user.id)
          .single()

        if (userPerfilError) throw userPerfilError
      }

      setPerfil(perfilData)
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
      setError(error as Error)
      setPerfil(null)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshPerfil = async () => {
    await loadPerfil()
  }

  useEffect(() => {
    // Carrega os dados públicos imediatamente
    loadPerfilPublico()

    // Tenta carregar o perfil completo se houver sessão
    loadPerfil()
  }, [])

  return (
    <PerfilContext.Provider value={{ 
      perfil, 
      perfilPublico, 
      isLoading, 
      error, 
      refreshPerfil 
    }}>
      {children}
    </PerfilContext.Provider>
  )
}

export function usePerfil() {
  const context = useContext(PerfilContext)
  if (!context) {
    throw new Error('usePerfil deve ser usado dentro de um PerfilProvider')
  }
  return context
}
