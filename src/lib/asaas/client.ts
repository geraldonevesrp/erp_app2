import { env } from '@/env'

export interface AsaasConfig {
  baseUrl: string
  apiKey: string
  walletId?: string
}

class AsaasClient {
  private static instance: AsaasClient;
  public readonly config: AsaasConfig;

  private constructor() {
    // APENAS PARA DEBUG - NÃO USE EM PRODUÇÃO
    const apiKey = process.env.ASAAS_SANDBOX_API_KEY || '$aact_MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjI3ZThmZGMxLTIxOWQtNDg1NS05YjRmLTY3OGIwYzNiZmM4OTo6JGFhY2hfZTE0YTY3Y2EtN2JmMS00YWNkLWE3NDItZTQ2YWEyOGZiZTY3'

    if (!apiKey) {
      throw new Error('ASAAS_SANDBOX_API_KEY não configurada')
    }

    this.config = {
      baseUrl: 'https://sandbox.asaas.com/api/v3',
      apiKey,
      walletId: process.env.ASAAS_SANDBOX_WALLET_ID
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
    const headers = {
      ...options.headers,
      'access_token': this.config.apiKey,
    }

    console.log('Fazendo requisição para Asaas:', {
      url,
      method: options.method,
      headers: {
        ...headers,
        'access_token': '[REDACTED]'
      }
    })

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      console.error('Erro na resposta do Asaas:', {
        status: response.status,
        statusText: response.statusText,
        url,
        method: options.method
      })
    } else {
      console.log('Resposta do Asaas OK:', {
        status: response.status,
        url,
        method: options.method
      })
    }

    return response
  }

  // Métodos específicos para cada operação do Asaas
  public async listCustomers(params?: { limit?: number; offset?: number }) {
    const queryParams = new URLSearchParams(params as Record<string, string>).toString()
    const endpoint = `/customers${queryParams ? `?${queryParams}` : ''}`
    return this.makeRequest(endpoint)
  }

  // Adicione outros métodos conforme necessário
}

// Exporta apenas a instância, não a classe
export const asaasClient = AsaasClient.getInstance();
