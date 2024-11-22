export type TipoPerfil = 1 | 2 | 3 | 4

export interface PerfilPublico {
  nome: string | null
  foto_url: string | null
  apelido: string | null
  dominio: string | null
}

export interface Perfil extends PerfilPublico {
  id: string
  created_at: string
  tipo: number | null
  user_id: string | null
  revenda_id: string | null
  cpf_cnpj: string | null
  fone: string | null
  celular: string | null
  wathsapp: string | null
  revenda_status: number | null
  email: string | null
  nascimento: string | null
  faturamento: number | null
}

export interface PerfilUser {
  id: string
  perfil_id: string
  user_id: string
  created_at: string
  updated_at: string
}

export const PERFIL_TIPOS = {
  PESSOA: 1,
  REVENDA: 2,
  ERP: 3,
  MASTER: 4,
} as const

export const PERFIL_ROTAS = {
  [PERFIL_TIPOS.PESSOA]: '/pessoa',
  [PERFIL_TIPOS.REVENDA]: '/revendas',
  [PERFIL_TIPOS.ERP]: '/erp',
  [PERFIL_TIPOS.MASTER]: '/master',
} as const
