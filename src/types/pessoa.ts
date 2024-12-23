export interface PessoaContato {
  id: number | string
  pessoa_id: number
  contato: string
  telefone: string
  email: string
  isNew?: boolean
}

export interface PessoaEndereco {
  id: number | string
  pessoa_id: number
  titulo: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
  principal: boolean
  isNew?: boolean
}

export interface Grupo {
  id: number
  perfis_id: number
  grupo: string
}

export interface SubGrupo {
  id: number
  perfis_id: number
  grupos_id: number
  subgrupo: string
}

export interface PessoaTelefone {
  id?: number
  tipo: string
  numero: string
  pessoa_id: number
  _isNew?: boolean
  _isDeleted?: boolean
  _tempId?: number
}

export interface PessoaRedeSocial {
  id?: number
  pessoa_id: number
  nome: string
  link: string
  _isNew?: boolean
  _isDeleted?: boolean
  _tempId?: number
}

export interface PessoaAnexo {
  id?: number
  pessoa_id?: number
  nome?: string
  descricao?: string
  arquivo?: string
  download?: string
  download_url?: string
  created_at?: string
  _isNew?: boolean
  _isDeleted?: boolean
  _tempId?: number
}

export interface Pessoa {
  id: number
  created_at?: string
  perfis_id: number
  nome_razao: string
  apelido: string
  tipo: number
  foto_url?: string
  grupos_ids?: number[]
  subgrupos_ids?: number[]
  pessoas_tipos?: number[]
  pessoas_contatos?: PessoaContato[]
  pessoas_telefones?: PessoaTelefone[]
  pessoas_redes_sociais?: PessoaRedeSocial[]
  pessoas_anexos?: PessoaAnexo[]
  genero?: string
  cpf_cnpj?: string
  rg_ie?: string
  IM?: string
  profissoes_id?: number
  nascimento?: string
  renda?: string
  obs?: string
  indIEDest?: number
  ISUF?: string
  status_id?: number
  ramo_id?: number
  atividades_ids?: number[]
  natureza_juridica?: any
  porte?: any
  situacao_cadastral?: any
  atividade_principal?: any
  atividades_secundarias?: any
  socios?: any
  capital_social?: number
  data_inicio_atividades?: string
  matriz?: boolean
}
