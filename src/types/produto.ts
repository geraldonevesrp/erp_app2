export interface Produto {
  id: number | null
  created_at: string | null
  perfis_id: string | null
  nome: string | null
  descricao: string | null
  sku: string | null
  cod_barras: string | null
  cod_sequencial: number | null
  sub_codigo_sequencial: number | null
  ref_fornecedor: string | null

  // Categorização
  prod_tipos_id: number | null
  prod_categorias_id: number | null
  prod_subcategorias_id: number | null
  prod_generos_id: number | null
  prod_marcas_id: number | null

  // Variações
  grade_de: number | null
  grade_de_id: number | null
  prod_variacao1_id: number | null
  variacao1: string | null
  prod_variacao2_id: number | null
  variacao2: string | null

  // Unidades
  unid_compra: number | null
  unid_venda: number | null
  unid_fator_conversao: number | null

  // Pesos
  peso_bruto: number | null
  peso_liquido: number | null

  // Estoque
  estoque_ideal: number | null
  estoque_negativo: boolean | null
  controlado_lote: boolean | null
  validade: string | null

  // Valores
  custo_ultima_comp: number | null
  data_ultima_compra: string | null
  data_ultima_venda: string | null
  comissao: number | null
  cashback: number | null
  cashback_p: number | null

  // Flags
  ativo: boolean | null
  composto: boolean | null
  food: boolean | null
  visivel_catalogo: boolean | null
}

export interface ProdutoView extends Produto {
  // Nomes das relações
  prod_tipo: string | null
  prod_categoria: string | null
  prod_subcategoria: string | null
  prod_genero: string | null
  prod_marca: string | null
  unid_compra_nome: string | null
  unid_venda_nome: string | null
  perfis_apelido: string | null
}

export interface ProdutoGet extends Produto {
  // Campos adicionais da view v_produtos_get
  produto_id: number | null
  produto_nome: string | null
  produto_created_at: string | null
  tabela_preco_item_id: number | null
  tabela_preco_item_created_at: string | null
  tabelas_precos_id: number | null

  // Valores e impostos
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

  // Dados extras
  depositos: Record<string, any> | null
  imagens: Record<string, any> | null
}

export interface ProdutoTipo {
  id: number
  created_at: string
  nome: string | null
  cor: string | null
  ordem: number | null
  perfis_id: string | null
}

export interface ProdutoCategoria {
  id: number
  created_at: string
  nome: string | null
  cor: string | null
  ordem: number | null
  perfis_id: string | null
}

export interface ProdutoSubcategoria {
  id: number
  created_at: string
  nome: string | null
  cor: string | null
  ordem: number | null
  perfis_id: string | null
  prod_categorias_id: number | null
}

export interface ProdutoGenero {
  id: number
  created_at: string
  nome: string | null
  cor: string | null
  ordem: number | null
  perfis_id: string | null
}

export interface ProdutoMarca {
  id: number
  created_at: string
  nome: string | null
  cor: string | null
  ordem: number | null
  perfis_id: string | null
}

export interface ProdutoVariacao {
  id: number
  created_at: string
  nome: string | null
  cor: string | null
  ordem: number | null
  perfis_id: string | null
}
