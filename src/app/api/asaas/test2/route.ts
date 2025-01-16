import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('=== TESTE DIRETO COM ASAAS ===')
    
    // Usar a chave diretamente para teste
    const apiKey = '$aact_MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmRhYTZjMzkzLWY3M2MtNDExMS1iNTVlLWM2NmZiYzRiNzBhMTo6JGFhY2hfYjY2ZTc4MzYtOTNmMC00M2U0LTlhMGYtZjA3MTE4YjAzN2E1'
    
    // URL do sandbox
    const apiUrl = 'https://sandbox.asaas.com/api/v3/customers'
    console.log('URL:', apiUrl)

    // Fazer requisição para o Asaas
    console.log('Fazendo requisição...')
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey
      }
    })

    const data = await response.json()
    console.log('Resposta:', data)

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('Erro:', error)
    return NextResponse.json(
      { 
        success: false,
        error: String(error)
      },
      { status: 500 }
    )
  }
}
