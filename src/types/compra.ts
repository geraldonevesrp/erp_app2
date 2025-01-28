export interface Compra {
  id: number
  created_at: string
  data: string | null
  perfis_id: string | null
  empresa_id: number | null
  fornecedor_id: number | null
  deposito_id: number | null
  numero: number | null
  status_id: number | null
  qt_itens: number | null
  qt_produtos: number | null
  valor_total: number | null
  orcamento_prazo_ate: string | null
}

export interface CompraView extends Compra {
  empresa_razao_social: string | null
  empresa_fantasia: string | null
  empresa_cnpj: string | null
  fornecedor_nome_razao: string | null
  fornecedor_apelido: string | null
  fornecedor_cpf_cnpj: string | null
  fornecedor_numero_nf: string | null
  fornecedor_num_pedido: string | null
}

export interface CompraStatus {
  id: number
  nome: string
  cor: string
  ordem: number
}
