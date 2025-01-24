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
      return NextResponse.json({
        success: false,
        error: `Erro ${response.status}: ${errorText}`
      }, { status: response.status })
    }

    // Retorna os dados
    const responseData = await response.json()
    console.log('Resposta do Asaas:', {
      ...responseData,
      encodedImage: responseData.encodedImage ? '[BASE64_IMAGE]' : undefined
    })
    
    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Erro na requisição Asaas:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    })
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Pega o endpoint da URL
    const url = new URL(request.url)
    const endpoint = url.pathname.replace('/api/asaas', '')

    // Validação básica
    if (!endpoint) {
      return NextResponse.json({
        success: false,
        error: 'Endpoint não especificado'
      }, { status: 400 })
    }

    console.log('URL completa:', request.url)
    console.log('Endpoint extraído:', endpoint)
    console.log('URL base do Asaas:', asaasClient.config.baseUrl)
    console.log('URL final:', `${asaasClient.config.baseUrl}${endpoint}`)

    // Faz a requisição para o Asaas
    const response = await asaasClient.makeRequest(endpoint)

    // Log do status e headers
    console.log('Status:', response.status)
    console.log('Content-Type:', response.headers.get('content-type'))

    // Se a resposta não for ok, retorna o erro
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro do Asaas:', errorText)
      return NextResponse.json({
        success: false,
        error: `Erro ${response.status}: ${errorText}`
      }, { status: response.status })
    }

    // Para endpoints que retornam imagem (como QR Code), retorna o blob
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('image')) {
      console.log('Retornando imagem...')
      const blob = await response.blob()
      return new NextResponse(blob, {
        headers: { 'Content-Type': contentType }
      })
    }

    // Para outros endpoints, retorna JSON
    console.log('Retornando JSON...')
    const data = await response.json()
    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('Erro na requisição Asaas:', error)
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}
