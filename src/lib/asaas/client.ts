import { env } from '@/env'

export interface AsaasConfig {
  baseUrl: string
  apiKey: string
  walletId?: string
}

class AsaasClient {
  private static instance: AsaasClient;
  private readonly config: AsaasConfig;

  private constructor() {
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
  }

  public static getInstance(): AsaasClient {
    if (!AsaasClient.instance) {
      AsaasClient.instance = new AsaasClient();
    }
    return AsaasClient.instance;
  }

  public async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.config.baseUrl}${endpoint}`

    // Headers exatamente como na documentação, na mesma ordem
    const headers = {
      'access_token': this.config.apiKey,
      'Content-Type': 'application/json',
      'User-Agent': 'erp_app2'
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

    // Log apenas do status e URL em caso de erro
    if (!response.ok) {
      console.error('Erro na requisição:', {
        url,
        status: response.status,
        statusText: response.statusText
      })
    }

    return response
  }
}

export const asaasClient = AsaasClient.getInstance();
