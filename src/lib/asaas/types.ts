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

export interface AsaasSubcontaPayload {
  name: string // required
  email: string // required
  loginEmail: string // required
  cpfCnpj: string // required
  birthDate: string // required
  companyType: 'MEI' | 'LIMITED' | 'INDIVIDUAL' | 'ASSOCIATION' // required para PJ
  personType: 'FISICA' | 'JURIDICA' // required
  phone: string
  mobilePhone: string // required
  site?: string
  incomeValue: number // required
  address: string // required
  addressNumber: string // required
  complement?: string
  province: string // required
  postalCode: string // required
  webhooks?: Array<{
    name: string
    url: string
    email: string
    enabled: boolean
    interrupted: boolean
    apiVersion: number
    authToken: string
    sendType: string
    events: string[]
  }>
}

export interface AsaasSubcontaResponse {
  object: string
  hasMore: boolean
  totalCount: number
  limit: number
  offset: number
  data: Array<{
    id: string
    name: string
    email: string
    loginEmail: string
    cpfCnpj: string
    phone: string
    mobilePhone: string
    address: string
    addressNumber: string
    complement: string
    province: string
    postalCode: string
    apiKey: string
    walletId: string
    accountNumber: string
    accountDigit: string
    status: 'ACTIVE' | 'INACTIVE'
    personType: 'FISICA' | 'JURIDICA'
    companyType: string
    birthDate: string
    city: string
    state: string
    country: string
    site: string
    dateCreated: string
    deleted: boolean
  }>
}

export interface AsaasWebhookConfig {
  url: string
  email: string
  enabled: boolean
  interrupted: boolean
  apiVersion: number
  type?: string
  token?: string
  events: string[]
}
