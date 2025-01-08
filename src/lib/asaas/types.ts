export interface AsaasCliente {
  id?: number
  asaas_id: string
  city: string
  name: string
  email: string
  phone?: string
  state: string
  object: string
  address: string
  canedit: boolean
  company: string
  country: string
  cpfcnpj: string
  deleted: boolean
  cityname: string
  province: string
  candelete: boolean
  complement?: string
  persontype: string
  postalcode: string
  datecreated: Date
  mobilephone?: string
  observations?: string
  addressnumber: string
  additionalemails?: string
  cannoteditreason?: string
  stateinscription?: string
  externalreference?: string
  municipalinscription?: string
  notificationdisabled: boolean
  cannotbedeletedreason?: string
  asaas_contas_id?: number
  perfis_id?: string
  pessoas_id?: number
  empresas_id?: number
}

export type AsaasPaymentStatus = 
  | 'PENDING' // Aguardando pagamento
  | 'RECEIVED' // Recebida (pagamento confirmado)
  | 'CONFIRMED' // Confirmada (pagamento confirmado)
  | 'OVERDUE' // Vencida
  | 'REFUNDED' // Estornada
  | 'RECEIVED_IN_CASH' // Recebida em dinheiro
  | 'REFUND_REQUESTED' // Estorno solicitado
  | 'CHARGEBACK_REQUESTED' // Recebido chargeback
  | 'CHARGEBACK_DISPUTE' // Em disputa de chargeback
  | 'AWAITING_CHARGEBACK_REVERSAL' // Aguardando reversão do chargeback
  | 'DUNNING_REQUESTED' // Em processo de negativação
  | 'DUNNING_RECEIVED' // Recebido em negativação
  | 'AWAITING_RISK_ANALYSIS' // Aguardando análise de risco

export type AsaasBillingType = 
  | 'BOLETO' 
  | 'CREDIT_CARD' 
  | 'PIX' 
  | 'UNDEFINED'

export interface AsaasWebhookEvent {
  event: string
  payment: {
    id: string
    customer: string
    value: number
    netValue: number
    billingType: AsaasBillingType
    status: AsaasPaymentStatus
    dueDate: string
    paymentDate?: string
    clientPaymentDate?: string
    invoiceUrl?: string
    bankSlipUrl?: string
    transactionReceiptUrl?: string
    creditCard?: {
      creditCardNumber: string
      creditCardBrand: string
      creditCardToken: string
    }
  }
}
