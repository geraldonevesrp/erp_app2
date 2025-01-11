/**
 * Página de Ativação de Revenda
 * 
 * Esta página gerencia o processo de ativação de uma revenda, incluindo:
 * 1. Verificação/criação de cliente no Asaas
 * 2. Geração de cobrança PIX
 * 3. Armazenamento local dos dados
 * 
 * @requires createClientComponentClient - Cliente Supabase
 * @requires AsaasClient - Cliente para API do Asaas
 * @requires usePerfil - Hook de contexto do perfil
 */

'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { AsaasClient } from '@/lib/asaas/api'
import type { AsaasCustomer } from '@/lib/asaas/api'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CircleDollarSign, Loader2, QrCode } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { usePerfil } from '@/contexts/perfil'

export default function AtivarRevenda() {
  // Clientes e hooks
  const supabase = createClientComponentClient()
  const asaasClient = new AsaasClient()
  const { perfil, isLoading: isLoadingPerfil } = usePerfil()
  
  // Estados locais
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [asaasCliente, setAsaasCliente] = useState<any>(null)
  const [cobranca, setCobranca] = useState<any>(null)

  // Inicia o processo quando o perfil estiver carregado
  useEffect(() => {
    if (perfil && !isLoadingPerfil) {
      handleAtivarRevenda()
    }
  }, [perfil, isLoadingPerfil])

  /**
   * Função principal que gerencia o processo de ativação
   * Executa em sequência:
   * 1. Verifica cliente existente
   * 2. Cria cliente se necessário
   * 3. Verifica cobrança existente
   * 4. Cria cobrança se necessário
   */
  const handleAtivarRevenda = async () => {
    if (!perfil) return
    
    try {
      setLoading(true)
      setError(null)

      // Verificar cliente existente
      const { data: existingCustomer, error: queryError } = await supabase
        .from('asaas_clientes')
        .select('*')
        .eq('perfis_id', perfil.id)
        .single()

      if (queryError && queryError.code !== 'PGRST116') {
        throw new Error('Erro ao consultar cliente Asaas')
      }

      let asaasResponse
      if (existingCustomer) {
        // Usa cliente existente
        asaasResponse = {
          id: existingCustomer.asaas_id,
          name: existingCustomer.name,
          email: existingCustomer.email
        }
        setAsaasCliente(existingCustomer)
      } else {
        // Cria novo cliente na API Asaas
        const customerData: AsaasCustomer = {
          name: perfil.nome_completo || perfil.apelido || 'Sem nome',
          email: perfil.email || '',
          cpfCnpj: perfil.cpf_cnpj,
          phone: perfil.fone || '',
          mobilePhone: perfil.celular || '',
          address: perfil.endereco_principal?.logradouro || '',
          addressNumber: perfil.endereco_principal?.numero || '',
          complement: perfil.endereco_principal?.complemento || '',
          province: perfil.endereco_principal?.bairro || '',
          postalCode: perfil.endereco_principal?.cep || '',
          city: perfil.endereco_principal?.localidade || '',
          state: perfil.endereco_principal?.uf || '',
          country: 'Brasil',
          company: perfil.empresa || '',
          personType: perfil.tipo_pessoa || 'JURIDICA',
          notificationDisabled: false
        }

        asaasResponse = await asaasClient.createCustomer(customerData)

        // Salva cliente localmente
        const newClientData = {
          asaas_id: asaasResponse.id,
          asaas_contas_id: 4,
          city: asaasResponse.city || '',
          name: asaasResponse.name,
          email: asaasResponse.email,
          phone: asaasResponse.phone || '',
          state: asaasResponse.state || '',
          object: asaasResponse.object,
          address: asaasResponse.address || '',
          canedit: asaasResponse.canEdit,
          company: asaasResponse.company || '',
          country: asaasResponse.country || 'Brasil',
          cpfcnpj: asaasResponse.cpfCnpj,
          deleted: asaasResponse.deleted,
          cityname: asaasResponse.city || '',
          province: asaasResponse.province || '',
          candelete: asaasResponse.canDelete,
          complement: asaasResponse.complement || '',
          persontype: asaasResponse.personType,
          postalcode: asaasResponse.postalCode || '',
          datecreated: new Date(asaasResponse.dateCreated).toISOString(),
          mobilephone: asaasResponse.mobilePhone || '',
          observations: asaasResponse.observations || '',
          addressnumber: asaasResponse.addressNumber || '',
          additionalemails: asaasResponse.additionalEmails || '',
          cannoteditreason: asaasResponse.cannotEditReason || '',
          stateinscription: asaasResponse.stateInscription || '',
          externalreference: asaasResponse.externalReference || '',
          municipalinscription: asaasResponse.municipalInscription || '',
          notificationdisabled: asaasResponse.notificationDisabled,
          cannotbedeletedreason: asaasResponse.cannotBeDeletedReason || '',
          perfis_id: perfil.id
        }

        const { error: insertError } = await supabase
          .from('asaas_clientes')
          .insert(newClientData)
          .select()
          .single()

        if (insertError) {
          throw new Error(`Erro ao criar registro em asaas_clientes: ${insertError.message}`)
        }

        setAsaasCliente(newClientData)
      }

      // Verifica cobrança existente
      const { data: existingPayment, error: paymentQueryError } = await supabase
        .from('cobrancas')
        .select('*')
        .eq('sacado_perfil_id', perfil.id)
        .eq('cobrancas_tipos_id', 1)
        .maybeSingle()

      if (paymentQueryError) {
        throw new Error('Erro ao consultar cobrança existente')
      }

      if (existingPayment) {
        setCobranca(existingPayment)
        return
      }

      // Cria nova cobrança
      const paymentData = {
        customer: asaasResponse.id,
        billingType: 'PIX',
        value: 30.00,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'Plano Revenda - Ativação',
        externalReference: `revenda_${perfil.id}`,
        postalService: false
      }

      const paymentResponse = await asaasClient.createPayment(paymentData)

      if (!paymentResponse || !paymentResponse.id) {
        throw new Error('Erro ao gerar cobrança no Asaas')
      }

      // Salva cobrança localmente
      const cobrancaData = {
        cobrancas_tipos_id: 1,
        asaas: paymentResponse,
        sacado_perfil_id: perfil.id,
        cedente_perfil_id: '2c55d107-7c8a-4d96-8dcb-3a4958db665b',
        valor: paymentData.value,
        vencimento: paymentData.dueDate,
        pago_em: null,
        paga: false
      }

      const { data: cobrancaInserida, error: cobrancaError } = await supabase
        .from('cobrancas')
        .insert(cobrancaData)
        .select()
        .single()

      if (cobrancaError) {
        throw new Error(`Erro ao salvar cobrança: ${cobrancaError.message}`)
      }

      setCobranca(cobrancaInserida)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Não renderiza nada até o perfil estar carregado
  if (!perfil || isLoadingPerfil) {
    return null
  }

  // Interface do usuário
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Ativação do Plano Revenda</h2>
          <p className="text-muted-foreground">
            Para ativar seu plano revenda, é necessário realizar o pagamento da taxa de ativação.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : cobranca ? (
          <div className="space-y-6">
            <Alert>
              <CircleDollarSign className="h-4 w-4" />
              <AlertTitle>Pagamento Pendente</AlertTitle>
              <AlertDescription>
                Valor: {formatCurrency(cobranca.valor)}
                <br />
                Vencimento: {new Date(cobranca.vencimento).toLocaleDateString()}
              </AlertDescription>
            </Alert>

            {cobranca.asaas?.pixQrCodeImage && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img 
                    src={cobranca.asaas.pixQrCodeImage} 
                    alt="QR Code PIX"
                    className="w-48 h-48"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-center text-muted-foreground">
                    Use o QR Code acima para pagar via PIX
                  </p>
                  {cobranca.asaas?.pixCode && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigator.clipboard.writeText(cobranca.asaas.pixCode)}
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      Copiar Código PIX
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </Card>
    </div>
  )
}
