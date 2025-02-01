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

    const responseData = await response.text()
    console.log('Resposta do Asaas:', responseData)

    if (!response.ok) {
      throw new Error(responseData || `Erro ao criar subconta no Asaas: ${response.status}`)
    }

    try {
      const data = JSON.parse(responseData)
      console.log('Subconta criada com sucesso:', data)
      return data
    } catch (e) {
      console.error('Erro ao fazer parse da resposta:', e)
      throw new Error('Erro ao processar resposta do servidor')
    }
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
  const [debugData, setDebugData] = useState<any>(null)

  // Atualiza debugData sempre que o perfil mudar
  useEffect(() => {
    if (perfil) {
      const telefone = (perfil.celular || perfil.fone || '').replace(/[^0-9]/g, '')
      const cpfCnpj = (perfil.cpf_cnpj || '').replace(/[^0-9]/g, '')
      const email = perfil.email?.trim()
      const nome = perfil.nome_completo || ''

      const payload = {
        name: nome,
        email: email,
        loginEmail: email,
        cpfCnpj: cpfCnpj,
        companyType: cpfCnpj.length === 11 ? 'MEI' : 'LIMITED',
        mobilePhone: telefone,
        address: perfil.endereco_principal?.logradouro || 'Não informado',
        addressNumber: perfil.endereco_principal?.numero || 'S/N',
        province: perfil.endereco_principal?.bairro || 'Não informado',
        postalCode: perfil.endereco_principal?.cep?.replace(/[^0-9]/g, '') || '00000000',
        personType: cpfCnpj.length === 11 ? 'FISICA' : 'JURIDICA',
        incomeValue: perfil.faturamento || 0
      }

      setDebugData({
        perfil,
        payload,
        context: {
          NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
          NODE_ENV: process.env.NODE_ENV
        }
      })
    }
  }, [perfil])

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

      // Usar código da cidade de Juazeiro-BA como padrão
      const codigoCidade = 2918407 // Código IBGE de Juazeiro-BA

      // Preparar payload
      const payload = {
        name: perfil.nome_completo || '',
        email: perfil.email?.trim() || '',
        loginEmail: perfil.email?.trim() || '',
        cpfCnpj: (perfil.cpf_cnpj || '').replace(/[^0-9]/g, ''),
        companyType: (perfil.cpf_cnpj || '').length === 11 ? 'MEI' : 'LIMITED',
        mobilePhone: (perfil.celular || perfil.fone || '').replace(/[^0-9]/g, ''),
        address: enderecoPrincipal.logradouro || 'Não informado',
        addressNumber: enderecoPrincipal.numero || 'S/N',
        province: enderecoPrincipal.bairro || 'Não informado',
        postalCode: enderecoPrincipal.cep || 'Não informado',
        incomeValue: perfil.faturamento || 0
      }

      // 1. Criar subconta
      const response = await createAsaasSubconta(payload)

      // 2. Salvar dados da subconta
      const { error: updateError } = await supabase
        .from('asaas_contas')
        .insert({
          asaas_id: response.id,
          api_key: response.apiKey,
          wallet_id: response.walletId,
          perfis_id: perfil.id,
          account_number: response.accountNumber || {},
          income_value: 0,
          name: nome,
          email: email,
          login_email: email,
          mobile_phone: telefone,
          address: enderecoPrincipal.logradouro || 'Não informado',
          address_number: enderecoPrincipal.numero || 'S/N',
          province: enderecoPrincipal.bairro || 'Não informado',
          postal_code: enderecoPrincipal.cep || 'Não informado',
          city: codigoCidade,
          cpf_cnpj: cpfCnpj,
          person_type: cpfCnpj.length === 11 ? 'FISICA' : 'JURIDICA',
          company_type: cpfCnpj.length === 11 ? 'MEI' : 'LIMITED',
          country: 'BR',
          state: enderecoPrincipal.uf || 'BA'
        })

      if (updateError) {
        console.error('Erro ao salvar dados da subconta no Supabase:', updateError)
        throw updateError
      }

      toast.success('Subconta criada com sucesso!')
      router.push('/revendas')

    } catch (error: any) {
      console.error('Erro ao criar subconta:', error)
      toast.error(error.message || 'Erro ao criar subconta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mx-auto max-w-2xl mb-4">
        <CardHeader>
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

      {/* Card de Debug */}
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Debug Info</CardTitle>
          <CardDescription>
            Dados que serão enviados para a API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap bg-slate-100 p-4 rounded-md overflow-auto max-h-96">
            {JSON.stringify(debugData, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
