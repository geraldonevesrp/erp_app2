export interface PessoaContato {
  id: number
  pessoa_id: number | null
  contato: string | null
  telefone: string | null
  celular: string | null
  email: string | null
  cargo: string | null
  departamento: string | null
  zap: boolean | null
  created_at: string
  _isNew?: boolean
  _isDeleted?: boolean
  _tempId?: number
}

export interface PessoaEndereco {
  id: number | null
  created_at: string | null
  titulo: string | null
  principal: boolean | null
  cep: string | null
  logradouro: string | null
  numero: string | null
  complemento: string | null
  bairro: string | null
  localidade: string | null
  uf: string | null
  ddd: string | null
  ibge: string | null
  gia: string | null
  siafi: string | null
  geo_point: string | null
}

export interface Grupo {
  id: number
  perfis_id: string
  grupo: string | null
  created_at: string
}

export interface SubGrupo {
  id: number
  perfis_id: string
  grupos_id: number
  subgrupo: string | null
  created_at: string
}

export interface PessoaTelefone {
  id: number
  pessoa_id: number
  numero: string | null
  tipo: string | null
  created_at: string
  _isNew?: boolean
  _isDeleted?: boolean
  _tempId?: number
}

export interface PessoaTelefoneTipo {
  tipo: string
}

export interface PessoaRedeSocial {
  id: number
  pessoa_id: number | null
  nome: string | null
  link: string | null
  created_at: string
  _isNew?: boolean
  _isDeleted?: boolean
  _tempId?: number
}

export interface PessoaAnexo {
  id: number
  pessoa_id: number
  nome: string | null
  descricao: string | null
  arquivo: string | null
  download: string | null
  download_url?: string
  created_at: string
  _isNew?: boolean
  _isDeleted?: boolean
  _tempId?: number
}

export interface PessoaAtividade {
  id: number
  created_at: string
  nome: string | null
  cor: string | null
  ordem: number | null
  perfis_id: string | null
}

export interface PessoaTipo {
  id: number
  tipo: string | null
  created_at: string
}

export interface NaturezaJuridica {
  codigo: string
  descricao: string
}

export interface Porte {
  codigo: string
  descricao: string
}

export interface SituacaoCadastral {
  codigo: string
  data: string
  motivo: string
}

export interface AtividadePrincipal {
  codigo: string
  descricao: string
}

export interface AtividadeSecundaria {
  codigo: string
  descricao: string
}

export interface Socio {
  nome: string
  qualificacao: string
  pais_origem?: string | null
  nome_rep_legal?: string | null
  qual_rep_legal?: string | null
}

export interface PessoaEmailTipo {
  tipo: string
}

export interface PessoaEmail {
  id: number
  pessoa_id: number
  email: string
  responsavel: string | null
  tipo: string | null
  created_at: string
  _isNew?: boolean
  _isDeleted?: boolean
  _tempId?: number
}

export interface PessoaRamo {
  id: number
  ramo: string | null
}

export interface PessoaStatus {
  id: number
  status: string | null
}

export interface PessoaGrupo {
  id: number
  created_at: string
  nome: string | null
  cor: string | null
  ordem: number | null
  perfis_id: string | null
}

export interface Pessoa {
  id: number | null
  created_at: string | null
  perfis_id: string | null
  nome_razao: string | null
  apelido: string | null
  tipo: string | null
  cpf_cnpj: string | null
  foto_url: string | null
  genero: string | null
  grupos: string[] | null
  grupos_ids: number[] | null
  subgrupos: string[] | null
  subgrupos_ids: number[] | null
  atividades: string[] | null
  atividades_ids: number[] | null
  emails: string[] | null
  telefones: string[] | null
  tipospessoas: string[] | null
  pessoas_tipos: number[] | null
  endereco_id: number | null
  endereco_created_at: string | null
  endereco_titulo: string | null
  endereco_principal: boolean | null
  endereco_cep: string | null
  endereco_logradouro: string | null
  endereco_numero: string | null
  endereco_complemento: string | null
  endereco_bairro: string | null
  endereco_localidade: string | null
  endereco_uf: string | null
  endereco_ddd: string | null
  endereco_ibge: string | null
  endereco_gia: string | null
  endereco_siafi: string | null
  endereco_geo_point: string | null
  rg_ie: string | null
  IM: string | null
  ISUF: string | null
  indIEDest: number | null
  profissoes_id: number | null
  ramo_id: number | null
  ramo: string | null
  status_id: number | null
  renda: string | null
  nascimento: string | null
  obs: string | null
}
