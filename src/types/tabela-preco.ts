export interface TabelaPreco {
  id: number
  created_at: string
  nome: string | null
  padrao: boolean | null
  perfis_id: string | null
}

export interface TabelaPrecoItem {
  id: number
  created_at: string
  tabelas_precos_id: number | null
  produtos_id: number | null
  custo: number | null
  custo_total: number | null
  preco: number | null
  margem_lucro: number | null
  margem_lucro_p: number | null
  frete: number | null
  frete_p: number | null
  seguro: number | null
  seguro_p: number | null
  despesas: number | null
  despesas_p: number | null
  ipi: number | null
  ipi_p: number | null
  icms: number | null
  icms_p: number | null
  icms_st: number | null
  icms_st_p: number | null
  fcp_st: number | null
  fcp_st_p: number | null
}
