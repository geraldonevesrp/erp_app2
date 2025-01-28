import { NextResponse } from 'next/server'
import { asaasClient } from '@/lib/asaas/client'

export async function GET() {
  try {
    console.log('=== INÍCIO DO TESTE DE LISTAGEM DE CLIENTES ===')
    
    const response = await asaasClient.request('/customers')

    console.log('Status da resposta:', response.status)
    console.log('Headers:', response.headers)
    
    const responseText = await response.text()
    console.log('Resposta completa:', responseText)

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `Erro ao listar clientes: ${response.status} - ${responseText}`,
        status: response.status,
        data: responseText
      }, { status: response.status })
    }

    // Tenta fazer o parse do JSON apenas se a resposta for bem sucedida
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      return NextResponse.json({
        success: false,
        error: 'Erro ao fazer parse da resposta',
        status: response.status,
        data: responseText
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Clientes listados com sucesso',
      status: response.status,
      data
    })
  } catch (error) {
    console.error('Erro na listagem de clientes:', error)
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}
