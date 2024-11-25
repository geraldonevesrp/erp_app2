// Configurações da API Nuvem Fiscal
export const NUVEM_FISCAL_CONFIG = {
  BASE_URL: "https://api.nuvemfiscal.com.br",
  AUTH_URL: "https://auth.nuvemfiscal.com.br/oauth/token",
  CLIENT_ID: "xag3DXNYCN13qiNr6KRW",
  CLIENT_SECRET: "b4zPtz5HS8NgWrgWakHSv5SVwdC9xhZ04ZheF08f",
  SCOPE: "cep cnpj nfse nfe empresa conta mdfe cte"
} as const

// Tipos de resposta da API
export interface NuvemFiscalError {
  error: {
    code: string
    message: string
  }
}

// Função para obter token de acesso
export async function getNuvemFiscalToken() {
  try {
    const params = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: NUVEM_FISCAL_CONFIG.CLIENT_ID,
      client_secret: NUVEM_FISCAL_CONFIG.CLIENT_SECRET,
      scope: NUVEM_FISCAL_CONFIG.SCOPE
    })

    const response = await fetch(NUVEM_FISCAL_CONFIG.AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString()
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Erro ao obter token: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error("Erro ao obter token de acesso:", error)
    throw error
  }
}

// Função para fazer requisições autenticadas
export async function nuvemFiscalFetch(endpoint: string, options: RequestInit = {}) {
  const token = await getNuvemFiscalToken()
  
  const response = await fetch(`${NUVEM_FISCAL_CONFIG.BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`Erro na API da Nuvem Fiscal: ${response.status} - ${JSON.stringify(errorData)}`)
  }

  return response.json()
}
