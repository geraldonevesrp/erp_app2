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
      // Se for localhost sem subdomínio, não carrega perfil público
      if (subdomain === 'localhost') {
        console.log('Localhost sem subdomínio, não carregando perfil público')
        return null
      }

      console.log('Buscando perfil público para domínio:', subdomain)

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
        .eq('dominio', subdomain)
        .single()

      if (error) {
        console.error('Erro na query do Supabase:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        })
        if (error.code === 'PGRST116') {
          console.log('Nenhum perfil público encontrado para o domínio:', subdomain)
          return null
        }
        throw error
      }

      if (!data) {
        console.log('Nenhum dado retornado para o domínio:', subdomain)
        return null
      }

      console.log('Perfil público encontrado:', data)

      const perfilPublicoData: PerfilPublico = {
        nome_completo: data.nome_completo,
        foto_url: data.foto_url,
        dominio: data.dominio,
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

      // Se estiver em uma rota pública, não carrega perfil
      if (window.location.pathname.startsWith('/public/')) {
        console.log('Rota pública, não carregando perfil')
        setIsLoading(false)
        return
      }

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

      // 2. Busca todos os perfis do usuário
      const { data: perfis, error: perfisError } = await supabase
        .from('perfis')
        .select('*')
        .eq('user_id', session.user.id)

      if (perfisError) {
        console.error('Erro ao buscar perfis:', perfisError)
        router.push('/auth/login')
        return
      }

      if (!perfis || perfis.length === 0) {
        console.log('Nenhum perfil encontrado')
        router.push('/auth/sem-acesso')
        return
      }

      // Para área ERP
      if (window.location.pathname.startsWith('/erp')) {
        const perfilERP = perfis.find(p => p.tipo === PERFIL_TIPOS.ERP)
        const perfilUser = perfis.find(p => p.tipo !== PERFIL_TIPOS.ERP)

        if (!perfilERP) {
          console.log('Usuário sem perfil ERP tentando acessar área ERP')
          router.push('/auth/sem-acesso')
          return
        }

        setPerfil(perfilERP)
        setPerfil_user(perfilUser || perfilERP)
        return
      }

      // Para área de revenda
      if (window.location.pathname.startsWith('/revendas')) {
        const perfilRevenda = perfis.find(p => p.tipo === PERFIL_TIPOS.REVENDA)

        if (!perfilRevenda) {
          console.log('Usuário sem perfil de revenda tentando acessar área de revenda')
          router.push('/auth/sem-acesso')
          return
        }

        setPerfil(perfilRevenda)
        setPerfil_user(perfilRevenda)
        return
      }

      // Para área master
      if (window.location.pathname.startsWith('/master')) {
        const perfilMaster = perfis.find(p => p.tipo === PERFIL_TIPOS.MASTER)

        if (!perfilMaster) {
          console.log('Usuário sem perfil master tentando acessar área master')
          router.push('/auth/sem-acesso')
          return
        }

        setPerfil(perfilMaster)
        setPerfil_user(perfilMaster)
        return
      }

      // Para outros casos, usa o perfil do subdomínio
      if (perfilPublicoData) {
        // Verifica se o usuário tem acesso ao perfil do subdomínio
        const userHasAccess = perfis.some(p => p.id === perfilPublicoData.id) || 
                            await checkUserAccess(session.user.id, perfilPublicoData.id);
        
        if (userHasAccess) {
          setPerfil(perfilPublicoData);
          setPerfil_user(perfis[0]);
        } else {
          console.error('Usuário não tem acesso ao perfil do subdomínio:', subdomain);
          router.push('/auth/sem-acesso');
        }
      } else {
        console.error('Nenhum perfil encontrado para o subdomínio:', subdomain);
        router.push('/auth/sem-acesso');
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

  const checkUserAccess = async (userId: string, perfilId: string) => {
    try {
      const { data, error } = await supabase
        .from('perfis_users')
        .select('*')
        .eq('user_id', userId)
        .eq('perfil_id', perfilId)
        .single();

      if (error) {
        console.error('Erro ao verificar acesso do usuário:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Erro ao verificar acesso do usuário:', error);
      return false;
    }
  };

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
