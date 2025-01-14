"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/contexts/supabase'
import { createAsaasSubconta } from '@/lib/asaas/subconta'

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

        // Verifica se já existe uma conta Asaas para este perfil
        const { data: asaasConta, error: asaasError } = await supabase
          .from('asaas_contas')
          .select('*')
          .eq('perfis_id', perfil.id)
          .single()

        if (asaasError && asaasError.code !== 'PGRST116') { // Ignora erro de "não encontrado"
          console.error('Erro ao buscar conta Asaas:', asaasError)
          throw asaasError
        }

        // Se não existe conta Asaas, verifica se temos os dados necessários
        if (!asaasConta) {
          console.log('Verificando dados para criação de conta Asaas')
          
          const { data: pessoa, error: pessoaError } = await supabase
            .from('pessoas')
            .select('*')
            .eq('perfil_id', perfil.id)
            .maybeSingle() // Usa maybeSingle em vez de single para não gerar erro

          if (pessoaError) {
            console.error('Erro ao buscar dados da pessoa:', pessoaError)
            // Não lança o erro, apenas loga
          }

          // Se tiver dados da pessoa, tenta criar a conta Asaas
          if (pessoa) {
            try {
              console.log('Criando subconta Asaas para a revenda')
              // Cria subconta no Asaas
              const asaasResponse = await createAsaasSubconta({
                name: pessoa.nome,
                email: pessoa.email,
                loginEmail: pessoa.email,
                mobilePhone: pessoa.telefone,
                address: pessoa.endereco,
                addressNumber: pessoa.numero,
                province: pessoa.bairro,
                postalCode: pessoa.cep,
                cpfCnpj: pessoa.cpf_cnpj,
                personType: pessoa.tipo_pessoa === 'PF' ? 'FISICA' : 'JURIDICA',
                city: pessoa.cidade_id,
                state: pessoa.estado
              })

              // Cria registro na tabela asaas_contas
              const { error: insertError } = await supabase
                .from('asaas_contas')
                .insert({
                  asaas_id: asaasResponse.id,
                  name: pessoa.nome,
                  email: pessoa.email,
                  login_email: pessoa.email,
                  mobile_phone: pessoa.telefone,
                  address: pessoa.endereco,
                  address_number: pessoa.numero,
                  province: pessoa.bairro,
                  postal_code: pessoa.cep,
                  cpf_cnpj: pessoa.cpf_cnpj,
                  person_type: pessoa.tipo_pessoa === 'PF' ? 'FISICA' : 'JURIDICA',
                  city: pessoa.cidade_id,
                  state: pessoa.estado,
                  country: 'BR',
                  api_key: asaasResponse.apiKey,
                  account_number: asaasResponse.accountNumber,
                  income_value: 0,
                  perfis_id: perfil.id
                })

              if (insertError) {
                console.error('Erro ao inserir conta Asaas:', insertError)
                // Não lança o erro, apenas loga
              }
            } catch (error) {
              console.error('Erro ao criar subconta Asaas:', error)
              // Não bloqueia o acesso em caso de erro na criação da subconta
            }
          } else {
            console.log('Dados da pessoa não encontrados, continuando sem criar subconta Asaas')
          }
        }

        setIsActive(true)
      } catch (error: any) {
        console.error('Erro ao verificar status da revenda:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          stack: error.stack
        })
        router.push('/auth/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkRevendaStatus()
  }, [supabase, router])

  return { isLoading, isActive }
}
