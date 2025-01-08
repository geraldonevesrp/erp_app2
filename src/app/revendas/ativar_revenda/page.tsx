'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AsaasClient } from "@/lib/asaas/api"
import type { AsaasCustomer } from "@/lib/asaas/api"

export default function AtivarRevendaPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [debug, setDebug] = useState<any>({})
  const [perfil, setPerfil] = useState<any>(null)
  const [asaasCliente, setAsaasCliente] = useState<any>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const asaasClient = new AsaasClient()

  useEffect(() => {
    let mounted = true

    const carregarPerfil = async () => {
      try {
        console.log('=== INICIANDO CARREGAMENTO DO PERFIL ===')
        setLoading(true)
        setError('')
        setDebug({ step: 'iniciando' })

        // Pega a sessão atual
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          console.log('Sessão não encontrada, redirecionando para login')
          setLoading(false)
          router.push('/auth/login')
          return
        }
        console.log('Sessão encontrada:', session.user.id)
        setDebug(prev => ({ ...prev, session: session.user.id }))

        // Busca o perfil atual (garantido pelo middleware)
        const { data: perfilData, error: perfilError } = await supabase
          .from('perfis')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        if (!mounted) return

        if (perfilError || !perfilData) {
          console.error('Erro ao buscar perfil:', perfilError)
          setError('Perfil não encontrado')
          setLoading(false)
          return
        }

        console.log('Perfil encontrado:', { id: perfilData.id, cpf_cnpj: perfilData.cpf_cnpj })
        setPerfil(perfilData)
        setDebug(prev => ({ ...prev, perfil: perfilData }))

        // Se não tem CPF/CNPJ, para aqui
        if (!perfilData.cpf_cnpj) {
          console.log('CPF/CNPJ não encontrado no perfil')
          setLoading(false)
          return
        }

        console.log('=== BUSCANDO CLIENTE NO ASAAS ===')
        console.log('Buscando com filtros:', { asaas_contas_id: 4, perfis_id: perfilData.id })
        
        // Primeiro verifica se já existe cliente
        const { data: clientesExistentes, error: searchError } = await supabase
          .from('asaas_clientes')
          .select('*')
          .eq('asaas_contas_id', 4)
          .eq('perfis_id', perfilData.id)
          .maybeSingle()

        if (searchError) {
          console.error('Erro ao buscar cliente:', searchError)
          setError('Erro ao buscar cliente: ' + searchError.message)
          setLoading(false)
          return
        }

        if (clientesExistentes) {
          console.log('Cliente já existe:', clientesExistentes)
          setAsaasCliente(clientesExistentes)
          setDebug(prev => ({ ...prev, clienteExistente: clientesExistentes }))
        } else {
          // Se chegou aqui, precisa criar o cliente
          console.log('Nenhum cliente encontrado, criando novo...')

          try {
            const customerData: AsaasCustomer = {
              name: perfilData.nome_completo || perfilData.apelido,
              email: perfilData.email,
              cpfCnpj: perfilData.cpf_cnpj,
              phone: perfilData.fone || '',
              mobilePhone: perfilData.celular || '',
              notificationDisabled: false,
              externalReference: perfilData.id
            }

            console.log('Dados para criação:', customerData)
            setDebug(prev => ({ ...prev, customerData }))

            const response = await asaasClient.createCustomer(customerData)
            console.log('Cliente criado no Asaas:', { id: response.id })
            
            // Salva o cliente no banco
            const { data: novoCliente, error: insertError } = await supabase
              .from('asaas_clientes')
              .insert({
                asaas_id: response.id,
                asaas_contas_id: 4,
                perfis_id: perfilData.id,
                object: response.object,
                name: response.name,
                email: response.email,
                company: response.company || '',
                phone: response.phone || '',
                mobilephone: response.mobilePhone || '',
                address: response.address || '',
                addressnumber: response.addressNumber || '',
                complement: response.complement,
                province: response.province || '',
                postalcode: response.postalCode || '',
                cpfcnpj: response.cpfCnpj,
                persontype: response.personType,
                deleted: response.deleted,
                additionalemails: response.additionalEmails,
                externalreference: response.externalReference,
                notificationdisabled: response.notificationDisabled,
                observations: response.observations,
                municipalinscription: response.municipalInscription,
                stateinscription: response.stateInscription,
                candelete: response.canDelete,
                cannotbedeletedreason: response.cannotBeDeletedReason,
                canedit: response.canEdit,
                cannoteditreason: response.cannotEditReason,
                city: response.city || '',
                cityname: response.cityName || '',
                state: response.state || '',
                country: response.country,
                datecreated: new Date(response.dateCreated)
              })
              .select()
              .single()

            if (insertError) {
              console.error('Erro ao salvar no banco:', insertError)
              setError('Erro ao salvar cliente no banco de dados: ' + insertError.message)
              setLoading(false)
              return
            }

            console.log('Cliente salvo com sucesso no banco:', novoCliente)
            setAsaasCliente(novoCliente)
            setDebug(prev => ({ ...prev, novoCliente }))
          } catch (error: any) {
            console.error('Erro ao criar/salvar cliente:', error)
            setError('Erro ao criar cliente no Asaas: ' + error.message)
            setLoading(false)
            return
          }
        }

        setLoading(false)
      } catch (error: any) {
        if (!mounted) return
        console.error('Erro geral:', error)
        setError(error.message || 'Erro ao carregar perfil. Por favor, tente novamente.')
        setLoading(false)
      }
    }

    carregarPerfil()

    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Ative sua Revenda</CardTitle>
            <CardDescription>
              Carregando...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Ative sua Revenda</CardTitle>
            <CardDescription className="text-destructive">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!perfil?.cpf_cnpj) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Complete seu Cadastro</CardTitle>
            <CardDescription>
              Para ativar sua revenda, primeiro complete seu cadastro com CPF/CNPJ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => router.push('/perfil')}
            >
              Completar Cadastro
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Ative sua Revenda</CardTitle>
          <CardDescription>
            Realize o pagamento da taxa de ativação para começar a usar sua revenda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dados do Cliente Asaas */}
          {asaasCliente && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="text-sm text-muted-foreground">Cliente Asaas:</p>
              <p><strong>Nome:</strong> {asaasCliente.name}</p>
              <p><strong>CPF/CNPJ:</strong> {asaasCliente.cpfcnpj}</p>
              <p><strong>ID Asaas:</strong> {asaasCliente.asaas_id}</p>
            </div>
          )}

          {/* Botão de Gerar Cobrança */}
          <Button 
            className="w-full" 
            size="lg"
          >
            Gerar Cobrança de R$ 30,00
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
