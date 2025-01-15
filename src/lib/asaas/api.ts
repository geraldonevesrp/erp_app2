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

export interface SubcontaPayload {
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

export interface SubcontaResponse {
  id: string
  walletId: string
  apiKey: string
  accountNumber?: any
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

      console.log('Status da resposta:', response.status, response.statusText)

      const responseData = await response.json()
      console.log('Resposta completa:', responseData)

      if (!response.ok) {
        console.error('Erro na criação do pagamento:', responseData)
        throw new Error(responseData.error || 'Erro ao criar pagamento no Asaas')
      }

      console.log('Pagamento criado com sucesso:', responseData)
      console.log('=== FIM CRIAÇÃO PAGAMENTO ASAAS ===')
      return responseData
    } catch (error: any) {
      console.error('Erro detalhado na criação do pagamento:', {
        message: error.message,
        cause: error.cause,
        stack: error.stack
      })
      throw error
    }
  }

  async createSubconta(data: SubcontaPayload): Promise<SubcontaResponse> {
    try {
      console.log('=== INÍCIO DA CRIAÇÃO DA SUBCONTA NO ASAAS ===')
      console.log('Dados da subconta:', JSON.stringify(data, null, 2))
      console.log('URL base:', this.config.baseUrl)
      console.log('API Key presente:', !!this.config.apiKey)
      console.log('Wallet ID:', this.config.walletId)

      // Remover campos undefined, vazios ou nulos
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined && v !== '' && v !== null)
      )

      // Garantir que os campos obrigatórios estejam presentes
      const requiredFields = ['name', 'email', 'loginEmail', 'mobilePhone', 'cpfCnpj', 'personType']
      const missingFields = requiredFields.filter(field => !cleanData[field])
      if (missingFields.length > 0) {
        throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`)
      }

      const body = {
        endpoint: '/accounts',
        data: cleanData,
        method: 'POST'
      }
      console.log('Corpo da requisição:', JSON.stringify(body, null, 2))

      const response = await fetch('/api/asaas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Erro na criação da subconta:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        })
        throw new Error(errorData.error || 'Erro ao criar subconta no Asaas')
      }

      const responseData = await response.json()
      console.log('Subconta criada com sucesso:', responseData)
      console.log('=== FIM DA CRIAÇÃO DA SUBCONTA NO ASAAS ===')
      return responseData
    } catch (error: any) {
      console.error('Erro detalhado na criação da subconta:', {
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

  async testConnection(): Promise<boolean> {
    try {
      console.log('=== TESTANDO CONEXÃO COM ASAAS ===')
      
      // Verificar configuração
      if (!this.config.apiKey) {
        throw new Error('API Key do Asaas não encontrada')
      }

      console.log('Configuração:', {
        baseUrl: this.config.baseUrl,
        apiKeyPresente: !!this.config.apiKey,
        apiKeyPrimeiros20: this.config.apiKey ? this.config.apiKey.substring(0, 20) : 'ausente'
      })

      // Fazer requisição direta para nossa API
      const response = await fetch('/api/asaas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          endpoint: '/accounts/status',
          method: 'GET'
        })
      })

      console.log('Status da resposta:', response.status, response.statusText)

      // Tentar ler a resposta como texto primeiro
      const responseText = await response.text()
      console.log('Resposta bruta:', responseText)

      // Tentar fazer o parse do JSON
      let responseData
      try {
        responseData = responseText ? JSON.parse(responseText) : {}
        console.log('Resposta parseada:', responseData)
      } catch (e) {
        console.error('Erro ao fazer parse da resposta:', e)
        throw new Error('Erro ao processar resposta da API: ' + responseText)
      }

      // Verificar se houve erro
      if (!response.ok) {
        const errorMessage = responseData.error || 
                           responseData.errors?.[0]?.description ||
                           `Erro ${response.status}: ${response.statusText}`
        throw new Error(errorMessage)
      }

      console.log('=== TESTE DE CONEXÃO CONCLUÍDO COM SUCESSO ===')
      return true
    } catch (error: any) {
      console.error('=== ERRO NO TESTE DE CONEXÃO ===', {
        message: error?.message,
        cause: error?.cause,
        stack: error?.stack,
        name: error?.name
      })
      throw error
    }
  }
}
