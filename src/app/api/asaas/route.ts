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
    const { endpoint, data } = await request.json()

    // Validação básica
    if (!endpoint) {
      return NextResponse.json({
        success: false,
        error: 'Endpoint não especificado'
      }, { status: 400 })
    }

    console.log('POST para endpoint:', endpoint)
    console.log('Dados:', data)

    // Verifica se é o endpoint do QR Code
    const isQrCodeEndpoint = endpoint.includes('/pixQrCode')
    const method = isQrCodeEndpoint ? 'GET' : 'POST'

    console.log('Método da requisição:', method)
    console.log('URL completa:', `${asaasClient.config.baseUrl}${endpoint}`)

    // Faz a requisição para o Asaas
    const response = await asaasClient.makeRequest(endpoint, {
      method,
      body: method === 'POST' ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': method === 'POST' ? 'application/json' : undefined
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
      throw new Error(errorText)
    }

    // Retorna os dados
    const responseData = await response.json()
    console.log('Resposta do Asaas:', {
      ...responseData,
      encodedImage: responseData.encodedImage ? '[BASE64_IMAGE]' : undefined
    })

    // Se for QR Code, adiciona o campo success
    if (isQrCodeEndpoint) {
      return NextResponse.json({
        ...responseData,
        success: true
      })
    }

    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error('Erro ao processar requisição:', error)
    throw error
  }
}

/**
 * Endpoint GET para testes e verificação de status
 * Não usar em produção, apenas para debug
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'API Asaas está funcionando'
  })
}
