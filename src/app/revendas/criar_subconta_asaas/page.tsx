'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'
import { useToast } from '@/components/ui/use-toast'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { AsaasClient } from '@/lib/asaas/api'
import { usePerfil } from '@/contexts/perfil'
import { useSupabase } from '@/contexts/supabase'
import { PERFIL_TIPOS } from '@/types/perfil'
import { Button } from '@/components/ui/button'

export default function CriarSubcontaAsaasPage() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const { perfil, perfil_user } = usePerfil()

  const [loadingMessage, setLoadingMessage] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [statusConexao, setStatusConexao] = useState<'testando' | 'ok' | 'erro'>('testando')
  const [mensagemConexao, setMensagemConexao] = useState<string>('Testando conexão com Asaas...')

  useEffect(() => {
    async function testarConexaoAsaas() {
      try {
        setStatusConexao('testando')
        setMensagemConexao('Testando conexão com Asaas...')
        console.log('=== INÍCIO DO TESTE DE CONEXÃO ===')
        
        const asaas = new AsaasClient()
        console.log('Cliente Asaas criado')
        
        const resultado = await asaas.testConnection()
        console.log('Teste de conexão realizado:', resultado)
        
        setStatusConexao('ok')
        setMensagemConexao('Conexão com Asaas estabelecida com sucesso!')
        console.log('=== FIM DO TESTE DE CONEXÃO - SUCESSO ===')
      } catch (error: any) {
        console.error('=== ERRO NO TESTE DE CONEXÃO ===')
        console.error('Detalhes do erro:', {
          message: error?.message,
          cause: error?.cause,
          stack: error?.stack,
          name: error?.name
        })
        
        setStatusConexao('erro')
        setMensagemConexao(error?.message || 'Erro desconhecido ao conectar com Asaas')
      }
    }

    testarConexaoAsaas()
  }, [])

  const criarSubconta = async () => {
    try {
      setLoadingMessage('Iniciando criação da subconta...')
      setError(null)

      if (!perfil) {
        console.log('Perfil não encontrado, redirecionando para login...')
        router.push('/auth/login')
        return
      }

      // Garantir que o usuário tem um perfil válido
      if (!perfil.tipo || perfil.tipo !== PERFIL_TIPOS.REVENDA) {
        console.log('Usuário não é revenda, redirecionando...', {
          tipo: perfil.tipo,
          esperado: PERFIL_TIPOS.REVENDA
        })
        router.push('/auth/sem-acesso')
        return
      }

      console.log('Dados do perfil:', JSON.stringify(perfil, null, 2))

      // Limpar e validar os dados
      const telefone = (perfil.celular || perfil.fone || '').replace(/[^0-9]/g, '')
      const cpfCnpj = (perfil.cpf_cnpj || '').replace(/[^0-9]/g, '')
      const email = perfil.email?.trim()
      const nome = perfil.nome || perfil.apelido || ''

      // Validar dados obrigatórios com mais detalhes
      const validacoes = {
        'Nome': {
          valor: nome,
          valido: nome.length >= 3,
          mensagem: 'Nome deve ter pelo menos 3 caracteres'
        },
        'E-mail': {
          valor: email,
          valido: email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
          mensagem: 'E-mail inválido'
        },
        'Telefone': {
          valor: telefone,
          valido: telefone.length >= 10,
          mensagem: 'Telefone deve ter pelo menos 10 dígitos'
        },
        'CPF/CNPJ': {
          valor: cpfCnpj,
          valido: cpfCnpj.length === 11 || cpfCnpj.length === 14,
          mensagem: 'CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos'
        }
      }

      console.log('Validações:', JSON.stringify(validacoes, null, 2))

      const camposInvalidos = Object.entries(validacoes)
        .filter(([_, { valido }]) => !valido)
        .map(([campo, { valor, mensagem }]) => `${campo} (${valor || 'vazio'}): ${mensagem}`)

      if (camposInvalidos.length > 0) {
        throw new Error(`Os seguintes campos são inválidos:\n${camposInvalidos.join('\n')}`)
      }

      setLoadingMessage('Criando subconta no Asaas...')

      const asaas = new AsaasClient()
      const response = await asaas.createSubconta({
        name: nome,
        email: email!,
        loginEmail: email!,
        cpfCnpj: cpfCnpj,
        companyType: cpfCnpj.length === 11 ? 'MEI' : 'LIMITED',
        mobilePhone: telefone,
        address: 'Não informado',
        addressNumber: 'S/N',
        province: 'Não informado',
        postalCode: '00000000',
        personType: cpfCnpj.length === 11 ? 'FISICA' : 'JURIDICA'
      })

      console.log('Subconta criada:', response)

      // Atualizar o perfil com os dados da subconta
      const { error: updateError } = await supabase
        .from('perfis')
        .update({
          asaas_account_key: response.apiKey,
          asaas_wallet_id: response.walletId,
          asaas_account_id: response.id
        })
        .eq('id', perfil.id)

      if (updateError) {
        throw new Error(`Erro ao atualizar perfil: ${updateError.message}`)
      }

      setSuccess(true)
      setLoadingMessage('')
      toast({
        title: 'Sucesso!',
        description: 'Subconta criada com sucesso no Asaas.',
      })

    } catch (error: any) {
      console.error('Erro ao criar subconta:', error)
      setError(error.message)
      setLoadingMessage('')
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message,
      })
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Criar Subconta Asaas</h1>

      {/* Card de Status da Conexão */}
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          {statusConexao === 'testando' && <Loader2 className="h-4 w-4 animate-spin" />}
          {statusConexao === 'ok' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
          {statusConexao === 'erro' && <AlertCircle className="h-4 w-4 text-red-500" />}
          <span className={statusConexao === 'erro' ? 'text-red-500' : ''}>
            {mensagemConexao}
          </span>
        </div>
      </Card>

      {/* Botão de Criar Subconta */}
      <Card className="p-4">
        <div className="space-y-4">
          <Button 
            onClick={criarSubconta}
            disabled={loadingMessage !== '' || statusConexao !== 'ok'}
            className="w-full"
          >
            {loadingMessage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {loadingMessage}
              </>
            ) : (
              'Criar Subconta'
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Subconta criada com sucesso! Você já pode começar a usar os serviços do Asaas.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Card>
    </div>
  )
}
