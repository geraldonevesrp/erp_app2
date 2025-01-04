import { nuvemFiscalFetch } from '../../config';
import type { 
  NfePedidoEmissao, 
  NfeResposta, 
  NfeStatus 
} from './types';

/**
 * Emite uma nova NFe
 * @param empresa_id CNPJ da empresa emitente
 * @param pedido Dados da NFe a ser emitida
 * @returns Dados da NFe emitida
 * @see https://dev.nuvemfiscal.com.br/docs/api/#tag/Nfe/paths/~1nfe/post
 */
export async function emitirNfe(empresa_id: string, pedido: NfePedidoEmissao): Promise<NfeResposta> {
  try {
    console.log('Emitindo NFe para empresa:', empresa_id);
    const cnpj = empresa_id.replace(/\D/g, '');
    
    return await nuvemFiscalFetch(`/nfe`, {
      method: 'POST',
      body: JSON.stringify({
        cpf_cnpj: cnpj,
        ...pedido
      })
    });
  } catch (error: any) {
    console.error('Erro ao emitir NFe:', error);
    throw error;
  }
}

/**
 * Lista as NFes emitidas
 * @param empresa_id CNPJ da empresa
 * @param params Parâmetros de consulta
 * @returns Lista de NFes
 * @see https://dev.nuvemfiscal.com.br/docs/api/#tag/Nfe/paths/~1nfe/get
 */
export async function listarNfe(empresa_id: string, params?: {
  top?: number;
  skip?: number;
  status?: NfeStatus;
  ambiente?: 'homologacao' | 'producao';
}): Promise<NfeResposta[]> {
  try {
    console.log('Listando NFes da empresa:', empresa_id);
    const cnpj = empresa_id.replace(/\D/g, '');
    
    const queryParams = new URLSearchParams();
    queryParams.append('cpf_cnpj', cnpj);
    
    if (params?.top) queryParams.append('$top', params.top.toString());
    if (params?.skip) queryParams.append('$skip', params.skip.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.ambiente) queryParams.append('ambiente', params.ambiente);
    
    return await nuvemFiscalFetch(`/nfe?${queryParams.toString()}`);
  } catch (error: any) {
    console.error('Erro ao listar NFes:', error);
    throw error;
  }
}

/**
 * Consulta uma NFe pelo ID
 * @param id ID da NFe
 * @returns Dados da NFe
 * @see https://dev.nuvemfiscal.com.br/docs/api/#tag/Nfe/paths/~1nfe~1{id}/get
 */
export async function consultarNfe(id: string): Promise<NfeResposta> {
  try {
    console.log('Consultando NFe:', id);
    return await nuvemFiscalFetch(`/nfe/${id}`);
  } catch (error: any) {
    console.error('Erro ao consultar NFe:', error);
    throw error;
  }
}

/**
 * Consulta o status de processamento de uma NFe
 * @param id ID da NFe
 * @returns Status atual da NFe
 * @see https://dev.nuvemfiscal.com.br/docs/api/#tag/Nfe/paths/~1nfe~1{id}~1status/get
 */
export async function consultarStatusNfe(id: string): Promise<{ status: NfeStatus }> {
  try {
    console.log('Consultando status da NFe:', id);
    return await nuvemFiscalFetch(`/nfe/${id}/status`);
  } catch (error: any) {
    console.error('Erro ao consultar status da NFe:', error);
    throw error;
  }
}

/**
 * Baixa o XML da NFe
 * @param id ID da NFe
 * @returns XML da NFe em base64
 * @see https://dev.nuvemfiscal.com.br/docs/api/#tag/Nfe/paths/~1nfe~1{id}~1xml/get
 */
export async function baixarXmlNfe(id: string): Promise<string> {
  try {
    console.log('Baixando XML da NFe:', id);
    return await nuvemFiscalFetch(`/nfe/${id}/xml`);
  } catch (error: any) {
    console.error('Erro ao baixar XML da NFe:', error);
    throw error;
  }
}

/**
 * Baixa o PDF da NFe (DANFE)
 * @param id ID da NFe
 * @returns PDF da NFe em base64
 * @see https://dev.nuvemfiscal.com.br/docs/api/#tag/Nfe/paths/~1nfe~1{id}~1pdf/get
 */
export async function baixarPdfNfe(id: string): Promise<string> {
  try {
    console.log('Baixando PDF da NFe:', id);
    return await nuvemFiscalFetch(`/nfe/${id}/pdf`);
  } catch (error: any) {
    console.error('Erro ao baixar PDF da NFe:', error);
    throw error;
  }
}

/**
 * Cancela uma NFe
 * @param id ID da NFe
 * @param justificativa Justificativa do cancelamento (min: 15 caracteres, max: 255 caracteres)
 * @see https://dev.nuvemfiscal.com.br/docs/api/#tag/Nfe/paths/~1nfe~1{id}~1cancelamento/post
 */
export async function cancelarNfe(id: string, justificativa: string): Promise<void> {
  try {
    console.log('Cancelando NFe:', id);
    
    if (justificativa.length < 15 || justificativa.length > 255) {
      throw new Error('Justificativa deve ter entre 15 e 255 caracteres');
    }
    
    await nuvemFiscalFetch(`/nfe/${id}/cancelamento`, {
      method: 'POST',
      body: JSON.stringify({ justificativa })
    });
  } catch (error: any) {
    console.error('Erro ao cancelar NFe:', error);
    throw error;
  }
}

/**
 * Consulta o status do cancelamento de uma NFe
 * @param id ID da NFe
 * @returns Status do cancelamento
 * @see https://dev.nuvemfiscal.com.br/docs/api/#tag/Nfe/paths/~1nfe~1{id}~1cancelamento~1status/get
 */
export async function consultarStatusCancelamentoNfe(id: string): Promise<{ status: NfeStatus }> {
  try {
    console.log('Consultando status do cancelamento da NFe:', id);
    return await nuvemFiscalFetch(`/nfe/${id}/cancelamento/status`);
  } catch (error: any) {
    console.error('Erro ao consultar status do cancelamento da NFe:', error);
    throw error;
  }
}

/**
 * Inutiliza uma numeração de NFe
 * @param dados Dados da inutilização
 * @see https://dev.nuvemfiscal.com.br/docs/api/#tag/Nfe/paths/~1nfe~1inutilizacao/post
 */
export async function inutilizarNumeracaoNfe(dados: {
  cnpj: string;
  ano: number;
  serie: number;
  numero_inicial: number;
  numero_final: number;
  justificativa: string;
}): Promise<void> {
  try {
    console.log('Inutilizando numeração de NFe');
    
    if (dados.justificativa.length < 15 || dados.justificativa.length > 255) {
      throw new Error('Justificativa deve ter entre 15 e 255 caracteres');
    }
    
    await nuvemFiscalFetch('/nfe/inutilizacao', {
      method: 'POST',
      body: JSON.stringify(dados)
    });
  } catch (error: any) {
    console.error('Erro ao inutilizar numeração de NFe:', error);
    throw error;
  }
}
