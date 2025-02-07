'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRevendaPerfil } from '@/contexts/revendas/perfil'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'
import { toast } from 'sonner'

// Função para criar subconta no Asaas
async function createAsaasSubconta(payload: any) {
  try {
    console.log('Criando subconta no Asaas...')
    console.log('Payload:', payload)
    
    const response = await fetch('/api/asaas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: '/accounts',
        data: payload
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro ao criar subconta:', errorText)
      throw new Error(errorText)
    }

    const data = await response.json()
    console.log('Resposta da criação:', data)

    return data
  } catch (error: any) {
    console.error('Erro detalhado ao criar subconta:', error)
    throw error
  }
}

export default function CriarSubcontaAsaasPage() {
  const { perfil } = useRevendaPerfil()
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [isLoading, setIsLoading] = useState(false)

  const handleCriarSubconta = async () => {
    if (!perfil) return
    
    try {
      setIsLoading(true)

      // Limpar e validar os dados
      const telefone = (perfil.celular || perfil.fone || '').replace(/[^0-9]/g, '')
      const cpfCnpj = (perfil.cpf_cnpj || '').replace(/[^0-9]/g, '')
      const email = perfil.email?.trim()
      const nome = perfil.nome_completo || ''

      // Validar dados obrigatórios
      if (!nome || !email || !telefone || !cpfCnpj) {
        toast.error('Preencha todos os dados do perfil antes de criar a subconta')
        router.push('/revendas/configuracoes/perfil')
        return
      }

      // Buscar endereço principal
      const { data: enderecoPrincipal, error: enderecoError } = await supabase
        .from('perfis_enderecos')
        .select('logradouro, numero, bairro, cep, localidade, ibge, uf')
        .eq('perfis_id', perfil.id)
        .eq('principal', true)
        .single()

      if (enderecoError) {
        console.error('Erro ao buscar endereço principal:', enderecoError)
        toast.error('Erro ao buscar endereço principal')
        return
      }

      // Tentar criar a subconta
      try {
        console.log('Tentando criar subconta no Asaas...')
        const response = await fetch('/api/asaas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: '/accounts',
            data: {
              name: nome,
              email: email,
              loginEmail: email,
              cpfCnpj: cpfCnpj,
              companyType: cpfCnpj.length === 11 ? 'MEI' : 'LIMITED',
              phone: telefone,
              mobilePhone: telefone,
              address: enderecoPrincipal.logradouro || 'Não informado',
              addressNumber: enderecoPrincipal.numero || 'S/N',
              complement: null,
              province: enderecoPrincipal.bairro || 'Não informado',
              postalCode: enderecoPrincipal.cep || 'Não informado',
              city: 2918407, // Código IBGE de Juazeiro-BA
              state: enderecoPrincipal.uf || 'BA',
              country: 'BR',
              personType: cpfCnpj.length === 11 ? 'FISICA' : 'JURIDICA',
              incomeValue: perfil.faturamento || 5000,
              object: 'account'
            }
          })
        })

        const responseText = await response.text()
        console.log('Resposta do Asaas:', responseText)
        console.log('Resposta do Asaas (raw):', response.status, response.statusText)

        let data
        try {
          data = JSON.parse(responseText)
          console.log('Data após parse:', data)
          console.log('Data success:', data.success)
          console.log('Data apiKey:', data.data?.apiKey)
          console.log('Data walletId:', data.data?.walletId)
        } catch (e) {
          console.error('Erro ao fazer parse da resposta:', e)
          throw new Error('Erro ao processar resposta do servidor')
        }

        // Se der erro de email já existente, vamos buscar a subconta existente
        if (!response.ok && data?.errors?.[0]?.description?.includes('já está em uso')) {
          console.log('Email já está em uso, buscando subconta existente...')
          
          // Buscar a subconta existente
          const listResponse = await fetch('/api/asaas', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              endpoint: '/accounts',
              method: 'GET'
            })
          })

          if (!listResponse.ok) {
            throw new Error('Erro ao buscar subconta existente')
          }

          const listData = await listResponse.json()
          console.log('Lista de subcontas:', listData)

          // Encontrar a subconta com o email
          const subcontaExistente = listData.data?.find((conta: any) => 
            conta.loginEmail?.toLowerCase() === email?.toLowerCase()
          )

          if (!subcontaExistente) {
            throw new Error('Subconta não encontrada')
          }

          data = subcontaExistente
          console.log('Subconta encontrada:', data)

          // Verificar se já existe registro no banco
          const { data: existingConta } = await supabase
            .from('asaas_contas')
            .select()
            .eq('asaas_id', data.id)
            .single()

          if (existingConta) {
            console.log('Conta já existe no banco, pulando criação')
            data = {
              ...data,
              apiKey: existingConta.api_key,
              walletId: existingConta.wallet_id
            }
          }
        } else if (!response.ok) {
          // Se for outro tipo de erro, lança o erro
          throw new Error(responseText)
        }

        // Verificar se já existe um webhook key para este perfil
        const { data: existingWebhookKey, error: existingWebhookError } = await supabase
          .from('perfis_asaas_webhook_key')
          .select()
          .eq('perfis_id', perfil.id)
          .single()

        let webhookKey
        if (existingWebhookError && existingWebhookError.code === 'PGRST116') {
          // Se não existir, criar um novo
          const { data: newWebhookKey, error: webhookError } = await supabase
            .from('perfis_asaas_webhook_key')
            .insert({
              perfis_id: perfil.id
            })
            .select()
            .single()

          if (webhookError) {
            console.error('Erro ao criar webhook key:', webhookError)
            throw webhookError
          }
          webhookKey = newWebhookKey
        } else if (existingWebhookError) {
          console.error('Erro ao buscar webhook key:', existingWebhookError)
          throw existingWebhookError
        } else {
          webhookKey = existingWebhookKey
        }

        // Configurar o webhook no Asaas
        console.log('Configurando webhook no Asaas...')
        const webhookResponse = await fetch('/api/asaas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: '/webhook',
            data: {
              url: 'https://fwmxtjrxilkrirvrxlxb.supabase.co/functions/v1/asaas_webhook',
              email: 'geraldons@hotmail.com',
              interrupted: false,
              enabled: true,
              apiVersion: 3,
              authToken: webhookKey.id,
              type: 'SCHEDULED',
              events: ['PAYMENT_CREATED', 'PAYMENT_RECEIVED']
            }
          })
        })

        if (!webhookResponse.ok) {
          const webhookError = await webhookResponse.text()
          console.error('Erro ao configurar webhook:', webhookError)
          throw new Error('Erro ao configurar webhook no Asaas')
        }

        // Salvar dados da subconta no Supabase
        console.log('Dados para salvar no Supabase:', {
          asaas_id: data.data.id,
          api_key: data.data.apiKey,
          wallet_id: data.data.walletId,
          perfis_id: perfil.id,
          account_number: data.data.accountNumber || {},
          income_value: perfil.faturamento || 0,
          name: nome,
          email: email,
          login_email: email,
          mobile_phone: telefone,
          address: enderecoPrincipal.logradouro || 'Não informado',
          address_number: enderecoPrincipal.numero || 'S/N',
          province: enderecoPrincipal.bairro || 'Não informado',
          postal_code: enderecoPrincipal.cep || 'Não informado',
          city: 2918407, // Código IBGE de Juazeiro-BA
          cpf_cnpj: cpfCnpj,
          person_type: cpfCnpj.length === 11 ? 'FISICA' : 'JURIDICA',
          company_type: cpfCnpj.length === 11 ? 'MEI' : 'LIMITED',
          country: 'BR',
          state: enderecoPrincipal.uf || 'BA',
          object: 'account'
        })
        
        const { error: updateError } = await supabase
          .from('asaas_contas')
          .insert({
            asaas_id: data.data.id,
            api_key: data.data.apiKey,
            wallet_id: data.data.walletId,
            perfis_id: perfil.id,
            account_number: data.data.accountNumber || {},
            income_value: perfil.faturamento || 0,
            name: nome,
            email: email,
            login_email: email,
            mobile_phone: telefone,
            address: enderecoPrincipal.logradouro || 'Não informado',
            address_number: enderecoPrincipal.numero || 'S/N',
            province: enderecoPrincipal.bairro || 'Não informado',
            postal_code: enderecoPrincipal.cep || 'Não informado',
            city: 2918407, // Código IBGE de Juazeiro-BA
            cpf_cnpj: cpfCnpj,
            person_type: cpfCnpj.length === 11 ? 'FISICA' : 'JURIDICA',
            company_type: cpfCnpj.length === 11 ? 'MEI' : 'LIMITED',
            country: 'BR',
            state: enderecoPrincipal.uf || 'BA',
            object: 'account'
          })

        if (updateError) {
          console.error('Erro ao salvar dados da subconta no Supabase:', updateError)
          throw updateError
        }

        toast.success('Subconta configurada com sucesso!')
        router.push('/revendas')

      } catch (error: any) {
        console.error('Erro ao configurar subconta:', error)
        toast.error(error.message || 'Erro ao configurar subconta')
      }

    } catch (error: any) {
      console.error('Erro geral:', error)
      toast.error(error.message || 'Erro ao processar a solicitação')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-screen-lg mx-auto py-8">
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Criar Subconta Asaas</CardTitle>
            <CardDescription>
              Configure sua subconta Asaas para começar a receber pagamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={handleCriarSubconta}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando Subconta...
                </>
              ) : (
                'Criar Subconta'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
