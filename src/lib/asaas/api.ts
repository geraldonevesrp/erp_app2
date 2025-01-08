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
          'Content-Type': 'application/json'
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
      const paymentData = {
        ...payment,
        split: payment.split ? payment.split : [{
          walletId: this.config.walletId,
          value: payment.value
        }]
      }

      console.log('Frontend - Iniciando criação do pagamento:', paymentData)

      const response = await fetch('/api/asaas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          endpoint: '/payments',
          data: paymentData
        })
      })

      console.log('Frontend - Status da resposta:', {
        status: response.status,
        statusText: response.statusText
      })

      const responseData = await response.json()

      if (!response.ok) {
        console.error('Frontend - Erro na resposta:', {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        })
        throw new Error(responseData.error || 'Erro ao criar pagamento no Asaas')
      }

      console.log('Frontend - Pagamento criado com sucesso:', responseData)
      return responseData
    } catch (error: any) {
      console.error('Frontend - Erro detalhado ao criar pagamento:', {
        message: error.message,
        cause: error.cause,
        stack: error.stack
      })
      throw error
    }
  }

  async getPaymentLink(paymentId: string) {
    try {
      console.log('Frontend - Iniciando geração do link de pagamento:', paymentId)

      const response = await fetch(`/api/asaas?endpoint=/payments/${paymentId}/identificationField`, {
        headers: {
          'Content-Type': 'application/json'
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
          'Content-Type': 'application/json'
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
}
