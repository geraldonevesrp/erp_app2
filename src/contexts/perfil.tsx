'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Perfil, PerfilPublico, PerfilContextType, PERFIL_TIPOS } from '@/types/perfil'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()

  const loadPerfilPublico = async (subdomain: string) => {
    try {
      const dominio = subdomain === 'localhost' ? 'thebest' : subdomain

      console.log('Buscando perfil público para domínio:', dominio)

      const { data, error } = await supabase
        .from('perfis')
        .select(`
          id,
          nome_completo,
          foto_url,
          dominio,
          tipo,
          apelido,
          created_at
        `)
        .eq('dominio', dominio)
        .single()

      if (error) {
        console.error('Erro na query do Supabase:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        })
        if (error.code === 'PGRST116') {
          console.log('Nenhum perfil público encontrado para o domínio:', dominio)
          return null
        }
        throw error
      }

      if (!data) {
        console.log('Nenhum dado retornado para o domínio:', dominio)
        return null
      }

      console.log('Perfil público encontrado:', data)

      const perfilPublicoData: PerfilPublico = {
        id: data.id,
        nome: data.nome_completo || '',
        foto_url: data.foto_url,
        dominio: data.dominio,
        tipo: data.tipo,
        apelido: data.apelido
      }

      setPerfilPublico(perfilPublicoData)
      return data // Retorna todos os dados, não só o PerfilPublico

    } catch (error: any) {
      console.error('Erro detalhado ao carregar perfil público:', {
        error,
        stack: error.stack,
        name: error.name,
        message: error.message
      })
      return null
    }
  }

  const loadPerfil = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Carrega o perfil público primeiro, baseado no subdomínio
      const hostname = window.location.hostname
      const subdomain = hostname.split('.')[0]
      
      console.log('Hostname atual:', hostname)
      console.log('Subdomínio identificado:', subdomain)

      const perfilPublicoData = await loadPerfilPublico(subdomain)

      // Se estiver na página de login, não precisa verificar mais nada
      if (window.location.pathname === '/auth/login') {
        setIsLoading(false)
        return
      }

      // 1. Verifica a sessão
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Erro na sessão:', sessionError)
        router.push('/auth/login')
        return
      }
      
      if (!session) {
        console.log('Sem sessão ativa')
        setPerfil(null)
        setPerfil_user(null)
        router.push('/auth/login')
        return
      }

      // 2. Busca o perfil do usuário logado
      const { data: userPerfil, error: userPerfilError } = await supabase
        .from('perfis')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (userPerfilError && userPerfilError.code !== 'PGRST116') {
        console.error('Erro ao buscar perfil do usuário:', userPerfilError)
        router.push('/auth/login')
        return
      }

      // Se estamos em uma área de revenda
      if (window.location.pathname.startsWith('/revendas')) {
        // Se não encontrou perfil de usuário e estamos na área de revenda
        if (!userPerfil) {
          console.log('Usuário sem perfil tentando acessar área de revenda')
          router.push('/auth/sem-acesso')
          return
        }

        // Se encontrou perfil mas não é do tipo revenda
        if (userPerfil.tipo !== PERFIL_TIPOS.REVENDA) {
          console.log('Usuário não é revenda tentando acessar área de revenda')
          router.push('/auth/sem-acesso')
          return
        }

        setPerfil(userPerfil)
        setPerfil_user(userPerfil)
        return
      }

      // Para outros tipos de perfil
      if (userPerfil) {
        setPerfil_user(userPerfil)
      }

      // Se não estamos na área de revenda, usa o perfil do subdomínio
      if (perfilPublicoData) {
        setPerfil(perfilPublicoData)
      } else {
        console.error('Nenhum perfil encontrado para o subdomínio:', subdomain)
        router.push('/auth/sem-acesso')
      }

    } catch (error: any) {
      console.error('Erro detalhado:', error)
      setError(new Error(error.message || 'Erro desconhecido ao carregar perfil'))
      setPerfil(null)
      setPerfil_user(null)
      if (!window.location.pathname.includes('/auth/')) {
        router.push('/auth/sem-acesso')
      }
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
  return useContext(PerfilContext)
}
