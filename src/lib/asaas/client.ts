import { env } from '@/env'
import { AsaasSubcontaPayload, AsaasSubcontaResponse, AsaasWebhookConfig } from './types'

export interface AsaasConfig {
  baseUrl: string
  apiKey: string
  walletId?: string
}

export class AsaasClient {
  private static instance: AsaasClient
  private readonly config: AsaasConfig

  constructor() {
    if (AsaasClient.instance) {
      return AsaasClient.instance
    }

    console.log('=== CONFIGURAÇÃO DO ASAAS ===')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('ASAAS_ENV:', process.env.ASAAS_ENV)
    
    // Log da API Key original
    const originalApiKey = process.env.ASAAS_API_KEY
    console.log('API Key original:', originalApiKey)
    
    // Limpa a API Key
    const apiKey = originalApiKey?.trim()
    console.log('API Key após trim:', apiKey)
    
    if (!apiKey) {
      throw new Error('ASAAS_API_KEY não configurada')
    }

    // URLs corretas conforme documentação
    const baseUrl = process.env.ASAAS_ENV === 'production' 
      ? 'https://api.asaas.com/v3'
      : 'https://sandbox.asaas.com/api/v3'

    console.log('URL Base:', baseUrl)
    console.log('ASAAS_WALLET_ID:', process.env.ASAAS_WALLET_ID)

    this.config = {
      baseUrl,
      apiKey,
      walletId: process.env.ASAAS_WALLET_ID
    }

    AsaasClient.instance = this
  }

  // Método público para acessar a URL base
  getBaseUrl(): string {
    return this.config.baseUrl
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.config.baseUrl}${endpoint}`
    const headers = {
      'User-Agent': 'asaas-api-client',
      'accept': 'application/json',
      'access_token': this.config.apiKey,
      'content-type': 'application/json',
      ...options.headers
    }

    console.log('=== REQUISIÇÃO PARA O ASAAS ===')
    console.log('URL:', url)
    console.log('Headers:', {
      ...headers,
      'access_token': headers['access_token'].substring(0, 10) + '...' // Esconde parte da chave
    })

    const response = await fetch(url, {
      ...options,
      headers
    })

    if (!response.ok) {
      console.error('Erro na requisição:', {
        url,
        status: response.status,
        statusText: response.statusText
      })

      const errorText = await response.text()
      console.error('Detalhes do erro:', errorText)

      throw new Error(`Erro ${response.status}: ${errorText || response.statusText}`)
    }

    return response
  }

  async testConnection() {
    console.log('=== TESTANDO CONEXÃO ASAAS ===')
    console.log('URL Base:', this.config.baseUrl)
    console.log('API Key:', this.config.apiKey.substring(0, 10) + '...')

    const response = await this.makeRequest('/test')
    const data = await response.json()

    console.log('Resposta:', data)

    if (!data.success) {
      throw new Error(data.error || 'Erro ao conectar com Asaas')
    }

    return data
  }

  // Método para criar subconta
  async createSubconta(data: AsaasSubcontaPayload): Promise<any> {
    console.log('=== CRIANDO SUBCONTA ===')
    console.log('API Key:', this.config.apiKey.substring(0, 10) + '...')
    console.log('Dados recebidos:', JSON.stringify(data, null, 2))

    try {
      // Validação do CPF/CNPJ
      const cpfCnpj = data.cpfCnpj.replace(/[^\d]/g, '')
      if (!cpfCnpj || (cpfCnpj.length !== 11 && cpfCnpj.length !== 14)) {
        throw new Error('CPF/CNPJ inválido. Deve ter 11 dígitos para CPF ou 14 para CNPJ.')
      }

      // Preparar payload
      const payload = {
        name: data.name,
        email: data.email,
        loginEmail: data.loginEmail,
        cpfCnpj: cpfCnpj,
        birthDate: data.birthDate,
        companyType: data.companyType,
        personType: data.personType,
        phone: data.phone,
        mobilePhone: data.mobilePhone,
        address: data.address,
        addressNumber: data.addressNumber,
        complement: data.complement,
        province: data.province,
        postalCode: data.postalCode.replace(/[^\d]/g, ''),
        incomeValue: Number(data.incomeValue),
        site: data.site,
        webhooks: data.webhooks
      }

      console.log('=== PAYLOAD FINAL ===')
      console.log(JSON.stringify(payload, null, 2))

      const response = await this.makeRequest('/accounts', {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      const responseText = await response.text()
      console.log('=== RESPOSTA DA API ===')
      console.log('Status:', response.status)
      console.log('Body:', responseText)

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${responseText}`)
      }

      return JSON.parse(responseText)
    } catch (error: any) {
      console.error('=== ERRO AO CRIAR SUBCONTA ===')
      console.error('Detalhes do erro:', error)
      throw error
    }
  }

  // Método para buscar subcontas
  async listSubcontas(): Promise<any> {
    console.log('=== LISTANDO SUBCONTAS ===')
    
    try {
      const response = await this.makeRequest('/accounts', {
        method: 'GET'
      })

      const responseText = await response.text()
      console.log('=== RESPOSTA DA API ===')
      console.log('Status:', response.status)
      console.log('Body:', responseText)

      if (!response.ok) {
        console.error('=== ERRO NA REQUISIÇÃO ===')
        throw new Error(`Erro ${response.status}: ${responseText || response.statusText}`)
      }

      return JSON.parse(responseText)
    } catch (error: any) {
      console.error('=== ERRO AO LISTAR SUBCONTAS ===')
      console.error('Detalhes do erro:', error)
      throw error
    }
  }

  // Método para configurar webhook da subconta
  async configureSubcontaWebhook(apiKey: string, config: AsaasWebhookConfig): Promise<any> {
    console.log('=== CONFIGURANDO WEBHOOK DA SUBCONTA ===')
    
    try {
      const response = await this.makeRequest('/webhook', {
        method: 'POST',
        headers: {
          'access_token': apiKey,
        },
        body: JSON.stringify(config)
      })

      const responseData = await response.json()
      console.log('Webhook configurado com sucesso:', responseData)
      return responseData
    } catch (error: any) {
      console.error('Erro ao configurar webhook:', error)
      throw error
    }
  }
}

export const asaasClient = new AsaasClient();
