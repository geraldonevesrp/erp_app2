import { NextResponse } from 'next/server'
import { getAsaasConfig } from '@/lib/asaas/config'

const config = getAsaasConfig()

export async function GET() {
  try {
    console.log('=== TESTE DE CONEXÃO COM ASAAS ===')
    console.log('Configuração:', {
      baseUrl: config.baseUrl,
      apiKey: config.apiKey ? 'Presente' : 'Ausente'
    })

    const url = `${config.baseUrl}/customers`
    console.log('URL:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'access_token': config.apiKey
      }
    })

    console.log('Status da resposta:', response.status, response.statusText)
    console.log('Headers:', Object.fromEntries(response.headers.entries()))

    const responseText = await response.text()
    console.log('Resposta bruta:', responseText)

    let responseData
    try {
      responseData = JSON.parse(responseText)
      console.log('Resposta (JSON):', responseData)
    } catch (e) {
      console.error('Erro ao fazer parse da resposta:', e)
      return NextResponse.json(
        { error: 'Erro ao processar resposta do Asaas' },
        { status: 500 }
      )
    }

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: 'Erro na conexão com Asaas',
          details: responseData
        },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Conexão com Asaas estabelecida com sucesso',
      data: responseData
    })

  } catch (error: any) {
    console.error('Erro no teste:', error)
    return NextResponse.json(
      { error: 'Erro ao testar conexão com Asaas: ' + error.message },
      { status: 500 }
    )
  }
}
