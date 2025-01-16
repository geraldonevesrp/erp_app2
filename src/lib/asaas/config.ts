export interface AsaasConfig {
  baseUrl: string
  apiKey: string
  walletId?: string
}

export function getAsaasConfig(): AsaasConfig {
  console.log('=== CARREGANDO CONFIGURAÇÃO DO ASAAS ===')
  
  // Forçando sandbox por enquanto
  const isSandbox = true // process.env.NODE_ENV === 'development'
  
  const baseUrl = isSandbox 
    ? 'https://sandbox.asaas.com/api/v3'
    : 'https://api.asaas.com/api/v3'

  // Tentar ler a chave da variável de ambiente
  const apiKey = process.env.ASAAS_SANDBOX_API_KEY
  console.log('API Key encontrada:', apiKey ? 'Sim' : 'Não')

  if (!apiKey) {
    throw new Error('API Key do Asaas não encontrada')
  }

  const config = {
    baseUrl,
    apiKey,
    walletId: process.env.ASAAS_SANDBOX_WALLET_ID
  }

  console.log('Configuração carregada com sucesso')
  return config
}

export const createAsaasClient = () => {
  const config = getAsaasConfig()
  return {
    apiKey: config.apiKey,
    baseUrl: config.baseUrl,
    walletId: config.walletId,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'access_token': config.apiKey
    }
  }
}

export const asaasApi = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'access_token': getAsaasConfig().apiKey
  }
}
