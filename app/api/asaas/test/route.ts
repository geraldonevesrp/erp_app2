import { NextResponse } from 'next/server'
import { asaasClient } from '../client'

const API_KEY = '$aact_MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjI3ZThmZGMxLTIxOWQtNDg1NS05YjRmLTY3OGIwYzNiZmM4OTo6JGFhY2hfZTE0YTY3Y2EtN2JmMS00YWNkLWE3NDItZTQ2YWEyOGZiZTY3'

export async function GET() {
  try {
    console.log('=== TESTE DE CONEXÃO COM O ASAAS ===')
    
    const response = await asaasClient.listCustomers()

    if (!response.ok) {
      const text = await response.text()
      return NextResponse.json({
        success: false,
        error: `Erro ${response.status}: ${text}`
      }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Erro:', error)
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}
