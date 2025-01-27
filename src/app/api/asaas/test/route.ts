import { NextResponse } from 'next/server'
import { asaasClient } from '@/lib/asaas/client'

export async function GET() {
  try {
    // Coleta as configurações atuais
    const config = {
      NODE_ENV: process.env.NODE_ENV,
      ASAAS_ENV: process.env.ASAAS_ENV,
      ASAAS_API_KEY: process.env.ASAAS_API_KEY, // Mostra a chave completa
      ASAAS_WALLET_ID: process.env.ASAAS_WALLET_ID,
      baseUrl: process.env.ASAAS_ENV === 'production' 
        ? 'https://api.asaas.com/v3'
        : 'https://sandbox.asaas.com/api/v3'
    }

    // Usa o endpoint /customers com limit=1 apenas para testar a autenticação
    const response = await asaasClient.makeRequest('/customers?limit=1')
    
    const responseText = await response.text()
    console.log('=== RESPOSTA DO ASAAS ===')
    console.log('Status:', response.status)
    console.log('Status Text:', response.statusText)
    console.log('Resposta:', responseText)

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `Erro de autenticação: ${response.status} - ${responseText}`,
        status: response.status,
        statusText: response.statusText,
        data: responseText,
        config // Inclui as configurações na resposta
      }, { status: response.status })
    }

    // Tenta fazer o parse do JSON apenas se a resposta for bem sucedida
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error('Erro ao fazer parse da resposta:', e)
      console.error('Resposta que causou o erro:', responseText)
      return NextResponse.json({
        success: false,
        error: 'Erro ao fazer parse da resposta',
        status: response.status,
        statusText: response.statusText,
        data: responseText,
        config // Inclui as configurações na resposta
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Conexão com Asaas estabelecida com sucesso',
      status: response.status,
      statusText: response.statusText,
      data,
      config // Inclui as configurações na resposta
    })
  } catch (error) {
    console.error('Erro na conexão:', error)
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}
