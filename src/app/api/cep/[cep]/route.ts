import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { cep: string } }
) {
  try {
    const cep = params.cep.replace(/\D/g, '')
    
    if (cep.length !== 8) {
      return NextResponse.json(
        { error: 'CEP inválido' },
        { status: 400 }
      )
    }

    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    const data = await response.json()

    if (data.erro) {
      return NextResponse.json(
        { error: 'CEP não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Erro ao consultar CEP:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao consultar CEP' },
      { status: 500 }
    )
  }
}
