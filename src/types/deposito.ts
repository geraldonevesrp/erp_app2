export interface Deposito {
  id: number
  created_at: string
  nome: string | null
  perfis_id: string | null
}

export interface DepositoProduto {
  id: number
  created_at: string
  depositos_id: number | null
  produtos_id: number | null
  quantidade: number | null
  qt_reservada: number | null
  estoque_minimo: number | null
  local_estoque: string | null
}

export interface DepositoProdutoView extends DepositoProduto {
  deposito_nome: string | null
  produto_nome: string | null
}
