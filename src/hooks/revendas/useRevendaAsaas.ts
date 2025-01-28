'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { asaasClient } from '@/lib/asaas/client'
import { toast } from 'sonner'
import { useRevendaPerfil } from '@/contexts/revendas/perfil'

// Tipos de empresa aceitos pelo Asaas
type CompanyType = 'MEI' | 'ME' | 'EIRELI' | 'LTDA' | 'SA' | 'OTHERS'

// Configuração do webhook
const WEBHOOK_CONFIG = {
  url: 'https://fwmxtjrxilkrirvrxlxb.supabase.co/functions/v1/asaas_webhook',
  email: 'geraldons@hotmail.com',
  events: ['PAYMENT_RECEIVED', 'PAYMENT_CREATED'] as const
}

export function useRevendaAsaas() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const pathname = usePathname()
  const { perfil, isLoading: isPerfilLoading } = useRevendaPerfil()
  const [isLoading, setIsLoading] = useState(true)
  const [hasAsaasAccount, setHasAsaasAccount] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function checkAsaasAccount() {
      try {
        if (!perfil?.id) {
          console.log('=== DEBUG useRevendaAsaas ===: Sem perfil')
          setHasAsaasAccount(false)
          setIsLoading(false)
          return
        }

        // Busca se tem conta Asaas vinculada
        const { data, error } = await supabase
          .from('asaas_contas')
          .select('id')
          .eq('perfis_id', perfil.id)
          .maybeSingle()

        if (error) {
          console.log('=== DEBUG useRevendaAsaas ===: Erro na consulta', error.message)
          throw error
        }

        const hasAccount = !!data
        console.log('=== DEBUG useRevendaAsaas ===: Resultado', {
          perfilId: perfil.id,
          hasAccount
        })

        if (isMounted) {
          setHasAsaasAccount(hasAccount)
          setIsLoading(false)

          // Se não tem conta e não está na página de criar conta, redireciona
          if (!hasAccount && pathname !== '/revendas/criar_subconta_asaas') {
            console.log('=== DEBUG useRevendaAsaas ===: Redirecionando para criar subconta')
            router.push('/revendas/criar_subconta_asaas')
          }
        }

      } catch (err) {
        console.log('=== DEBUG useRevendaAsaas ===: Erro', err)
        if (isMounted) {
          setHasAsaasAccount(false)
          setIsLoading(false)
        }
      }
    }

    checkAsaasAccount()

    return () => {
      isMounted = false
    }
  }, [perfil?.id, pathname])

  return { isLoading: isLoading || isPerfilLoading, hasAsaasAccount, progress, error }
}
