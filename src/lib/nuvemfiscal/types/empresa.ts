export interface Empresa {
  cnpj: string
  razao_social: string
  nome_fantasia?: string
  data_fundacao?: string
  tipo_logradouro?: string
  logradouro?: string
  numero?: string
  complemento?: string
  cep?: string
  bairro?: string
  municipio?: {
    codigo_ibge?: string
    nome?: string
  }
  uf?: string
  pais?: {
    codigo_ibge?: string
    nome?: string
  }
  email?: string
  telefone?: string
  porte?: string
  natureza_juridica?: {
    codigo?: string
    descricao?: string
  }
  capital_social?: number
  situacao_cadastral?: {
    codigo?: string
    data?: string
    motivo?: string
  }
  atividade_principal?: {
    codigo?: string
    descricao?: string
  }
  atividades_secundarias?: Array<{
    codigo?: string
    descricao?: string
  }>
  socios?: Array<{
    cpf_cnpj?: string
    nome?: string
    qualificacao?: string
  }>
}
