import { NextResponse } from 'next/server'
import { getAsaasConfig } from '@/lib/asaas/config'

const config = getAsaasConfig()

export async function POST(req: Request) {
  try {
    console.log('=== INÍCIO DO PROCESSAMENTO DA API ROUTE (POST) ===')
    
    // Ler o corpo da requisição
    const body = await req.json()
    console.log('Corpo da requisição:', body)

    const { endpoint, method = 'POST', data } = body

    if (!endpoint) {
      console.error('Endpoint não especificado')
      return NextResponse.json(
        { error: 'Endpoint não especificado' },
        { status: 400 }
      )
    }

    // Carregar configuração
    console.log('Carregando configuração do Asaas...')
    const config = getAsaasConfig()
    console.log('Configuração carregada:', {
      baseUrl: config.baseUrl,
      apiKeyPresente: !!config.apiKey,
      apiKeyPrimeiros20: config.apiKey ? config.apiKey.substring(0, 20) : 'ausente'
    })

    // Montar URL
    const apiUrl = `${config.baseUrl}${endpoint}`
    console.log('URL completa:', apiUrl)

    // Preparar headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'access_token': config.apiKey
    }
    console.log('Headers:', {
      ...headers,
      access_token: headers.access_token ? `${headers.access_token.substring(0, 20)}...` : 'ausente'
    })

    // Preparar opções da requisição
    const fetchOptions: RequestInit = {
      method,
      headers,
      ...(data ? { body: JSON.stringify(data) } : {})
    }
    console.log('Opções da requisição:', {
      method,
      headers: {
        ...headers,
        access_token: headers.access_token ? `${headers.access_token.substring(0, 20)}...` : 'ausente'
      },
      bodyPresente: !!data
    })

    // Fazer requisição
    console.log('Iniciando chamada para o Asaas...')
    let response
    try {
      response = await fetch(apiUrl, fetchOptions)
    } catch (error: any) {
      console.error('Erro na chamada para o Asaas:', error)
      return NextResponse.json(
        { error: 'Erro ao conectar com o Asaas: ' + (error.message || 'Erro desconhecido') },
        { status: 500 }
      )
    }

    console.log('Resposta recebida:', {
      status: response.status,
      statusText: response.statusText
    })

    // Ler resposta
    let responseText
    try {
      responseText = await response.text()
      console.log('Resposta bruta:', responseText)
    } catch (error: any) {
      console.error('Erro ao ler resposta:', error)
      return NextResponse.json(
        { error: 'Erro ao ler resposta do Asaas' },
        { status: 500 }
      )
    }

    // Parse da resposta
    let responseData
    try {
      responseData = responseText ? JSON.parse(responseText) : {}
      console.log('Resposta parseada:', responseData)
    } catch (error: any) {
      console.error('Erro ao fazer parse da resposta:', error)
      return NextResponse.json(
        { error: 'Erro ao processar resposta do Asaas: ' + responseText },
        { status: 500 }
      )
    }

    // Verificar erro
    if (!response.ok) {
      console.error('Erro retornado pelo Asaas:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      })

      const errorMessage = responseData.errors?.[0]?.description || 
                         responseData.error || 
                         `Erro ${response.status}: ${response.statusText}`

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    console.log('=== FIM DO PROCESSAMENTO - SUCESSO ===')
    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error('=== ERRO NO PROCESSAMENTO ===', {
      message: error?.message,
      cause: error?.cause,
      stack: error?.stack,
      name: error?.name
    })
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error?.message
      },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    console.log('=== INÍCIO DO PROCESSAMENTO DA API ROUTE (GET) ===')
    
    const url = new URL(req.url)
    console.log('URL recebida:', url.toString())
    
    const endpoint = url.searchParams.get('endpoint')
    console.log('Endpoint solicitado:', endpoint)

    if (!endpoint) {
      console.error('Endpoint não especificado')
      return NextResponse.json(
        { error: 'Endpoint não especificado' },
        { status: 400 }
      )
    }

    // Carregar configuração
    console.log('Carregando configuração do Asaas...')
    const config = getAsaasConfig()
    console.log('Configuração carregada:', {
      baseUrl: config.baseUrl,
      apiKeyPresente: !!config.apiKey,
      apiKeyPrimeiros10: config.apiKey ? config.apiKey.substring(0, 10) : 'ausente'
    })

    // Montar URL
    const apiUrl = `${config.baseUrl}${endpoint}`
    console.log('URL completa do Asaas:', apiUrl)

    // Pegar o token do header da requisição ou da config
    const accessToken = req.headers.get('access_token') || config.apiKey
    if (!accessToken) {
      console.error('Token de acesso não encontrado')
      return NextResponse.json(
        { error: 'Token de acesso não encontrado' },
        { status: 401 }
      )
    }

    // Preparar headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'access_token': accessToken
    }
    console.log('Headers:', {
      ...headers,
      access_token: headers.access_token ? `${headers.access_token.substring(0, 20)}...` : 'ausente'
    })

    // Fazer requisição
    console.log('URL completa:', apiUrl)
    console.log('Iniciando chamada para o Asaas...')
    
    let response
    try {
      response = await fetch(apiUrl, { 
        method: 'GET',
        headers 
      })
    } catch (error: any) {
      console.error('Erro na chamada para o Asaas:', error)
      return NextResponse.json(
        { error: 'Erro ao conectar com o Asaas: ' + (error.message || 'Erro desconhecido') },
        { status: 500 }
      )
    }

    console.log('Resposta recebida:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    })

    // Ler resposta
    let responseText
    try {
      responseText = await response.text()
      console.log('Resposta bruta:', responseText)
    } catch (error: any) {
      console.error('Erro ao ler resposta:', error)
      return NextResponse.json(
        { error: 'Erro ao ler resposta do Asaas' },
        { status: 500 }
      )
    }

    // Parse da resposta
    let responseData
    try {
      responseData = responseText ? JSON.parse(responseText) : {}
      console.log('Resposta parseada:', responseData)
    } catch (error: any) {
      console.error('Erro ao fazer parse da resposta:', error)
      return NextResponse.json(
        { error: 'Erro ao processar resposta do Asaas' },
        { status: 500 }
      )
    }

    if (!response.ok) {
      console.error('Erro retornado pelo Asaas:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      })
      return NextResponse.json(
        { 
          error: responseData.errors?.[0]?.description || 
                 responseData.error || 
                 `Erro ${response.status}: ${response.statusText}` 
        },
        { status: response.status }
      )
    }

    console.log('=== FIM DO PROCESSAMENTO - SUCESSO ===')
    return NextResponse.json(responseData)
    
  } catch (error: any) {
    console.error('=== ERRO NO PROCESSAMENTO ===', {
      message: error?.message,
      cause: error?.cause,
      stack: error?.stack,
      name: error?.name
    })
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: {
          message: error?.message,
          name: error?.name
        }
      },
      { status: 500 }
    )
  }
}
