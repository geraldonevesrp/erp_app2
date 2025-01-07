import { nuvemFiscalFetch } from './nuvemfiscal/config';

export class NuvemfiscalApi {
  async consultarCNPJ(cnpj: string) {
    try {
      // Remove caracteres não numéricos
      const cnpjLimpo = cnpj.replace(/\D/g, '');
      
      if (cnpjLimpo.length !== 14) {
        throw new Error('CNPJ inválido');
      }

      // Usa a função nuvemFiscalFetch que já faz a gestão do token
      // Adiciona parâmetro para incluir QSA
      const data = await nuvemFiscalFetch(`/cnpj/${cnpjLimpo}?qsa=true`);
      return data;
    } catch (error: any) {
      console.error('Erro na consulta do CNPJ:', error);
      if (error.response?.status === 404) {
        throw new Error('CNPJ não encontrado');
      }
      throw error;
    }
  }
}
