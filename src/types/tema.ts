export interface TemaErp {
  id: number
  created_at: string
  nome: string | null
  perfis_id: string | null
  modelo: boolean | null
  usando: boolean | null
}

export interface TemaErpCores {
  id: number
  created_at: string
  temas_id: number | null
  modelo: string | null
  
  // Cores de Menu
  Mn_CorFundo: string | null
  Mn_CorTextoLogo: string | null
  Mn_Grupo_CorFundo: string | null
  Mn_Grupo_FonteCor: string | null
  Mn_Grupo_IconeCor: string | null
  Mn_Grupo_SetaCor: string | null
  Mn_Grupo_atual_IconeCor: string | null
  Mn_Item_CorBarra: string | null
  Mn_Item_CorBarra_Hover: string | null
  Mn_Item_CorFonte: string | null
  Mn_Item_CorFundo: string | null
  Mn_Item_CorIcone: string | null
  Mn_Item_Hover_CorFonte: string | null
  Mn_Item_Hover_CorFundo: string | null
  Mn_Item_Hover_CorIcone: string | null
  Mn_ItemAtual_CorBarra: string | null
  Mn_ItemAtual_CorFonte: string | null
  Mn_ItemAtual_CorFundo: string | null
  Mn_ItemAtual_CorIcone: string | null

  // Cores de Cabeçalho
  cab_bg: string | null
  cab_borda: string | null
  cab_icon: string | null
  cab_iconbg: string | null
  cab_text: string | null

  // Cores de Background
  bg_01: string | null
  bg_02: string | null
  bg_03: string | null
  bg_04: string | null

  // Cores de Input
  input_borda: string | null
  input_disable_bg: string | null
  borda_erro: string | null
  borda_focus: string | null
  borda_pg: string | null

  // Cores de Grid
  grid_borda: string | null
  grid_cab_bg: string | null
  grid_cab_txt: string | null

  // Cores de Status
  ativo_bg: string | null
  ativo_txt: string | null
  positivo_ok: string | null
  texto_alerta: string | null

  // Cores de Botões
  botao_acao_bg: string | null
  botao_acao_text: string | null

  // Outras Cores
  Icone: string | null
  texto: string | null
  texto_titulos: string | null
}
