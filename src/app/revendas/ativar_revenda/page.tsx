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

import { useState, useEffect, useCallback } from 'react'
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
        data: customerData
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Erro ao criar cliente:', errorData)
      throw new Error(errorData.error || `Erro ao criar cliente no Asaas: ${response.status}`)
    }

    const data = await response.json()
    console.log('Cliente criado com sucesso:', data)
    return data.data
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
        data: chargeData
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Erro ao criar cobrança:', errorData)
      throw new Error(errorData.error || `Erro ao criar cobrança no Asaas: ${response.status}`)
    }

    const data = await response.json()
    console.log('Cobrança criada com sucesso:', data)
    return data.data
  } catch (error: any) {
    console.error('Erro detalhado ao criar cobrança:', error)
    throw error
  }
}

async function getPixQrCode(paymentId: string) {
  try {
    console.log('Buscando QR Code para pagamento:', paymentId)
    const response = await fetch('/api/asaas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: `/payments/${paymentId}/pixQrCode`
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Erro ao buscar QR Code: ${response.status}`)
    }

    const data = await response.json()
    console.log('QR Code recebido:', data)
    return data.data
  } catch (error) {
    console.error('Erro ao buscar QR Code:', error)
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
  const [loadingQrCode, setLoadingQrCode] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cobranca, setCobranca] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [verificandoCobranca, setVerificandoCobranca] = useState(true)
  const [validacaoErros, setValidacaoErros] = useState<string[]>([])

  // Função para validar os dados do perfil
  const validarPerfil = (perfil: any) => {
    const erros: string[] = []
    
    if (!perfil.nome_completo?.trim()) {
      erros.push('Nome da empresa é obrigatório')
    }
    
    if (!perfil.cpf_cnpj?.trim()) {
      erros.push('CPF/CNPJ é obrigatório')
    } else {
      const cpfCnpj = perfil.cpf_cnpj.replace(/[^0-9]/g, '')
      if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) {
        erros.push('CPF/CNPJ inválido')
      }
    }
    
    if (!perfil.email?.trim()) {
      erros.push('Email é obrigatório')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(perfil.email)) {
      erros.push('Email inválido')
    }
    
    if (!perfil.celular?.trim()) {
      erros.push('Celular é obrigatório')
    }
    
    if (!perfil.endereco_principal?.cep?.trim()) {
      erros.push('CEP é obrigatório')
    }
    
    return erros
  }

  // Efeito para monitorar mudanças na cobrança via realtime
  useEffect(() => {
    if (!perfil?.id) return

    // Inscreve-se nas mudanças da tabela cobrancas
    const channel = supabase
      .channel('cobrancas-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'cobrancas',
          filter: `sacado_perfil_id=eq.${perfil.id}`
        },
        (payload) => {
          // Se a cobrança foi paga, redireciona
          if (payload.new.paga === true) {
            window.location.href = '/revendas'
          }
        }
      )
      .subscribe()

    // Limpa a subscrição quando o componente for desmontado
    return () => {
      supabase.removeChannel(channel)
    }
  }, [perfil?.id])

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

        // Se encontrou uma cobrança paga, redireciona
        if (cobrancaExistente?.paga) {
          window.location.href = '/revendas'
          return
        }

        // Se encontrou uma cobrança não paga, exibe ela
        if (cobrancaExistente && !cobrancaExistente.paga) {
          console.log('Cobrança existente encontrada na inicialização:', cobrancaExistente)
          
          // Busca o QR Code se não existir
          if (!cobrancaExistente.asaas.pix) {
            try {
              setLoadingQrCode(true)
              const qrCodeData = await getPixQrCode(cobrancaExistente.asaas.id)
              console.log('QR Code obtido:', qrCodeData)
              
              // Atualiza a cobrança com o QR Code
              const cobrancaAtualizada = {
                ...cobrancaExistente.asaas,
                pix: {
                  encodedImage: qrCodeData.encodedImage,
                  payload: qrCodeData.payload,
                  expirationDate: qrCodeData.expirationDate
                }
              }
              
              // Atualiza no Supabase
              const { error: updateError } = await supabase
                .from('cobrancas')
                .update({ asaas: cobrancaAtualizada })
                .eq('id', cobrancaExistente.id)

              if (updateError) {
                console.error('Erro ao atualizar cobrança:', updateError)
                throw updateError
              }
              
              console.log('Cobrança atualizada com QR Code:', cobrancaAtualizada)
              setCobranca(cobrancaAtualizada)
            } catch (error) {
              console.error('Erro ao buscar QR Code:', error)
              setCobranca(cobrancaExistente.asaas)
              toast({
                variant: "destructive",
                title: "Erro ao buscar QR Code",
                description: "Tente recarregar a página"
              })
            } finally {
              setLoadingQrCode(false)
            }
          } else {
            console.log('QR Code já existe na cobrança:', cobrancaExistente.asaas.pix)
            setCobranca(cobrancaExistente.asaas)
          }
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
      setValidacaoErros([])

      if (!perfil) {
        throw new Error('Perfil não encontrado')
      }

      // Valida os dados do perfil
      const erros = validarPerfil(perfil)
      if (erros.length > 0) {
        setValidacaoErros(erros)
        return
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
        console.log('Usando cobrança existente:', cobrancaExistente)
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
    <div className="container max-w-4xl mx-auto py-4 space-y-4">
      {/* Card de Informações da Revenda */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Informações da Revenda</h2>
          </div>

          {/* Erros de Validação */}
          {validacaoErros.length > 0 && (
            <Alert variant="destructive">
              <AlertTitle>Por favor, complete seu cadastro</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {validacaoErros.map((erro, index) => (
                    <li key={index}>{erro}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Nome da Empresa</p>
              <p className="font-medium truncate">{perfil?.nome_completo || '-'}</p>
            </div>
            
            <div>
              <p className="text-muted-foreground">CNPJ/CPF</p>
              <p className="font-medium">{perfil?.cpf_cnpj || '-'}</p>
            </div>
            
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium truncate">{perfil?.email || '-'}</p>
            </div>
            
            <div>
              <p className="text-muted-foreground">Celular</p>
              <p className="font-medium">{perfil?.celular || '-'}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Domínio</p>
              <p className="font-medium">{perfil?.dominio || '-'}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Apelido</p>
              <p className="font-medium">{perfil?.apelido || '-'}</p>
            </div>

            {perfil?.endereco_principal && (
              <div className="col-span-2 md:col-span-3">
                <p className="text-muted-foreground">Endereço</p>
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
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <h1 className="text-xl font-bold">Ativação de Revenda</h1>
            <p className="text-sm text-muted-foreground">
              Para ativar sua conta de revenda, é necessário realizar um pagamento único de {formatCurrency(30)}
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="text-sm">
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!cobranca ? (
            <Button 
              onClick={handleAtivarRevenda}
              disabled={loading}
              size="default"
              className="w-full max-w-xs mx-auto"
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
            <div className="flex flex-col items-center gap-4">
              {/* Valor e Status */}
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {formatCurrency(cobranca.value)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Pagamento via PIX
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center w-full max-w-2xl">
                {/* QR Code PIX */}
                {loadingQrCode ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-4 bg-white rounded-xl shadow-sm">
                      <Loader2 className="w-32 h-32 animate-spin text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Gerando QR Code...
                    </p>
                  </div>
                ) : cobranca?.pix?.encodedImage ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-4 bg-white rounded-xl shadow-sm">
                      <img 
                        src={`data:image/png;base64,${cobranca.pix.encodedImage}`}
                        alt="QR Code PIX" 
                        className="w-32 h-32"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center max-w-[200px]">
                      Escaneie o QR Code com o app do seu banco
                    </p>
                    {cobranca?.pix?.expirationDate && (
                      <p className="text-xs text-muted-foreground">
                        Expira em: {new Date(cobranca.pix.expirationDate).toLocaleString()}
                      </p>
                    )}
                  </div>
                ) : null}

                {/* Botões de Ação */}
                <div className="flex flex-col gap-2">
                  {/* Botão Copiar Código PIX */}
                  {cobranca?.pix?.payload && (
                    <Button 
                      variant="outline" 
                      size="lg"
                      className={cn(
                        "w-full py-6 px-4 border-2",
                        copied 
                          ? "border-green-500/30 bg-green-500/10 hover:bg-green-500/20" 
                          : "border-primary/20 bg-primary/5 hover:bg-primary/10"
                      )}
                      onClick={handleCopyPix}
                    >
                      <div className="flex flex-col items-center gap-2 px-2">
                        {copied ? (
                          <>
                            <CopyCheck className="w-5 h-5 text-green-500" />
                            <span className="text-sm text-green-500">Código Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-5 h-5" />
                            <span className="text-sm">Copiar Código PIX</span>
                          </>
                        )}
                      </div>
                    </Button>
                  )}

                  {/* Link para o Asaas */}
                  {cobranca?.invoiceUrl && (
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="w-full py-6 px-4 border-2 border-primary/20 bg-primary/5 hover:bg-primary/10"
                      onClick={() => window.open(cobranca.invoiceUrl, '_blank')}
                    >
                      <div className="flex flex-col items-center gap-2 px-2">
                        <ExternalLink className="w-5 h-5" />
                        <span className="text-sm">Ver Fatura no Asaas</span>
                      </div>
                    </Button>
                  )}
                </div>
              </div>

              {/* Instruções */}
              <div className="text-xs text-muted-foreground text-center max-w-md mt-2">
                <p>
                  Após o pagamento, sua conta será ativada automaticamente.
                  Em caso de dúvidas, entre em contato com nosso suporte.
                </p>
                <p className="mt-1 text-primary">
                  Valor único de {formatCurrency(30)} para ativação da sua revenda
                </p>
              </div>

              {/* Status do Pagamento */}
              {cobranca && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    cobranca.status === 'RECEIVED' ? "bg-green-500" :
                    cobranca.status === 'PENDING' ? "bg-yellow-500" :
                    "bg-red-500"
                  )} />
                  <span className="text-xs text-muted-foreground">
                    {cobranca.status === 'RECEIVED' ? 'Pagamento Recebido' :
                     cobranca.status === 'PENDING' ? 'Aguardando Pagamento' :
                     'Pagamento não Realizado'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
