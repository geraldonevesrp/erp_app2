'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { AsaasClient } from '@/lib/asaas/api'
import { toast } from 'sonner'

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
  const [isLoading, setIsLoading] = useState(true)
  const [hasAsaasAccount, setHasAsaasAccount] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkAndSetupAsaasAccount() {
      try {
        setError(null)
        setProgress(10)
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }

        setProgress(20)
        // Busca o perfil do usuário com dados da conta Asaas
        const { data: perfil, error: perfilError } = await supabase
          .from('perfis')
          .select(`
            *,
            asaas_contas!inner(*),
            perfis_enderecos(*),
            revenda_status
          `)
          .eq('user_id', user.id)
          .single()

        // Se não estiver ativa, não continua
        if (perfil?.revenda_status !== 2) {
          setIsLoading(false)
          setHasAsaasAccount(false)
          return
        }

        if (perfilError) {
          console.error('Erro ao buscar perfil:', perfilError)
          // Se não encontrou, pode ser que precise criar
          if (perfilError.code === 'PGRST116') {
            setProgress(30)
            // Busca o perfil sem o join para ter os dados necessários
            const { data: perfilBase, error: perfilBaseError } = await supabase
              .from('perfis')
              .select(`
                *,
                perfis_enderecos(*)
              `)
              .eq('user_id', user.id)
              .maybeSingle()

            if (perfilBaseError) {
              throw new Error('Erro ao buscar dados do perfil')
            }

            if (!perfilBase) {
              throw new Error('Perfil não encontrado')
            }

            // Verificar se tem todos os dados necessários
            const requiredFields = [
              'nome_completo',
              'email',
              'celular',
              'cpf_cnpj',
              'nascimento', // Data de fundação (PJ) ou nascimento (PF)
              'faturamento' // Faturamento mensal
            ]

            const missingFields = requiredFields.filter(field => !perfilBase[field])
            if (missingFields.length > 0) {
              throw new Error(`Dados incompletos no perfil. Campos faltantes: ${missingFields.join(', ')}`)
            }

            // Verificar se tem endereço
            if (!perfilBase.perfis_enderecos?.[0]) {
              throw new Error('Endereço não cadastrado. Por favor, cadastre um endereço antes de continuar.')
            }

            const endereco = perfilBase.perfis_enderecos[0]
            const requiredAddressFields = [
              'logradouro',
              'numero',
              'bairro',
              'localidade',
              'uf',
              'cep'
            ]

            const missingAddressFields = requiredAddressFields.filter(field => !endereco[field])
            if (missingAddressFields.length > 0) {
              throw new Error(`Dados de endereço incompletos. Campos faltantes: ${missingAddressFields.join(', ')}`)
            }

            setProgress(35)
            // Criar registro do webhook key
            const { data: webhookKey, error: webhookKeyError } = await supabase
              .from('perfis_asaas_webhook_key')
              .insert({
                perfis_id: perfilBase.id
              })
              .select('id')
              .single()

            if (webhookKeyError) {
              throw new Error('Erro ao gerar chave do webhook')
            }

            setProgress(40)
            // Criar nova subconta Asaas
            const asaasClient = new AsaasClient()
            
            // Preparar dados para a subconta
            const subcontaData = {
              name: perfilBase.nome_completo,
              email: perfilBase.email,
              loginEmail: perfilBase.email,
              mobilePhone: perfilBase.celular || perfilBase.fone,
              cpfCnpj: perfilBase.cpf_cnpj,
              birthDate: perfilBase.nascimento, // Data de fundação (PJ) ou nascimento (PF)
              personType: 'JURIDICA', // Todas as revendas são pessoa jurídica
              companyType: 'LTDA' as CompanyType, // Por padrão LTDA, pode ser ajustado depois
              incomeValue: perfilBase.faturamento, // Faturamento mensal
              phone: perfilBase.fone,
              // Dados de endereço obrigatórios
              address: endereco.logradouro,
              addressNumber: endereco.numero,
              complement: endereco.complemento || undefined,
              province: endereco.bairro,
              postalCode: endereco.cep,
              city: endereco.localidade,
              state: endereco.uf,
              // Configuração do webhook
              webhook: {
                url: WEBHOOK_CONFIG.url,
                email: WEBHOOK_CONFIG.email,
                apiVersion: 3,
                enabled: true,
                interrupted: false,
                events: WEBHOOK_CONFIG.events,
                // Adiciona o token no header
                authorization: webhookKey.id
              }
            }

            setProgress(60)
            
            try {
              // Criar subconta no Asaas
              const asaasResponse = await asaasClient.createSubconta(subcontaData)

              setProgress(80)
              // Registrar subconta no Supabase
              const { error: insertError } = await supabase
                .from('asaas_contas')
                .insert({
                  asaas_id: asaasResponse.id,
                  object: 'account',
                  name: subcontaData.name,
                  email: subcontaData.email,
                  login_email: subcontaData.loginEmail,
                  phone: subcontaData.phone,
                  mobile_phone: subcontaData.mobilePhone,
                  cpf_cnpj: subcontaData.cpfCnpj,
                  birth_date: subcontaData.birthDate,
                  person_type: subcontaData.personType,
                  company_type: subcontaData.companyType,
                  income_value: subcontaData.incomeValue,
                  address: subcontaData.address,
                  address_number: subcontaData.addressNumber,
                  complement: subcontaData.complement,
                  province: subcontaData.province,
                  postal_code: subcontaData.postalCode,
                  city: subcontaData.city,
                  state: subcontaData.state,
                  wallet_id: asaasResponse.walletId,
                  api_key: asaasResponse.apiKey,
                  account_number: asaasResponse.accountNumber || {},
                  perfis_id: perfilBase.id,
                })

              if (insertError) {
                throw new Error('Erro ao registrar subconta no banco de dados')
              }

              setProgress(100)
              setHasAsaasAccount(true)
              return
            } catch (asaasError: any) {
              // Se der erro, remove o webhook key
              await supabase
                .from('perfis_asaas_webhook_key')
                .delete()
                .eq('id', webhookKey.id)
              
              throw new Error(asaasError.message || 'Erro ao criar subconta no Asaas')
            }
          }
          throw new Error('Erro ao buscar dados da conta Asaas')
        }

        // Se chegou aqui, tem conta Asaas
        setProgress(100)
        setHasAsaasAccount(true)

      } catch (error: any) {
        console.error('Erro ao verificar/configurar conta Asaas:', error)
        setHasAsaasAccount(false)
        setProgress(0)
        setError(error.message || 'Erro ao configurar conta Asaas')
        toast.error('Erro ao configurar conta', {
          description: error.message || 'Tente novamente mais tarde'
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkAndSetupAsaasAccount()
  }, [supabase, router])

  return { isLoading, hasAsaasAccount, progress, error }
}
