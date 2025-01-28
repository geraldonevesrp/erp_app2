'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function useRevendaStatus() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isActive, setIsActive] = useState(false)
  const [status, setStatus] = useState<number | null>(null)

  useEffect(() => {
    async function checkRevendaStatus() {
      try {
        console.log('=== DEBUG STATUS REVENDA ===: Verificando status')

        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          console.log('=== DEBUG STATUS REVENDA ===: Usuário não autenticado')
          setIsLoading(false)
          setIsActive(false)
          setStatus(null)
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
          console.error('=== DEBUG STATUS REVENDA ===: Erro ao buscar perfil', perfilError)
          throw perfilError
        }

        console.log('=== DEBUG STATUS REVENDA ===: Status encontrado', {
          status: perfil?.revenda_status,
          isActive: perfil?.revenda_status === 2
        })

        // Atualiza o status
        setStatus(perfil?.revenda_status || null)
        
        // Status 2 = Revenda Ativa
        setIsActive(perfil?.revenda_status === 2)
        
      } catch (error) {
        console.error('=== DEBUG STATUS REVENDA ===: Erro', error)
        setIsActive(false)
        setStatus(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkRevendaStatus()
  }, [])

  return { isLoading, isActive, status }
}
