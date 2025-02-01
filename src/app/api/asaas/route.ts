import { NextRequest, NextResponse } from 'next/server'
import { asaasClient } from '@/lib/asaas/client'

/**
 * Endpoint principal para integração com o Asaas
 * 
 * Suporta os seguintes endpoints:
 * - POST /customers (criar cliente)
 * - POST /payments (criar cobrança)
 * - GET /payments/{id}/pixQrCode (gerar QR Code PIX)
 */
export async function POST(request: NextRequest) {
  try {
    const { endpoint, method = 'POST', data } = await request.json()

    // Validação básica
    if (!endpoint) {
      return NextResponse.json({
        success: false,
        error: 'Endpoint não especificado'
      }, { status: 400 })
    }

    console.log('Requisição para endpoint:', endpoint)
    console.log('Método:', method)
    console.log('Dados:', data)

    // Verifica se é o endpoint do QR Code
    const isQrCodeEndpoint = endpoint.includes('/pixQrCode')
    const requestMethod = isQrCodeEndpoint ? 'GET' : method

    console.log('Método da requisição:', requestMethod)
    console.log('URL completa:', `${asaasClient.getBaseUrl()}${endpoint}`)

    // Faz a requisição para o Asaas
    const response = await asaasClient.request(endpoint, {
      method: requestMethod,
      body: requestMethod === 'POST' ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': requestMethod === 'POST' ? 'application/json' : undefined
      }
    })

    // Se a resposta não for ok, retorna o erro
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro do Asaas:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })

      return NextResponse.json({
        success: false,
        error: errorText
      }, { status: response.status })
    }

    // Retorna a resposta do Asaas
    const responseData = await response.json()
    return NextResponse.json({
      success: true,
      data: responseData
    })

  } catch (error: any) {
    console.error('Erro ao processar requisição:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

// Endpoint GET para testes e verificação de status
// Não usar em produção, apenas para debug
export async function GET(request: NextRequest) {
  try {
    const response = await asaasClient.request('/test')
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
