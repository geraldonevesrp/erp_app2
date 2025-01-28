export interface FiscalCEST {
  id: number | null
  ncm: string | null
  cod_cest: string | null
  descricao: string | null
  cod_cest_descricao: string | null
}

export interface FiscalCFOP {
  id: number | null
  cfop: string | null
  descricao_resumida: string | null
  cfop_descricao: string | null
  indnfe: number | null
  indcomunica: number | null
  inddevol: number | null
  indtransp: number | null
}

export interface FiscalCSOSN {
  id: number | null
  created_at: string | null
  codigo: string | null
  descricao: string | null
  codigo_descricao: string | null
}

export interface FiscalNCM {
  id?: number
  ncm: string | null
  numero: string | null
  Descricao: string | null
  descricao_completa: string | null
  ncm_descricao: string | null
  Ano: string | null
  Ato_Legal: string | null
  Data_Inicio: string | null
  Data_Fim: string | null
}

export interface FiscalOrigemProduto {
  id: number | null
  codigo: string | null
  descricao: string | null
  codigo_descricao: string | null
}
