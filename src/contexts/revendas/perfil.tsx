'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

type RevendaPerfil = {
  id: string
  user_id: string | null
  nome_completo: string | null
  email: string | null
  revenda_status: number | null
  cpf_cnpj: string | null
  fone: string | null
  celular: string | null
  apelido: string | null
  dominio: string | null
  faturamento: number | null
  foto_url: string | null
  nascimento: string | null
  revenda_id: string | null
  tipo: number | null
  wathsapp: string | null
  endereco_principal?: {
    logradouro?: string
    numero?: string
    complemento?: string
    bairro?: string
    cep?: string
    localidade?: string
    uf?: string
  }
}

type RevendaPerfilContextType = {
  perfil: RevendaPerfil | null
  isLoading: boolean
  error: Error | null
  refreshPerfil: () => Promise<void>
}

const RevendaPerfilContext = createContext<RevendaPerfilContextType>({
  perfil: null,
  isLoading: true,
  error: null,
  refreshPerfil: async () => {},
})

export function RevendaPerfilProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [perfil, setPerfil] = useState<RevendaPerfil | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const loadPerfil = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Na página de inscrição, não mostra erros de autenticação
      const isInscricaoPage = typeof window !== 'undefined' && window.location.pathname.includes('/public/inscricao-revenda')
      
      // Verifica autenticação
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      // Se houver erro de autenticação
      if (authError) {
        // Na página de inscrição, ignora o erro
        if (isInscricaoPage) {
          setIsLoading(false)
          return
        }
        // Em outras páginas, lança o erro
        throw authError
      }

      // Se não houver usuário
      if (!user) {
        // Na página de inscrição, apenas retorna
        if (isInscricaoPage) {
          setIsLoading(false)
          return
        }
        // Em outras páginas, redireciona para login
        router.push('/auth/login')
        return
      }

      // Se chegou aqui, temos um usuário autenticado
      // Busca perfil independente da página
      // Busca perfil
      const { data: perfilData, error: perfilError } = await supabase
        .from('perfis')
        .select(`
          id,
          user_id,
          nome_completo,
          email,
          revenda_status,
          cpf_cnpj,
          fone,
          celular,
          apelido,
          dominio,
          faturamento,
          foto_url,
          nascimento,
          revenda_id,
          tipo,
          wathsapp
        `)
        .eq('user_id', user.id)
        .single()

      if (perfilError) {
        console.error('Erro ao buscar perfil:', perfilError)
        throw new Error(perfilError.message)
      }

      if (!perfilData) {
        throw new Error('Perfil não encontrado')
      }

      // Busca endereço principal
      const { data: enderecoData } = await supabase
        .from('perfis_enderecos')
        .select(`
          logradouro,
          numero,
          complemento,
          bairro,
          cep,
          localidade,
          uf
        `)
        .eq('perfis_id', perfilData.id)
        .eq('principal', true)
        .single()

      setPerfil({
        ...perfilData,
        endereco_principal: enderecoData || undefined
      })
    } catch (err: any) {
      console.error('Erro ao carregar perfil:', err)
      setError(new Error(err.message || 'Erro ao carregar perfil'))
    } finally {
      setIsLoading(false)
    }
  }

  // Carrega o perfil ao montar o componente
  useEffect(() => {
    loadPerfil()
  }, [])

  const value = {
    perfil,
    isLoading,
    error,
    refreshPerfil: loadPerfil
  }

  return (
    <RevendaPerfilContext.Provider value={value}>
      {children}
    </RevendaPerfilContext.Provider>
  )
}

export const useRevendaPerfil = () => {
  const context = useContext(RevendaPerfilContext)
  if (!context) {
    throw new Error('useRevendaPerfil deve ser usado dentro de um RevendaPerfilProvider')
  }
  return context
}
