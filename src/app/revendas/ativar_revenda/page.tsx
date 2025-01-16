/**
 * Página de Ativação de Revenda
 * 
 * Esta página gerencia o processo de ativação de uma revenda, incluindo:
 * 1. Verificação/criação de cliente no Asaas
 * 2. Geração de cobrança PIX
 * 3. Armazenamento local dos dados
 * 
 * @requires createClientComponentClient - Cliente Supabase
 * @requires useRevendaPerfil - Hook de contexto do perfil de revenda
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CircleDollarSign, Loader2, QrCode, ExternalLink, Check, Info, Copy, CopyCheck } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useRevendaPerfil } from '@/contexts/revendas/perfil'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

// Funções de API
async function createAsaasCustomer(customerData: any) {
  try {
    console.log('Criando cliente no Asaas...')
    const response = await fetch('/api/asaas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: '/customers',
        data: {
          name: customerData.name,
          cpfCnpj: customerData.cpfCnpj,
          email: customerData.email,
          phone: customerData.phone,
          mobilePhone: customerData.mobilePhone,
          address: customerData.address,
          addressNumber: customerData.addressNumber,
          complement: customerData.complement,
          province: customerData.province,
          postalCode: customerData.postalCode,
          externalReference: customerData.externalReference,
          notificationDisabled: false,
          additionalEmails: customerData.additionalEmails,
          municipalInscription: customerData.municipalInscription,
          stateInscription: customerData.stateInscription,
          observations: customerData.observations
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Erro ao criar cliente:', errorData)
      throw new Error(errorData.error || `Erro ao criar cliente no Asaas: ${response.status}`)
    }

    const data = await response.json()
    console.log('Cliente criado com sucesso:', data)
    return data
  } catch (error: any) {
    console.error('Erro detalhado ao criar cliente:', error)
    throw error
  }
}

async function createAsaasCharge(chargeData: any) {
  try {
    console.log('Criando cobrança no Asaas...')
    const response = await fetch('/api/asaas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: '/payments',
        data: {
          customer: chargeData.customer,
          billingType: chargeData.billingType,
          value: chargeData.value,
          dueDate: chargeData.dueDate,
          description: chargeData.description,
          externalReference: chargeData.externalReference,
          postalService: false
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Erro ao criar cobrança:', errorData)
      throw new Error(errorData.error || `Erro ao criar cobrança no Asaas: ${response.status}`)
    }

    const data = await response.json()
    console.log('Cobrança criada com sucesso:', data)
    return data
  } catch (error: any) {
    console.error('Erro detalhado ao criar cobrança:', error)
    throw error
  }
}

export default function AtivarRevenda() {
  // Clientes e hooks
  const supabase = createClientComponentClient()
  const { perfil, isLoading: isLoadingPerfil, error: perfilError } = useRevendaPerfil()
  const { toast } = useToast()
  
  // Estados locais
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cobranca, setCobranca] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [verificandoCobranca, setVerificandoCobranca] = useState(true)

  // Verifica se já existe uma cobrança ao carregar a página
  useEffect(() => {
    async function verificarCobrancaExistente() {
      if (!perfil?.id) return

      try {
        const { data: cobrancaExistente, error: errorCobranca } = await supabase
          .from('cobrancas')
          .select('*')
          .eq('sacado_perfil_id', perfil.id)
          .eq('cobrancas_tipos_id', 1)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (errorCobranca && errorCobranca.code !== 'PGRST116') {
          console.error('Erro ao verificar cobrança:', errorCobranca)
          throw errorCobranca
        }

        if (cobrancaExistente && !cobrancaExistente.paga) {
          console.log('Cobrança existente encontrada:', cobrancaExistente)
          setCobranca(cobrancaExistente.asaas)
        }
      } catch (err) {
        console.error('Erro ao verificar cobrança existente:', err)
      } finally {
        setVerificandoCobranca(false)
      }
    }

    verificarCobrancaExistente()
  }, [perfil?.id])

  const handleAtivarRevenda = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!perfil) {
        throw new Error('Perfil não encontrado')
      }

      // Verifica novamente se já existe cobrança
      const { data: cobrancaExistente, error: errorCobranca } = await supabase
        .from('cobrancas')
        .select('*')
        .eq('sacado_perfil_id', perfil.id)
        .eq('cobrancas_tipos_id', 1)
        .maybeSingle()

      if (errorCobranca) {
        throw new Error('Erro ao verificar cobrança existente')
      }

      if (cobrancaExistente && !cobrancaExistente.paga) {
        setCobranca(cobrancaExistente.asaas)
        return
      }

      // Cria cliente no Asaas
      const customerData = {
        name: perfil.nome_completo || '',
        email: perfil.email || '',
        phone: perfil.fone || undefined,
        mobilePhone: perfil.celular || undefined,
        cpfCnpj: perfil.cpf_cnpj?.replace(/[^0-9]/g, '') || '',
        postalCode: perfil.endereco_principal?.cep?.replace(/[^0-9]/g, '') || '',
        address: perfil.endereco_principal?.logradouro || '',
        addressNumber: perfil.endereco_principal?.numero || '',
        complement: perfil.endereco_principal?.complemento || undefined,
        province: perfil.endereco_principal?.bairro || '',
        externalReference: perfil.id?.toString()
      }

      console.log('Dados para criar cliente:', customerData)
      const asaasResponse = await createAsaasCustomer(customerData)
      console.log('Resposta do Asaas:', asaasResponse)

      // Salva cliente no banco
      console.log('Salvando cliente no banco...')
      const { error: dbError } = await supabase
        .from('asaas_clientes')
        .insert({
          asaas_id: asaasResponse.id,
          name: asaasResponse.name || '',
          email: asaasResponse.email || '',
          phone: asaasResponse.phone || null,
          mobilephone: asaasResponse.mobilePhone || null,
          cpfcnpj: asaasResponse.cpfCnpj || '',
          address: asaasResponse.address || '',
          addressnumber: asaasResponse.addressNumber || '',
          complement: asaasResponse.complement || null,
          province: asaasResponse.province || '',
          city: asaasResponse.city || '',
          cityname: asaasResponse.city || '',
          state: asaasResponse.state || '',
          country: 'Brasil',
          postalcode: asaasResponse.postalCode || '',
          persontype: asaasResponse.cpfCnpj?.length > 11 ? 'JURIDICA' : 'FISICA',
          object: 'customer',
          company: asaasResponse.company || '',
          deleted: false,
          canedit: true,
          candelete: true,
          notificationdisabled: false,
          datecreated: new Date().toISOString(),
          perfis_id: perfil.id
        })

      if (dbError) {
        console.error('Erro ao salvar cliente:', dbError)
        throw new Error(`Erro ao salvar cliente no banco de dados: ${dbError.message}`)
      }

      // Cria cobrança
      console.log('Criando cobrança...')
      const chargeData = {
        customer: asaasResponse.id,
        billingType: 'PIX',
        value: 30.00,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'Ativação de Revenda',
        externalReference: perfil.id?.toString()
      }

      console.log('Dados da cobrança:', chargeData)
      const chargeResponse = await createAsaasCharge(chargeData)
      console.log('Resposta da cobrança:', chargeResponse)

      // Salva a cobrança no Supabase
      const { error: cobrancaError } = await supabase
        .from('cobrancas')
        .insert({
          cobrancas_tipos_id: 1, // Ativação de revenda
          asaas: chargeResponse,
          sacado_perfil_id: perfil.id,
          cedente_perfil_id: '2c55d107-7c8a-4d96-8dcb-3a4958db665b', // ID do perfil ERPAPP
          valor: chargeResponse.value,
          vencimento: chargeResponse.dueDate,
          pago_em: null,
          paga: false
        })

      if (cobrancaError) {
        console.error('Erro ao salvar cobrança:', cobrancaError)
        throw new Error(`Erro ao salvar cobrança no banco de dados: ${cobrancaError.message}`)
      }

      setCobranca(chargeResponse)
      toast({
        title: "Cobrança gerada com sucesso!",
        description: "Use o QR Code ou o código PIX para fazer o pagamento"
      })

    } catch (err: any) {
      console.error('Erro ao ativar revenda:', err)
      const errorMessage = err?.message || 'Erro desconhecido ao ativar revenda'
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Erro ao ativar revenda",
        description: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  // Função para copiar o código PIX
  const handleCopyPix = async () => {
    if (cobranca?.pix?.payload) {
      await navigator.clipboard.writeText(cobranca.pix.payload)
      setCopied(true)
      toast({
        title: "Código PIX copiado!",
        description: "Cole o código no seu aplicativo de banco"
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Se estiver verificando cobrança ou carregando perfil, mostra loading
  if (verificandoCobranca || isLoadingPerfil) {
    return (
      <div className="container max-w-screen-lg mx-auto py-4">
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <h1 className="text-2xl font-bold">Carregando...</h1>
          </div>
        </Card>
      </div>
    )
  }

  // Se houver erro no perfil, mostra mensagem
  if (perfilError) {
    return (
      <div className="container max-w-screen-lg mx-auto py-4">
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{perfilError.message}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container max-w-screen-lg mx-auto py-4 space-y-4">
      {/* Card de Informações da Revenda */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Informações da Revenda</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nome da Empresa</p>
              <p className="font-medium">{perfil?.nome_completo || '-'}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">CNPJ/CPF</p>
              <p className="font-medium">{perfil?.cpf_cnpj || '-'}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{perfil?.email || '-'}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Celular</p>
              <p className="font-medium">{perfil?.celular || '-'}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Domínio</p>
              <p className="font-medium">{perfil?.dominio || '-'}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Apelido</p>
              <p className="font-medium">{perfil?.apelido || '-'}</p>
            </div>

            {perfil?.endereco_principal && (
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Endereço</p>
                <p className="font-medium">
                  {perfil.endereco_principal.logradouro}, {perfil.endereco_principal.numero}
                  {perfil.endereco_principal.complemento && ` - ${perfil.endereco_principal.complemento}`}
                  <br />
                  {perfil.endereco_principal.bairro} - {perfil.endereco_principal.localidade}/{perfil.endereco_principal.uf}
                  <br />
                  CEP: {perfil.endereco_principal.cep}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Card de Ativação */}
      <Card className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Ativação de Revenda</h1>
            <p className="text-muted-foreground max-w-md">
              Para ativar sua conta de revenda, é necessário realizar um pagamento único de {formatCurrency(30)}
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!cobranca ? (
            <Button 
              onClick={handleAtivarRevenda}
              disabled={loading}
              size="lg"
              className="w-full max-w-md mx-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CircleDollarSign className="mr-2 h-4 w-4" />
                  Gerar Cobrança
                </>
              )}
            </Button>
          ) : (
            <div className="flex flex-col items-center gap-6">
              {/* Valor e Status */}
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {formatCurrency(cobranca.value)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Pagamento via PIX
                </div>
              </div>

              {/* QR Code PIX */}
              {cobranca?.pix?.qrCode && (
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-6 bg-white rounded-xl shadow-md">
                    <img 
                      src={`data:image/png;base64,${cobranca.pix.qrCode}`}
                      alt="QR Code PIX" 
                      className="w-48 h-48"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground text-center max-w-xs">
                    Escaneie o QR Code acima com o aplicativo do seu banco para realizar o pagamento
                  </p>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex flex-col w-full max-w-md gap-3">
                {/* Botão Copiar Código PIX */}
                {cobranca?.pix?.payload && (
                  <Button 
                    variant="outline" 
                    size="lg"
                    className={cn(
                      "w-full py-6 border-2",
                      copied 
                        ? "border-green-500/30 bg-green-500/10 hover:bg-green-500/20" 
                        : "border-primary/20 bg-primary/5 hover:bg-primary/10"
                    )}
                    onClick={handleCopyPix}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {copied ? (
                        <>
                          <CopyCheck className="w-6 h-6 text-green-500" />
                          <span className="text-green-500">Código Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-6 h-6" />
                          <span>Copiar Código PIX</span>
                        </>
                      )}
                    </div>
                  </Button>
                )}

                {/* Link para o Asaas */}
                {cobranca?.invoiceUrl && (
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => window.open(cobranca.invoiceUrl, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver Fatura no Asaas
                  </Button>
                )}
              </div>

              {/* Instruções */}
              <div className="text-sm text-muted-foreground text-center max-w-md">
                <p>
                  Após o pagamento, sua conta será ativada automaticamente.
                  Em caso de dúvidas, entre em contato com nosso suporte.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
