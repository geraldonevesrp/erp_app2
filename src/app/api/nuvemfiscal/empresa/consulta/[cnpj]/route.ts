import { NextRequest, NextResponse } from "next/server"
import { consultarEmpresa } from "@/lib/nuvemfiscal/api/empresa"

export async function GET(
  request: NextRequest,
  { params }: { params: { cnpj: string } }
) {
  try {
    const data = await consultarEmpresa(params.cnpj)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Erro ao buscar dados da empresa:", error)
    return NextResponse.json(
      { error: `Erro ao buscar dados da empresa: ${error.message}` },
      { status: 500 }
    )
  }
}
