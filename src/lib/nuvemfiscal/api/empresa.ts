import { nuvemFiscalFetch } from '../config';

/**
 * Interface que representa uma empresa na API da Nuvem Fiscal
 * @see https://dev.nuvemfiscal.com.br/docs/api/#tag/Empresa/paths/~1empresas~1{cpf_cnpj}/get
 */
export interface EmpresaInfo {
  /** CPF ou CNPJ da empresa */
  cpf_cnpj: string;
  /** Data de criação do registro */
  created_at: string;
  /** Data da última atualização */
  updated_at: string;
  /** Inscrição Estadual */
  inscricao_estadual?: string;
  /** Inscrição Municipal */
  inscricao_municipal?: string;
  /** Nome ou Razão Social */
  nome_razao_social: string;
  /** Nome Fantasia */
  nome_fantasia?: string;
  /** Telefone */
  fone?: string;
  /** Email */
  email?: string;
  /** Endereço */
  endereco?: {
    logradouro: string;
    numero: string;
    bairro: string;
    codigo_municipio: string;
    cidade: string;
    uf: string;
    codigo_pais: string;
    pais: string;
    cep: string;
  };
}

// Consulta dados públicos de uma empresa pelo CNPJ
export async function consultarEmpresa(cnpj: string): Promise<EmpresaInfo> {
  // Remove caracteres não numéricos do CNPJ
  const cnpjLimpo = cnpj.replace(/\D/g, "")
  return nuvemFiscalFetch(`/cnpj/${cnpjLimpo}`)
}

/**
 * Consulta uma empresa cadastrada na Nuvem Fiscal
 * @param cnpj CNPJ da empresa
 * @returns Informações da empresa
 * @throws 404 se a empresa não estiver cadastrada
 */
export async function consultarEmpresaCadastrada(cnpj: string): Promise<EmpresaInfo> {
  try {
    console.log('Consultando empresa:', cnpj);
    const cnpjLimpo = cnpj.replace(/\D/g, "")
    return await nuvemFiscalFetch(`/empresas/${cnpjLimpo}`);
  } catch (error: any) {
    console.error('Erro ao consultar empresa:', error);
    throw error;
  }
}

/**
 * Cadastra uma nova empresa na Nuvem Fiscal
 * @param cnpj CNPJ da empresa
 * @returns Informações da empresa cadastrada
 */
export async function cadastrarEmpresa(cnpj: string): Promise<EmpresaInfo> {
  try {
    console.log('Cadastrando empresa:', cnpj);
    const cnpjLimpo = cnpj.replace(/\D/g, "")
    return await nuvemFiscalFetch('/empresas', {
      method: 'POST',
      body: JSON.stringify({ cpf_cnpj: cnpjLimpo })
    });
  } catch (error: any) {
    console.error('Erro ao cadastrar empresa:', error);
    throw error;
  }
}

/**
 * Lista todas as empresas cadastradas na Nuvem Fiscal
 * @param params Parâmetros de consulta
 * @returns Lista de empresas
 */
export async function listarEmpresas(params?: {
  top?: number
  skip?: number
  filter?: string
  orderby?: string
}): Promise<EmpresaInfo[]> {
  try {
    console.log('Listando empresas');
    const queryParams = new URLSearchParams()
  
    if (params?.top) queryParams.append("$top", params.top.toString())
    if (params?.skip) queryParams.append("$skip", params.skip.toString())
    if (params?.filter) queryParams.append("$filter", params.filter)
    if (params?.orderby) queryParams.append("$orderby", params.orderby)

    const queryString = queryParams.toString()
    return await nuvemFiscalFetch(`/empresas${queryString ? `?${queryString}` : ""}`);
  } catch (error: any) {
    console.error('Erro ao listar empresas:', error);
    throw error;
  }
}

/**
 * Remove uma empresa da Nuvem Fiscal
 * @param cnpj CNPJ da empresa
 */
export async function excluirEmpresa(cnpj: string): Promise<void> {
  try {
    console.log('Excluindo empresa:', cnpj);
    const cnpjLimpo = cnpj.replace(/\D/g, "")
    await nuvemFiscalFetch(`/empresas/${cnpjLimpo}`, {
      method: 'DELETE'
    });
  } catch (error: any) {
    console.error('Erro ao excluir empresa:', error);
    throw error;
  }
}

/**
 * Lista certificados de uma empresa
 * @param cnpj CNPJ da empresa
 */
export async function listarCertificados(cnpj: string) {
  const cnpjLimpo = cnpj.replace(/\D/g, "")
  return nuvemFiscalFetch(`/empresas/${cnpjLimpo}/certificados`)
}
