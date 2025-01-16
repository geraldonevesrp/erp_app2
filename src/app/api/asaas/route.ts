import { NextResponse } from 'next/server'
import { getAsaasConfig } from '@/lib/asaas/config'

export async function POST(req: Request) {
  try {
    console.log('=== INÍCIO DO PROCESSAMENTO DA API ROUTE (POST) ===')
    
    // Ler o corpo da requisição
    const body = await req.json()
    console.log('Corpo da requisição:', body)

    const { endpoint, data } = body

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
    
    if (!config.apiKey) {
      console.error('API Key não encontrada')
      return NextResponse.json(
        { error: 'API Key não encontrada' },
        { status: 500 }
      )
    }

    // Montar URL
    const apiUrl = `${config.baseUrl}${endpoint}`
    console.log('URL completa:', apiUrl)

    // Preparar headers
    const headers = {
      'Content-Type': 'application/json',
      'access_token': config.apiKey
    }

    // Fazer requisição para o Asaas
    console.log('Fazendo requisição para o Asaas...')
    console.log('Headers:', headers)
    console.log('Body:', data)

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    })

    const responseData = await response.json()
    console.log('Resposta do Asaas:', responseData)

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Erro ao processar requisição:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    // Obter a URL da requisição
    const url = new URL(req.url)
    
    // Extrair o endpoint dos parâmetros da query
    const endpoint = url.searchParams.get('endpoint')
    
    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint não especificado' },
        { status: 400 }
      )
    }

    // Carregar configuração
    const config = getAsaasConfig()
    
    if (!config.apiKey) {
      return NextResponse.json(
        { error: 'API Key não encontrada' },
        { status: 500 }
      )
    }

    // Montar URL
    const apiUrl = `${config.baseUrl}${endpoint}`

    // Preparar headers
    const headers = {
      'Content-Type': 'application/json',
      'access_token': config.apiKey
    }

    // Fazer requisição para o Asaas
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers
    })

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Erro ao processar requisição:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
