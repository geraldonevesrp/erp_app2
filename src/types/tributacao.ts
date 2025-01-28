export interface Tributacao {
  id: number
  created_at: string
  nome: string | null
  perfis_id: string | null
  icms: Record<string, any> | null
  ipi: Record<string, any> | null
  pis: Record<string, any> | null
  cofins: Record<string, any> | null
}

export interface TributacaoICMS {
  cst: string
  aliquota: number
  reducao_base: number
  diferimento: number
  base_calculo: number
  st_aliquota: number
  st_base_calculo: number
  st_reducao_base: number
  st_margem_valor_agregado: number
  st_pauta: number
  motivo_desoneracao: string
}

export interface TributacaoIPI {
  cst: string
  aliquota: number
  codigo_enquadramento: string
}

export interface TributacaoPIS {
  cst: string
  aliquota: number
  base_calculo: number
}

export interface TributacaoCOFINS {
  cst: string
  aliquota: number
  base_calculo: number
}
