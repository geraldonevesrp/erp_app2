interface AsaasConfig {
  baseUrl: string
  apiKey: string
  walletId?: string
}

let config: AsaasConfig | null = null

export function createAsaasClient() {
  if (!config) {
    // Forçando sandbox por enquanto
    const isSandbox = true // process.env.NODE_ENV === 'development'
    
    const baseUrl = isSandbox 
      ? 'https://sandbox.asaas.com/api/v3'
      : 'https://api.asaas.com/api/v3'

    const apiKey = isSandbox
      ? process.env.NEXT_PUBLIC_ASAAS_SANDBOX_API_KEY
      : process.env.NEXT_PUBLIC_ASAAS_PRODUCTION_API_KEY

    const walletId = isSandbox
      ? process.env.NEXT_PUBLIC_ASAAS_SANDBOX_WALLET_ID
      : process.env.NEXT_PUBLIC_ASAAS_PRODUCTION_WALLET_ID

    if (!apiKey) {
      throw new Error('API Key do Asaas não encontrada')
    }

    config = {
      baseUrl,
      apiKey,
      walletId
    }
  }

  return config
}
