"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/contexts/supabase'

export function useRevendaStatus() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    async function checkRevendaStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          console.log('Usuário não encontrado')
          router.push('/auth/login')
          return
        }

        // Busca o perfil do usuário
        const { data: perfil, error: perfilError } = await supabase
          .from('perfis')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (perfilError) {
          console.error('Erro ao buscar perfil:', perfilError)
          throw perfilError
        }

        if (!perfil) {
          console.log('Perfil não encontrado')
          router.push('/auth/login')
          return
        }

        // Se o status não for 2 (ativo), redireciona para ativação
        if (perfil.revenda_status !== 2) {
          console.log('Revenda não está ativa, redirecionando para ativação')
          router.push('/revendas/ativar_revenda')
          return
        }

        // Verifica se já existe uma conta Asaas
        const { data: asaasConta } = await supabase
          .from('asaas_contas')
          .select('*')
          .eq('perfis_id', perfil.id)
          .maybeSingle()

        // Se não existe conta Asaas, redireciona para criação
        if (!asaasConta && !window.location.pathname.includes('/revendas/criar_subconta_asaas')) {
          console.log('Conta Asaas não encontrada, redirecionando para criação')
          router.push('/revendas/criar_subconta_asaas')
          return
        }

        setIsActive(true)
      } catch (error) {
        console.error('Erro ao verificar status da revenda:', error)
        router.push('/auth/sem-acesso')
      } finally {
        setIsLoading(false)
      }
    }

    checkRevendaStatus()
  }, [supabase, router])

  return { isLoading, isActive }
}
