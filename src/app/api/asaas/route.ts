import { NextResponse } from 'next/server'
import { getAsaasConfig } from '@/lib/asaas/config'

const config = getAsaasConfig()

export async function POST(req: Request) {
  try {
    console.log('=== INÍCIO DO PROCESSAMENTO DA API ROUTE ===')
    const { endpoint, data, method = 'POST' } = await req.json()

    console.log('Endpoint solicitado:', endpoint)
    console.log('Método:', method)
    console.log('Dados recebidos:', JSON.stringify(data, null, 2))
    console.log('Configuração:', {
      baseUrl: config.baseUrl,
      apiKey: config.apiKey ? 'Presente' : 'Ausente'
    })

    const url = `${config.baseUrl}${endpoint}`
    console.log('URL completa:', url)

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'access_token': config.apiKey
    }
    console.log('Headers:', { ...headers, 'access_token': '****' })

    console.log('Iniciando chamada para Asaas...')
    const response = await fetch(url, {
      method,
      headers,
      ...(method === 'POST' && { body: JSON.stringify(data) })
    })

    console.log('Status da resposta do Asaas:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    })

    const responseText = await response.text() 
    console.log('Resposta bruta do Asaas:', responseText)

    let responseData
    try {
      responseData = JSON.parse(responseText) 
      console.log('Resposta do Asaas (JSON):', JSON.stringify(responseData, null, 2))
    } catch (e) {
      console.error('Erro ao fazer parse da resposta:', e)
      return NextResponse.json(
        { error: 'Erro ao processar resposta do Asaas' },
        { status: 500 }
      )
    }

    if (!response.ok) {
      console.error('Erro retornado pelo Asaas:', responseData)
      return NextResponse.json(
        { error: responseData },
        { status: response.status }
      )
    }

    console.log('=== FIM DO PROCESSAMENTO - SUCESSO ===')
    return NextResponse.json(responseData)

  } catch (error) {
    console.error('=== ERRO NO PROCESSAMENTO ===')
    console.error('Detalhes do erro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const endpoint = url.searchParams.get('endpoint')

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint não especificado' },
        { status: 400 }
      )
    }

    console.log('API Route - Requisição GET recebida:', {
      endpoint,
      config: {
        baseUrl: config.baseUrl,
        apiKey: config.apiKey.slice(0, 10) + '...' 
      }
    })

    const apiUrl = `${config.baseUrl}${endpoint}`
    console.log('API Route - URL completa:', apiUrl)

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'access_token': config.apiKey
      }
    })

    console.log('API Route - Status da resposta:', {
      status: response.status,
      statusText: response.statusText
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('API Route - Erro na resposta do Asaas:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      })
      return NextResponse.json(
        { error: responseData.errors?.[0]?.description || 'Erro na chamada do Asaas' },
        { status: response.status }
      )
    }

    console.log('API Route - Resposta com sucesso:', responseData)
    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error('API Route - Erro ao processar requisição:', {
      message: error.message,
      cause: error.cause,
      stack: error.stack
    })
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
