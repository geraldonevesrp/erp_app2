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

export interface Pessoa {
  id: number
  perfis_id: number
  apelido: string
  nome_razao: string
  cpf_cnpj: string
  genero_porte: string
  grupos_ids: number[]
  subgrupos_ids: number[]
  pessoas_contatos: PessoaContato[]
  pessoas_enderecos: PessoaEndereco[]
  foto_url?: string
}
