import { NextResponse } from 'next/server'
import { NuvemfiscalApi } from '@/lib/nuvemfiscal'

export async function GET(
  request: Request,
  { params }: { params: { cnpj: string } }
) {
  try {
    const cnpj = params.cnpj.replace(/\D/g, '')
    
    if (cnpj.length !== 14) {
      return NextResponse.json(
        { error: 'CNPJ inválido' },
        { status: 400 }
      )
    }

    const nuvemFiscal = new NuvemfiscalApi()
    const empresa = await nuvemFiscal.consultarCNPJ(cnpj)

    if (!empresa) {
      return NextResponse.json(
        { error: 'CNPJ não encontrado' },
        { status: 404 }
      )
    }

    // Log detalhado dos dados da empresa
    console.log('Empresa (dados brutos):', empresa)

    // Retorna todos os dados da empresa
    return NextResponse.json(empresa)
  } catch (error: any) {
    console.error('Erro ao consultar CNPJ:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao consultar CNPJ' },
      { status: error.message === 'CNPJ não encontrado' ? 404 : 500 }
    )
  }
}
