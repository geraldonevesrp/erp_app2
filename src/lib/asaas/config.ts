export interface AsaasConfig {
  baseUrl: string
  apiKey: string
  walletId?: string
}

export function getAsaasConfig(): AsaasConfig {
  console.log('=== CARREGANDO CONFIGURAÇÃO DO ASAAS ===')
  console.log('NODE_ENV:', process.env.NODE_ENV)
  
  // Forçando sandbox por enquanto
  const isSandbox = true // process.env.NODE_ENV === 'development'
  console.log('Usando ambiente:', isSandbox ? 'sandbox' : 'produção')
  
  const baseUrl = isSandbox 
    ? 'https://sandbox.asaas.com/api/v3'
    : 'https://api.asaas.com/api/v3'

  const apiKey = isSandbox
    ? process.env.NEXT_PUBLIC_ASAAS_SANDBOX_API_KEY
    : process.env.NEXT_PUBLIC_ASAAS_PRODUCTION_API_KEY

  console.log('Variáveis de ambiente:', {
    NEXT_PUBLIC_ASAAS_SANDBOX_API_KEY_presente: !!process.env.NEXT_PUBLIC_ASAAS_SANDBOX_API_KEY,
    NEXT_PUBLIC_ASAAS_SANDBOX_API_KEY_primeiros20: process.env.NEXT_PUBLIC_ASAAS_SANDBOX_API_KEY?.substring(0, 20),
    NEXT_PUBLIC_ASAAS_SANDBOX_WALLET_ID: process.env.NEXT_PUBLIC_ASAAS_SANDBOX_WALLET_ID
  })

  if (!apiKey) {
    console.error('API Key do Asaas não encontrada')
    throw new Error('API Key do Asaas não encontrada')
  }

  const walletId = isSandbox
    ? process.env.NEXT_PUBLIC_ASAAS_SANDBOX_WALLET_ID
    : process.env.NEXT_PUBLIC_ASAAS_PRODUCTION_WALLET_ID

  const config = {
    baseUrl,
    apiKey,
    walletId
  }

  console.log('Configuração final:', {
    baseUrl: config.baseUrl,
    apiKeyPresente: !!config.apiKey,
    apiKeyPrimeiros20: config.apiKey?.substring(0, 20),
    walletId: config.walletId
  })

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
