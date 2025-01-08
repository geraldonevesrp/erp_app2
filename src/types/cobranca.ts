export interface Cobranca {
  id?: number
  created_at?: Date
  cobrancas_tipos_id?: number
  asaas?: any
  sacado_perfil_id?: string
  cedente_perfil_id?: string
  sacado_empresa_id?: number
  cedente_pessoa_id?: number
  valor?: number
  vencimento?: Date
  pago_em?: Date
  paga?: boolean
  erp_assinaturas_id?: number
}
