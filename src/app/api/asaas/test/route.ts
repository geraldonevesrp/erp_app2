import { NextResponse } from 'next/server'
import { getAsaasConfig } from '@/lib/asaas/config'

export async function GET() {
  try {
    console.log('=== TESTE DE CONEXÃO COM ASAAS ===')
    
    // Carregar configuração
    console.log('Carregando configuração do Asaas...')
    const config = getAsaasConfig()
    console.log('Configuração carregada')
    
    // Montar URL para listar clientes
    const apiUrl = `${config.baseUrl}/customers`
    console.log('URL:', apiUrl)

    // Preparar headers
    const headers = {
      'Content-Type': 'application/json',
      'access_token': config.apiKey
    }
    console.log('Headers configurados')

    // Fazer requisição para o Asaas
    console.log('Fazendo requisição para o Asaas...')
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers
    })

    const data = await response.json()
    console.log('Resposta do Asaas:', data)

    return NextResponse.json({
      success: true,
      message: 'Conexão com Asaas estabelecida com sucesso',
      data
    })

  } catch (error) {
    console.error('Erro ao testar conexão:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro ao testar conexão com Asaas',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
