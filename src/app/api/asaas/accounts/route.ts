import { NextRequest, NextResponse } from 'next/server'
import { asaasClient } from '@/lib/asaas/client'

/**
 * Endpoint para gerenciamento de subcontas no Asaas
 * 
 * POST /api/asaas/accounts
 * - Cria uma nova subconta
 * - Configura webhook automaticamente
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log('=== DADOS RECEBIDOS NA ROTA ===')
    console.log(JSON.stringify(data, null, 2))

    // Adiciona o authToken do webhook (em produção isso viria do banco)
    if (data.webhooks && data.webhooks[0]) {
      data.webhooks[0].authToken = process.env.ASAAS_WEBHOOK_AUTH_TOKEN
    }

    const response = await asaasClient.createSubconta(data)
    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Erro ao criar subconta:', error)
    return NextResponse.json({ errors: [{ code: 'error', description: error.message }] }, { status: 400 })
  }
}
