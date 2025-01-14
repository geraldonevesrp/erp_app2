import { Database } from '@/types/database.types'
import { createAsaasClient } from './config'

type Perfil = Database['public']['Tables']['perfis']['Row']

interface CreateSubcontaParams {
  name: string
  email: string
  loginEmail: string
  mobilePhone: string
  address: string
  addressNumber: string
  province: string
  postalCode: string
  cpfCnpj: string
  personType: 'FISICA' | 'JURIDICA'
  city: number
  state: string
}

export async function createAsaasSubconta(params: CreateSubcontaParams) {
  const asaas = createAsaasClient()
  
  try {
    const response = await fetch(`${asaas.baseUrl}/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': asaas.apiKey
      },
      body: JSON.stringify({
        name: params.name,
        email: params.email,
        loginEmail: params.loginEmail,
        mobilePhone: params.mobilePhone,
        address: params.address,
        addressNumber: params.addressNumber,
        province: params.province,
        postalCode: params.postalCode,
        cpfCnpj: params.cpfCnpj,
        personType: params.personType,
        city: params.city,
        state: params.state,
        country: 'BR'
      })
    })

    if (!response.ok) {
      throw new Error(`Erro ao criar subconta: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro ao criar subconta no Asaas:', error)
    throw error
  }
}
