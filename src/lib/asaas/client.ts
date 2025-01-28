import { env } from '@/env'
import { AsaasSubcontaPayload, AsaasSubcontaResponse, AsaasWebhookConfig } from './types'

export interface AsaasConfig {
  baseUrl: string
  apiKey: string
  walletId?: string
}

export interface RequestOptions extends RequestInit {
  headers?: Record<string, string | undefined>
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

  // Método público para fazer requisições
  async request(endpoint: string, options: RequestOptions = {}) {
    const url = `${this.config.baseUrl}${endpoint}`
    const headers = {
      'access_token': this.config.apiKey,
      ...options.headers
    }

    const response = await fetch(url, {
      ...options,
      headers
    })

    return response
  }

  // Método público para criar subconta
  async createSubconta(payload: AsaasSubcontaPayload): Promise<AsaasSubcontaResponse> {
    const response = await this.request('/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Erro ao criar subconta: ${error}`)
    }

    return response.json()
  }

  // Método público para obter a URL base
  getBaseUrl(): string {
    return this.config.baseUrl
  }
}

export const asaasClient = new AsaasClient();
