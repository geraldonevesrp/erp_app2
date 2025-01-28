export type TipoRevenda = 1 | 2 | 3 | 4

export const REVENDA_TIPOS = {
  PADRAO: 1,
  PREMIUM: 2,
  ENTERPRISE: 3,
  CUSTOM: 4,
} as const

export const REVENDA_STATUS = {
  INATIVO: 0,
  ATIVO: 1,
  BLOQUEADO: 2,
  PENDENTE: 3,
} as const

export interface RevendasConfig {
  id: number
  termo_uso_erps: string | null
}

export interface Revenda {
  id: string
  created_at: string
  updated_at: string
  tipo: TipoRevenda | null
  user_id: string | null
  cpf_cnpj: string | null
  fone: string | null
  whatsapp: string | null
  status: number | null
  nascimento: string | null
  faturamento: number | null
}

export interface RevendaStatus {
  id: number
  status: string | null
}

export interface RevendaTipo {
  id: number
  tipo: string | null
  created_at: string
}
