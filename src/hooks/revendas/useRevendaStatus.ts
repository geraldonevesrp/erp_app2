'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function useRevendaStatus() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    async function checkRevendaStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }

        // Busca o perfil do usuário
        const { data: perfil, error: perfilError } = await supabase
          .from('perfis')
          .select(`
            revenda_status,
            asaas_contas(*)
          `)
          .eq('user_id', user.id)
          .single()

        if (perfilError) {
          console.error('Erro ao buscar perfil:', perfilError)
          throw perfilError
        }

        // Status 2 = Revenda Ativa
        setIsActive(perfil?.revenda_status === 2)
        
      } catch (error) {
        console.error('Erro ao verificar status da revenda:', error)
        setIsActive(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkRevendaStatus()
  }, [supabase, router])

  return { isLoading, isActive }
}
