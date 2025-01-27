import { asaasClient } from './client'

export interface AsaasConfig {
  baseUrl: string
  apiKey: string
  walletId?: string
}

export function getAsaasConfig(): AsaasConfig {
  console.log('=== CARREGANDO CONFIGURAÇÃO DO ASAAS ===')
  
  const config = asaasClient.config
  
  console.log('API Key encontrada:', config.apiKey ? 'Sim' : 'Não')

  if (!config.apiKey) {
    throw new Error('API Key do Asaas não encontrada')
  }

  console.log('Configuração carregada com sucesso')
  return config
}

export const asaasApi = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}
