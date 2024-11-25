import { nuvemFiscalFetch } from "../config"
import type { Empresa } from "../types/empresa"

export async function consultarEmpresa(cnpj: string): Promise<Empresa> {
  // Remove caracteres não numéricos do CNPJ
  const cnpjLimpo = cnpj.replace(/\D/g, "")
  return nuvemFiscalFetch(`/cnpj/${cnpjLimpo}`)
}

export async function listarEmpresas(params?: {
  top?: number
  skip?: number
  filter?: string
  orderby?: string
}) {
  const queryParams = new URLSearchParams()
  
  if (params?.top) queryParams.append("$top", params.top.toString())
  if (params?.skip) queryParams.append("$skip", params.skip.toString())
  if (params?.filter) queryParams.append("$filter", params.filter)
  if (params?.orderby) queryParams.append("$orderby", params.orderby)

  const queryString = queryParams.toString()
  return nuvemFiscalFetch(`/cnpj${queryString ? `?${queryString}` : ""}`)
}

// Outros endpoints relacionados a empresas podem ser adicionados aqui
