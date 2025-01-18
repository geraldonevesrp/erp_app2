import { NextRequest } from 'next/server'
import { NuvemfiscalApi } from '@/lib/nuvemfiscal'

export async function GET(request: NextRequest, { params }: { params: { cnpj: string } }) {
  try {
    const cnpj = await Promise.resolve(params.cnpj)
    const nuvemFiscal = new NuvemfiscalApi()
    const data = await nuvemFiscal.consultarCNPJ(cnpj)
    return Response.json(data)
  } catch (error) {
    console.error('Erro ao consultar CNPJ:', error)
    return new Response(
      JSON.stringify({ error: 'Erro ao consultar CNPJ' }), 
      { status: 500 }
    )
  }
}
