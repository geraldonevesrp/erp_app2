import axios from 'axios';

// Configurações da API Nuvem Fiscal
export const NUVEM_FISCAL_CONFIG = {
  BASE_URL: "https://api.nuvemfiscal.com.br",
  AUTH_URL: "https://auth.nuvemfiscal.com.br/oauth/token",
  CLIENT_ID: process.env.NEXT_PUBLIC_NUVEM_FISCAL_CLIENT_ID || "xag3DXNYCN13qiNr6KRW",
  CLIENT_SECRET: process.env.NUVEM_FISCAL_CLIENT_SECRET || "b4zPtz5HS8NgWrgWakHSv5SVwdC9xhZ04ZheF08f",
  SCOPE: "cep cnpj nfse nfe empresa conta mdfe cte"
};

let accessToken: string | null = null;
let tokenExpiration: Date | null = null;

export async function getNuvemFiscalToken() {
  try {
    // Se já temos um token válido, retorna ele
    if (accessToken && tokenExpiration && tokenExpiration > new Date()) {
      console.log('Usando token em cache');
      return accessToken;
    }

    console.log('Obtendo novo token da Nuvem Fiscal...');
    
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', NUVEM_FISCAL_CONFIG.CLIENT_ID);
    formData.append('client_secret', NUVEM_FISCAL_CONFIG.CLIENT_SECRET);
    formData.append('scope', NUVEM_FISCAL_CONFIG.SCOPE);

    const response = await axios.post(NUVEM_FISCAL_CONFIG.AUTH_URL, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    accessToken = response.data.access_token;
    // Token expira em 1 hora
    tokenExpiration = new Date(Date.now() + (response.data.expires_in * 1000));
    
    console.log('Token obtido com sucesso, expira em:', tokenExpiration);
    return accessToken;
  } catch (error: any) {
    console.error('Erro ao obter token:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
}

export async function nuvemFiscalFetch(endpoint: string, options: RequestInit = {}) {
  try {
    const token = await getNuvemFiscalToken();
    const url = `${NUVEM_FISCAL_CONFIG.BASE_URL}${endpoint}`;
    
    console.log(`Fazendo requisição para ${url}`);
    console.log('Método:', options.method || 'GET');
    
    const response = await axios({
      url,
      method: options.method || 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers
      },
      data: options.body ? JSON.parse(options.body as string) : undefined
    });

    console.log(`Resposta ${response.status}:`, response.data);
    return response.data;
  } catch (error: any) {
    // Se o erro for de autenticação, tenta renovar o token e tentar novamente
    if (error.response?.status === 401) {
      console.log('Token expirado, renovando...');
      accessToken = null;
      tokenExpiration = null;
      const token = await getNuvemFiscalToken();
      
      const response = await axios({
        url: `${NUVEM_FISCAL_CONFIG.BASE_URL}${endpoint}`,
        method: options.method || 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...options.headers
        },
        data: options.body ? JSON.parse(options.body as string) : undefined
      });

      return response.data;
    }

    console.error('Erro na requisição:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      response: error.response
    };
  }
}
