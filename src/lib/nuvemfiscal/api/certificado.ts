import { nuvemFiscalFetch } from '../config';

/**
 * Interface para envio de certificado digital
 */
export interface CertificadoDigital {
  nome: string;
  arquivo: string; // base64 do arquivo .pfx
  senha: string;
}

/**
 * Interface que representa um certificado digital retornado pela API
 * @see https://dev.nuvemfiscal.com.br/docs/api/#tag/Empresa/paths/~1empresas~1{cpf_cnpj}~1certificado/get
 */
export interface CertificadoInfo {
  /** Número de série do certificado */
  serial_number: string;
  /** Nome do emissor no formato DN (Distinguished Name) */
  issuer_name: string;
  /** Data de início da validade no formato ISO 8601 */
  not_valid_before: string;
  /** Data de fim da validade no formato ISO 8601 */
  not_valid_after: string;
  /** Impressão digital (hash SHA-1) do certificado */
  thumbprint: string;
  /** Nome do titular no formato DN (Distinguished Name) */
  subject_name: string;
  /** CPF/CNPJ do titular do certificado */
  cpf_cnpj: string;
  /** Nome/Razão Social do titular do certificado */
  nome_razao_social: string;
}

/**
 * Consulta o certificado digital de uma empresa
 * @param cnpj CNPJ da empresa
 * @returns Informações do certificado ou null se não encontrado
 */
export async function consultarCertificado(cnpj: string): Promise<CertificadoInfo | null> {
  try {
    console.log('Consultando certificado para empresa:', cnpj);
    // Endpoint correto conforme documentação
    const response = await nuvemFiscalFetch(`/empresas/${cnpj}/certificado`);
    console.log('Resposta da API:', response);
    return response;
  } catch (error: any) {
    console.error('Erro ao consultar certificado:', error);
    // Se for 404, retorna null
    if (error.status === 404 || error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Faz upload de um novo certificado digital para uma empresa
 * @param cnpj CNPJ da empresa
 * @param certificado Dados do certificado a ser enviado
 * @returns Informações do certificado após upload
 */
export async function uploadCertificado(cnpj: string, certificado: CertificadoDigital): Promise<CertificadoInfo> {
  try {
    console.log('Fazendo upload de certificado para empresa:', cnpj);
    return await nuvemFiscalFetch(`/empresas/${cnpj}/certificado`, {
      method: 'POST',
      body: JSON.stringify(certificado)
    });
  } catch (error: any) {
    console.error('Erro ao fazer upload do certificado:', error);
    throw error;
  }
}

/**
 * Remove o certificado digital de uma empresa
 * @param cnpj CNPJ da empresa
 */
export async function excluirCertificado(cnpj: string): Promise<void> {
  try {
    console.log('Excluindo certificado da empresa:', cnpj);
    await nuvemFiscalFetch(`/empresas/${cnpj}/certificado`, {
      method: 'DELETE'
    });
  } catch (error: any) {
    console.error('Erro ao excluir certificado:', error);
    // Se for 404, consideramos como sucesso
    if (error.status === 404 || error.response?.status === 404) {
      return;
    }
    throw error;
  }
}
