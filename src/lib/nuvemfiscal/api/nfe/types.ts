/**
 * Tipos e interfaces para NFe (Nota Fiscal Eletrônica)
 * @see https://dev.nuvemfiscal.com.br/docs/api/#tag/Nfe
 */

/**
 * Status possíveis de uma NFe
 */
export type NfeStatus = 
  | 'enviando' // Nota está sendo enviada para a SEFAZ
  | 'autorizada' // Nota foi autorizada pela SEFAZ
  | 'rejeitada' // Nota foi rejeitada pela SEFAZ
  | 'cancelada' // Nota foi cancelada
  | 'denegada' // Nota foi denegada pela SEFAZ
  | 'erro' // Erro ao processar a nota
  | 'processando_autorizacao' // Nota está sendo processada pela SEFAZ
  | 'processando_cancelamento'; // Cancelamento está sendo processado

/**
 * Ambiente de emissão da NFe
 */
export type NfeAmbiente = 
  | 'homologacao' // Ambiente de testes
  | 'producao'; // Ambiente de produção

/**
 * Finalidade de emissão da NFe
 */
export type NfeFinalidade = 
  | 'normal' // 1 - NF-e normal
  | 'complementar' // 2 - NF-e complementar
  | 'ajuste' // 3 - NF-e de ajuste
  | 'devolucao'; // 4 - Devolução de mercadoria

/**
 * Tipo de operação da NFe
 */
export type NfeTipoOperacao = 
  | 'entrada' // 0 - Entrada
  | 'saida'; // 1 - Saída

/**
 * Tipo de impressão da DANFE
 */
export type NfeTipoImpressao = 
  | 'nao_gerar_danfe' // 0 - Não gerar DANFE
  | 'danfe_normal_retrato' // 1 - DANFE normal, Retrato
  | 'danfe_normal_paisagem' // 2 - DANFE normal, Paisagem
  | 'danfe_simplificado' // 3 - DANFE Simplificado
  | 'danfe_nfce' // 4 - DANFE NFC-e
  | 'danfe_nfce_eletronica'; // 5 - DANFE NFC-e em mensagem eletrônica

/**
 * Forma de pagamento
 */
export type NfeFormaPagamento = 
  | 'a_vista' // 0 - Pagamento à vista
  | 'a_prazo' // 1 - Pagamento a prazo
  | 'outros'; // 2 - Outros

/**
 * Modelo do documento fiscal
 */
export type NfeModelo = 
  | '55' // NF-e - 55
  | '65'; // NFC-e - 65

/**
 * Interface base para endereço
 */
export interface Endereco {
  logradouro: string;
  numero?: string;
  complemento?: string;
  bairro: string;
  codigo_municipio: string;
  nome_municipio?: string;
  uf: string;
  cep: string;
  codigo_pais?: string;
  nome_pais?: string;
  telefone?: string;
}

/**
 * Identificação do destinatário
 */
export interface Destinatario {
  cpf_cnpj?: string;
  inscricao_estadual?: string;
  inscricao_suframa?: string;
  nome: string;
  endereco: Endereco;
  email?: string;
}

/**
 * Informações do produto/serviço
 */
export interface Produto {
  codigo: string;
  descricao: string;
  ncm: string;
  cest?: string;
  cfop: string;
  unidade_comercial: string;
  quantidade_comercial: number;
  valor_unitario_comercial: number;
  valor_bruto: number;
  gtin?: string;
  gtin_tributavel?: string;
  unidade_tributavel: string;
  quantidade_tributavel: number;
  valor_unitario_tributavel: number;
}

/**
 * Informações dos Impostos
 */
export interface Impostos {
  icms: {
    codigo_cst: string;
    valor_base_calculo?: number;
    aliquota?: number;
    valor?: number;
  };
  pis: {
    codigo_cst: string;
    valor_base_calculo?: number;
    aliquota?: number;
    valor?: number;
  };
  cofins: {
    codigo_cst: string;
    valor_base_calculo?: number;
    aliquota?: number;
    valor?: number;
  };
}

/**
 * Item da NFe
 */
export interface NfeItem {
  numero_item: number;
  produto: Produto;
  impostos: Impostos;
}

/**
 * Informações de pagamento
 */
export interface Pagamento {
  forma_pagamento: NfeFormaPagamento;
  valor: number;
  tipo_integracao?: 'pagamento_integrado' | 'pagamento_nao_integrado';
  cnpj_credenciadora?: string;
  bandeira_operadora?: string;
  numero_autorizacao?: string;
  tipo_pagamento?: 
    | 'dinheiro' 
    | 'cheque' 
    | 'cartao_credito' 
    | 'cartao_debito' 
    | 'credito_loja' 
    | 'vale_alimentacao' 
    | 'vale_refeicao' 
    | 'vale_presente' 
    | 'vale_combustivel' 
    | 'outros';
}

/**
 * Totais da NFe
 */
export interface NfeTotais {
  base_calculo_icms: number;
  valor_icms: number;
  valor_produtos: number;
  valor_frete?: number;
  valor_seguro?: number;
  valor_desconto?: number;
  valor_total: number;
}

/**
 * Informações de transporte
 */
export interface Transporte {
  modalidade_frete: 
    | '0' // 0 - Contratação do Frete por conta do Remetente (CIF)
    | '1' // 1 - Contratação do Frete por conta do Destinatário (FOB)
    | '2' // 2 - Contratação do Frete por conta de Terceiros
    | '3' // 3 - Transporte Próprio por conta do Remetente
    | '4' // 4 - Transporte Próprio por conta do Destinatário
    | '9'; // 9 - Sem Ocorrência de Transporte
  transportadora?: {
    cpf_cnpj?: string;
    nome?: string;
    inscricao_estadual?: string;
    endereco?: Endereco;
  };
  volume?: {
    quantidade?: number;
    especie?: string;
    marca?: string;
    numeracao?: string;
    peso_liquido?: number;
    peso_bruto?: number;
  };
}

/**
 * Pedido de emissão de NFe
 */
export interface NfePedidoEmissao {
  ambiente: NfeAmbiente;
  modelo?: NfeModelo;
  finalidade: NfeFinalidade;
  tipo_operacao: NfeTipoOperacao;
  destinatario: Destinatario;
  itens: NfeItem[];
  pagamento: {
    formas_pagamento: Pagamento[];
  };
  totais: NfeTotais;
  transporte?: Transporte;
  informacoes_adicionais?: {
    informacoes_contribuinte?: string;
    informacoes_fisco?: string;
  };
}

/**
 * Resposta da consulta de NFe
 */
export interface NfeResposta {
  id: string;
  ambiente: NfeAmbiente;
  created_at: string;
  status: NfeStatus;
  numero: string;
  serie: string;
  chave: string;
  modelo: NfeModelo;
  data_emissao: string;
  natureza_operacao: string;
  destinatario: Destinatario;
  itens: NfeItem[];
  totais: NfeTotais;
}
