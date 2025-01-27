# Documentação da Integração com Asaas

## Sumário
1. [Configuração do Ambiente](#configuração-do-ambiente)
2. [Cliente Asaas](#cliente-asaas)
3. [Autenticação](#autenticação)
4. [Endpoints e Chamadas](#endpoints-e-chamadas)
5. [Testes](#testes)
6. [Troubleshooting](#troubleshooting)

## Configuração do Ambiente

### Variáveis de Ambiente

O projeto utiliza dois arquivos principais para configuração:

1. `.env.local` (desenvolvimento):
```env
# Configurações do Asaas
ASAAS_API_KEY="$aact_..."  # Chave de API do Asaas
ASAAS_WALLET_ID="..."      # ID da carteira
ASAAS_ENV="sandbox"        # Ambiente (sandbox/production)
```

2. `.env.production` (produção):
```env
# Mesmas variáveis, mas com valores de produção
ASAAS_API_KEY="$aact_..."
ASAAS_WALLET_ID="..."
ASAAS_ENV="production"
```

### Variáveis Obrigatórias

- `ASAAS_API_KEY`: Chave de API do Asaas
  - Formato: Sempre começa com `$aact_`
  - Não deve conter espaços extras
  - Deve estar entre aspas duplas no arquivo .env

- `ASAAS_WALLET_ID`: ID da carteira no Asaas
  - Formato UUID
  - Exemplo: "2b939389-8fb1-4afa-907b-753ff90c439c"

- `ASAAS_ENV`: Define o ambiente
  - Valores possíveis: "sandbox" ou "production"
  - Determina a URL base da API

## Cliente Asaas

O cliente está implementado em `src/lib/asaas/client.ts` usando o padrão Singleton:

```typescript
class AsaasClient {
  private static instance: AsaasClient;
  private readonly config: AsaasConfig;

  // Obtém instância única
  public static getInstance(): AsaasClient {
    if (!AsaasClient.instance) {
      AsaasClient.instance = new AsaasClient();
    }
    return AsaasClient.instance;
  }

  // Faz requisições para a API
  public async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response>
}
```

### URLs Base

- Sandbox: `https://sandbox.asaas.com/api/v3`
- Produção: `https://api.asaas.com/v3`

## Autenticação

### Headers Obrigatórios

Os headers devem ser enviados EXATAMENTE nesta ordem:

```typescript
const headers = {
  'access_token': process.env.ASAAS_API_KEY,
  'Content-Type': 'application/json',
  'User-Agent': 'erp_app2'
}
```

### Testando a Autenticação

1. Via API:
```typescript
const response = await asaasClient.makeRequest('/customers?limit=1')
if (response.ok) {
  console.log('Autenticação bem sucedida')
}
```

2. Via Interface Web:
   - Acesse `/public/asaas_testes/clientes`
   - Use o botão "Testar Autenticação"

## Endpoints e Chamadas

### Estrutura Base das Chamadas

```typescript
// GET Request
const response = await asaasClient.makeRequest('/endpoint')

// POST Request
const response = await asaasClient.makeRequest('/endpoint', {
  method: 'POST',
  body: JSON.stringify(data)
})
```

### Endpoints Principais

1. Clientes
```typescript
// Listar clientes
GET /customers

// Criar cliente
POST /customers
{
  "name": "Nome do Cliente",
  "email": "email@cliente.com",
  "cpfCnpj": "12345678900"
}
```

2. Cobranças
```typescript
// Criar cobrança
POST /payments
{
  "customer": "cus_id",
  "billingType": "BOLETO",
  "value": 100.00
}
```

## Testes

### Página de Testes

Localização: `/public/asaas_testes/clientes`

Funcionalidades:
1. Visualização das variáveis de ambiente
2. Teste de autenticação
3. Visualização das configurações em uso

### Verificando Credenciais

```typescript
// Rota de teste
GET /api/asaas/test

// Resposta de sucesso
{
  "success": true,
  "message": "Conexão com Asaas estabelecida com sucesso",
  "config": {
    "NODE_ENV": "development",
    "ASAAS_ENV": "sandbox",
    "ASAAS_API_KEY": "...",
    "ASAAS_WALLET_ID": "...",
    "baseUrl": "..."
  }
}
```

## Troubleshooting

### Erros Comuns

1. Erro 401 (Não Autorizado)
   - Verificar se a API Key está correta
   - Verificar se não há espaços extras na API Key
   - Confirmar se a chave não foi revogada no Asaas

2. Erro na Leitura das Variáveis
   - Verificar se o arquivo .env.local existe
   - Confirmar se as variáveis estão entre aspas duplas
   - Reiniciar o servidor Next.js

### Logs e Debug

1. Logs do Cliente:
```typescript
console.log('=== CONFIGURAÇÃO DO ASAAS ===')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('ASAAS_ENV:', process.env.ASAAS_ENV)
console.log('API Key:', process.env.ASAAS_API_KEY)
```

2. Logs de Requisição:
```typescript
console.log('=== REQUISIÇÃO PARA O ASAAS ===')
console.log('URL:', url)
console.log('Status:', response.status)
console.log('Resposta:', await response.text())
```

### Dicas de Segurança

1. Nunca expor a API Key no frontend
2. Sempre usar HTTPS em produção
3. Validar dados antes de enviar para a API
4. Manter as chaves em variáveis de ambiente
5. Fazer backup das chaves de forma segura
