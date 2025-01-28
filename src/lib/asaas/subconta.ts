import { getAsaasConfig } from './config'

interface SubcontaPayload {
  name: string
  email: string
  loginEmail: string
  mobilePhone: string
  cpfCnpj: string
  personType: 'FISICA' | 'JURIDICA'
  company?: string
  companyType?: 'MEI' | 'LIMITED' | 'INDIVIDUAL' | 'ASSOCIATION' | 'OTHERS'
  birthDate?: string
  address?: string
  addressNumber?: string
  complement?: string
  province?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  phone?: string
}

interface SubcontaResponse {
  id: string
  walletId: string
  apiKey: string
  accountNumber?: any
}

export async function createAsaasSubconta(data: SubcontaPayload): Promise<SubcontaResponse> {
  console.log('=== INÍCIO DA CRIAÇÃO DE SUBCONTA ASAAS ===')
  console.log('Dados recebidos:', JSON.stringify(data, null, 2))

  try {
    // Validação dos campos obrigatórios conforme documentação
    const requiredFields = {
      'Nome': data.name,
      'E-mail': data.email,
      'E-mail de login': data.loginEmail,
      'Celular': data.mobilePhone,
      'CPF/CNPJ': data.cpfCnpj,
      'Tipo de pessoa': data.personType
    }

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field]) => field)

    if (missingFields.length > 0) {
      throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`)
    }

    // Validação do CPF/CNPJ
    const cpfCnpj = data.cpfCnpj.replace(/[^0-9]/g, '')
    if (!cpfCnpj || (cpfCnpj.length !== 11 && cpfCnpj.length !== 14)) {
      throw new Error('CPF/CNPJ inválido. Deve ter 11 dígitos para CPF ou 14 para CNPJ.')
    }

    // Validação do tipo de pessoa e companyType
    if (data.personType === 'JURIDICA' && !data.companyType) {
      data.companyType = 'LIMITED' // Valor padrão para pessoa jurídica
    }

    // Preparar payload conforme documentação
    const payload = {
      ...data,
      cpfCnpj,
      mobilePhone: data.mobilePhone.replace(/[^0-9]/g, ''),
      phone: data.phone?.replace(/[^0-9]/g, ''),
      country: data.country || 'BRA'
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/asaas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        endpoint: '/accounts',
        data: payload
      })
    })

    console.log('Status da resposta:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro na criação da subconta:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      })

      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch (e) {
        console.error('Erro ao fazer parse do erro:', e)
        throw new Error(`Erro ${response.status}: ${errorText || response.statusText}`)
      }

      if (errorData.error) {
        throw new Error(
          typeof errorData.error === 'string' 
            ? errorData.error 
            : JSON.stringify(errorData.error)
        )
      }

      throw new Error(`Erro ${response.status}: ${JSON.stringify(errorData)}`)
    }

    const responseData = await response.json()
    console.log('Resposta da criação da subconta:', JSON.stringify(responseData, null, 2))

    // Configurar webhook para a nova subconta
    try {
      console.log('Configurando webhook para a nova subconta...')
      const webhookResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/asaas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${responseData.apiKey}`
        },
        body: JSON.stringify({
          endpoint: '/webhook',
          data: {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/asaas`,
            email: 'suporte@erpmax.com.br',
            enabled: true,
            interrupted: false,
            apiVersion: 3,
            events: [
              'PAYMENT_RECEIVED',
              'PAYMENT_CONFIRMED',
              'PAYMENT_CREATED',
              'PAYMENT_UPDATED',
              'PAYMENT_OVERDUE',
              'PAYMENT_DELETED',
              'PAYMENT_RESTORED',
              'PAYMENT_REFUNDED',
              'PAYMENT_RECEIVED_IN_CASH_UNDONE',
              'PAYMENT_CHARGEBACK_REQUESTED',
              'PAYMENT_CHARGEBACK_DISPUTE',
              'PAYMENT_AWAITING_CHARGEBACK_REVERSAL',
              'PAYMENT_DUNNING_RECEIVED',
              'PAYMENT_DUNNING_REQUESTED',
              'PAYMENT_BANK_SLIP_VIEWED',
              'PAYMENT_CHECKOUT_VIEWED'
            ]
          }
        })
      })

      console.log('Status da resposta do webhook:', webhookResponse.status)
      const webhookData = await webhookResponse.json()
      console.log('Resposta da configuração do webhook:', JSON.stringify(webhookData, null, 2))

      if (!webhookResponse.ok) {
        console.error('Erro ao configurar webhook:', webhookData)
      }
    } catch (webhookError) {
      console.error('Erro ao configurar webhook:', webhookError)
      // Não lançamos o erro aqui para não interromper o fluxo principal
    }

    console.log('=== FIM DA CRIAÇÃO DE SUBCONTA - SUCESSO ===')
    return responseData
  } catch (error: any) {
    console.error('=== ERRO NA CRIAÇÃO DE SUBCONTA ===')
    console.error('Detalhes do erro:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    })
    throw error
  }
}
