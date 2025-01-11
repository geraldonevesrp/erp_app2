import { getAsaasConfig, asaasApi } from './config'
import { AsaasCliente, AsaasPaymentStatus, AsaasBillingType } from './types'

export interface AsaasCustomer {
  id?: string
  name: string
  email: string
  phone?: string
  mobilePhone?: string
  cpfCnpj: string
  postalCode?: string
  address?: string
  addressNumber?: string
  complement?: string
  province?: string
  externalReference?: string
  notificationDisabled?: boolean
  additionalEmails?: string
  municipalInscription?: string
  stateInscription?: string
  observations?: string
}

export interface AsaasPayment {
  id?: string
  customer: string
  billingType: AsaasBillingType
  value: number
  dueDate: string
  description?: string
  externalReference?: string
  postalService?: boolean
  split?: Array<{
    walletId: string
    value: number
    percentageValue?: number
  }>
}

export class AsaasClient {
  private config = getAsaasConfig()

  async createCustomer(customer: AsaasCustomer) {
    try {
      console.log('=== INÍCIO DA CRIAÇÃO DO CLIENTE NO ASAAS ===')
      console.log('Dados do cliente:', customer)

      const response = await fetch('/api/asaas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          endpoint: '/customers',
          data: customer
        })
      })

      console.log('Status da resposta:', response.status, response.statusText)

      const responseData = await response.json()
      console.log('Resposta completa:', responseData)
      
      if (!response.ok) {
        console.error('Erro na criação do cliente:', responseData)
        throw new Error(responseData.error || 'Erro ao criar cliente no Asaas')
      }

      console.log('Cliente criado com sucesso:', responseData)
      console.log('=== FIM DA CRIAÇÃO DO CLIENTE NO ASAAS ===')
      return responseData
    } catch (error: any) {
      console.error('Erro detalhado na criação do cliente:', {
        message: error.message,
        cause: error.cause,
        stack: error.stack
      })
      throw error
    }
  }

  async createPayment(payment: AsaasPayment) {
    try {
      console.log('=== INÍCIO CRIAÇÃO PAGAMENTO ASAAS ===')
      console.log('Dados do pagamento:', payment)

      const body = {
        endpoint: '/payments',
        data: payment
      }
      console.log('Corpo da requisição:', body)

      const response = await fetch('/api/asaas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      })

      console.log('Status da resposta:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })

      const responseText = await response.text()
      console.log('Resposta bruta:', responseText)

      let responseData
      try {
        responseData = JSON.parse(responseText)
        console.log('Resposta parseada:', responseData)
      } catch (e) {
        console.error('Erro ao fazer parse da resposta:', e)
        throw new Error('Erro ao processar resposta da API')
      }

      if (!response.ok) {
        console.error('Erro na resposta:', responseData)
        throw new Error(responseData.error || 'Erro ao criar pagamento')
      }

      return responseData
    } catch (error) {
      console.error('=== ERRO NA CRIAÇÃO DO PAGAMENTO ===')
      console.error('Erro detalhado:', error)
      throw error
    }
  }

  async getPaymentLink(paymentId: string) {
    try {
      console.log('Frontend - Iniciando geração do link de pagamento:', paymentId)

      const response = await fetch(`/api/asaas?endpoint=/payments/${paymentId}/identificationField`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      console.log('Frontend - Status da resposta:', {
        status: response.status,
        statusText: response.statusText
      })

      if (!response.ok) {
        const responseData = await response.json()
        console.error('Frontend - Erro na resposta:', {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        })
        throw new Error(responseData.error || 'Erro ao gerar link de pagamento')
      }

      const data = await response.json()
      console.log('Frontend - Link de pagamento gerado com sucesso:', data)
      return {
        encodedImage: data.encodedImage,
        copyPaste: data.copyPaste
      }
    } catch (error: any) {
      console.error('Frontend - Erro detalhado ao gerar link de pagamento:', {
        message: error.message,
        cause: error.cause,
        stack: error.stack
      })
      throw error
    }
  }

  async getPaymentStatus(paymentId: string) {
    try {
      console.log('Frontend - Iniciando consulta de status do pagamento:', paymentId)

      const response = await fetch(`/api/asaas?endpoint=/payments/${paymentId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      console.log('Frontend - Status da resposta:', {
        status: response.status,
        statusText: response.statusText
      })

      if (!response.ok) {
        const responseData = await response.json()
        console.error('Frontend - Erro na resposta:', {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        })
        throw new Error(responseData.error || 'Erro ao consultar status do pagamento')
      }

      const data = await response.json()
      console.log('Frontend - Status do pagamento consultado com sucesso:', data)
      return data
    } catch (error: any) {
      console.error('Frontend - Erro detalhado ao consultar status do pagamento:', {
        message: error.message,
        cause: error.cause,
        stack: error.stack
      })
      throw error
    }
  }

  async getPixQRCode(paymentId: string) {
    try {
      console.log('=== INÍCIO BUSCA QR CODE PIX ===')
      console.log('ID do pagamento:', paymentId)

      const response = await fetch('/api/asaas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          endpoint: `/payments/${paymentId}/pixQrCode`,
          method: 'GET'
        })
      })

      console.log('Status da resposta:', response.status, response.statusText)

      const responseData = await response.json()
      console.log('Resposta completa:', responseData)
      
      if (!response.ok) {
        console.error('Erro ao buscar QR Code:', responseData)
        throw new Error(responseData.error || 'Erro ao buscar QR Code PIX')
      }

      console.log('QR Code obtido com sucesso:', responseData)
      console.log('=== FIM BUSCA QR CODE PIX ===')
      return responseData
    } catch (error: any) {
      console.error('Erro detalhado na busca do QR Code:', {
        message: error.message,
        cause: error.cause,
        stack: error.stack
      })
      throw error
    }
  }
}
