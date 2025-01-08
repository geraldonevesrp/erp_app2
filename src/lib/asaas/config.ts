interface AsaasConfig {
  apiKey: string
  baseUrl: string
  walletId: string
}

interface AsaasEnvironmentConfig {
  sandbox: AsaasConfig
  production: AsaasConfig
}

export const ASAAS_CONFIG: AsaasEnvironmentConfig = {
  sandbox: {
    apiKey: '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwODg5OTc6OiRhYWNoXzhiMzIxZDkwLTkwNGEtNDNkZi04NzhlLTNhZDMyMDUzNjQ4Yg==',
    baseUrl: 'https://sandbox.asaas.com/api/v3',
    walletId: '2b939389-8fb1-4afa-907b-753ff90c439c'
  },
  production: {
    apiKey: process.env.ASAAS_API_KEY || '',
    baseUrl: 'https://api.asaas.com/api/v3',
    walletId: process.env.ASAAS_WALLET_ID || ''
  }
}

export const getAsaasConfig = (): AsaasConfig => {
  const isProduction = process.env.NODE_ENV === 'production'
  return isProduction ? ASAAS_CONFIG.production : ASAAS_CONFIG.sandbox
}

export const asaasApi = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${getAsaasConfig().apiKey.replace('$', '')}`
  }
}
