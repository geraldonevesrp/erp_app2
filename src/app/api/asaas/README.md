# Configuração das Credenciais do Asaas

## ⚠️ Práticas de Segurança

1. **NUNCA exponha as credenciais do Asaas no frontend**
   - Não use `NEXT_PUBLIC_` no nome das variáveis de ambiente do Asaas
   - Não exponha as credenciais em arquivos públicos
   - Sempre acesse as credenciais através do cliente seguro

2. **SEMPRE use o cliente seguro**
   - Não acesse `process.env` diretamente nas rotas
   - Use o `asaasClient` fornecido em `@/lib/asaas/client`
   - O cliente gerencia as credenciais de forma segura

## Cliente do Asaas

### 1. Localização do Cliente

O cliente oficial do Asaas está em `src/lib/asaas/client.ts`. Este é o ÚNICO lugar onde o cliente deve ser definido.

```typescript
// ✅ Forma correta de importar
import { asaasClient } from '@/lib/asaas/client'

// ❌ NÃO crie novos clientes ou duplique o código
// ❌ NÃO acesse process.env.ASAAS_SANDBOX_API_KEY diretamente
```

### 2. Usando o Cliente

O cliente é um singleton que gerencia automaticamente as credenciais:

```typescript
// Em qualquer arquivo que precise fazer chamadas ao Asaas
import { asaasClient } from '@/lib/asaas/client'

// Fazer uma requisição
const response = await asaasClient.makeRequest('/endpoint', {
  method: 'POST',
  body: JSON.stringify(data)
})
```

## Configuração do Ambiente

### 1. Arquivo `.env.local`

Adicione suas credenciais no arquivo `.env.local` na raiz do projeto:

```env
# Configurações do Asaas
ASAAS_SANDBOX_API_KEY=$aact_seu_api_key_aqui
ASAAS_SANDBOX_WALLET_ID=seu_wallet_id_aqui
```

### 2. Arquivo `next.config.js`

Certifique-se que as variáveis estão configuradas no `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ASAAS_SANDBOX_API_KEY: process.env.ASAAS_SANDBOX_API_KEY,
    ASAAS_SANDBOX_WALLET_ID: process.env.ASAAS_SANDBOX_WALLET_ID,
  },
  // ... outras configurações
}
```

## Rotas da API do Asaas

Este diretório contém as rotas da API que fazem interface com o Asaas.

## 📁 Estrutura

```
api/asaas/
├── README.md           # Este arquivo
├── test/              # Rotas de teste
│   └── route.ts       # Teste de autenticação
├── customers/         # Rotas de clientes
│   └── route.ts       # CRUD de clientes
└── payments/          # Rotas de pagamentos
    └── route.ts       # Gerenciamento de cobranças
```

## 🔑 Autenticação

### Teste de Autenticação

```typescript
// GET /api/asaas/test
const response = await fetch('/api/asaas/test')
const data = await response.json()

// Resposta de sucesso
{
  success: true,
  message: "Conexão com Asaas estabelecida com sucesso",
  config: {
    NODE_ENV: "development",
    ASAAS_ENV: "sandbox",
    ASAAS_API_KEY: "...",
    ASAAS_WALLET_ID: "...",
    baseUrl: "https://sandbox.asaas.com/api/v3"
  }
}
```

## 👥 Clientes

### Criar Cliente

```typescript
// POST /api/asaas/customers
const response = await fetch('/api/asaas/customers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Nome do Cliente",
    cpfCnpj: "123.456.789-00",
    email: "cliente@email.com",
    mobilePhone: "(11) 98765-4321"
  })
})
```

### Listar Clientes

```typescript
// GET /api/asaas/customers
const response = await fetch('/api/asaas/customers')
const { data: customers } = await response.json()
```

## 💰 Pagamentos

### Criar Cobrança PIX

```typescript
// POST /api/asaas/payments
const response = await fetch('/api/asaas/payments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    customer: "cus_000000000000",
    billingType: "PIX",
    value: 100.00,
    dueDate: "2025-12-31"
  })
})
```

### Consultar Pagamento

```typescript
// GET /api/asaas/payments/{id}
const response = await fetch('/api/asaas/payments/pay_000000000000')
const payment = await response.json()
```

## ⚙️ Configuração

As rotas utilizam o cliente oficial do Asaas localizado em `@/lib/asaas/client`. Para configuração completa, consulte:

1. [Documentação Detalhada](../../../docs/asaas-integration.md)
2. [README do Módulo Asaas](../../../lib/asaas/README.md)

## 🔍 Debug e Logs

Todas as rotas incluem logs detalhados no console do servidor:

```typescript
console.log('=== REQUISIÇÃO PARA O ASAAS ===')
console.log('URL:', url)
console.log('Status:', response.status)
```

## 🔒 Segurança

1. Todas as rotas validam os dados de entrada
2. As credenciais são gerenciadas pelo cliente oficial
3. Não há exposição de chaves sensíveis
4. Todas as respostas são sanitizadas

## 📚 Documentação Relacionada

- [Documentação Oficial Asaas](https://docs.asaas.com/)
- [Documentação da Integração](../../../docs/asaas-integration.md)
- [README do Módulo](../../../lib/asaas/README.md)

## Uso nas Rotas de API

### 1. Criar Cliente

```typescript
// POST /api/asaas
const response = await fetch('/api/asaas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    endpoint: '/customers',
    data: {
      name: "Nome do Cliente",
      cpfCnpj: "19540550000121",
      mobilePhone: "4799376637",
      email: "cliente@email.com",
      postalCode: "01001000",
      addressNumber: "123"
    }
  })
})

const data = await response.json()
// data.data.id -> ID do cliente criado
```

### 2. Criar Cobrança PIX

```typescript
// POST /api/asaas
const response = await fetch('/api/asaas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    endpoint: '/payments',
    data: {
      customer: "cus_000005219613", // ID do cliente
      billingType: "PIX",
      value: 297.00,
      dueDate: "2025-01-25",
      description: "Descrição da cobrança"
    }
  })
})

const data = await response.json()
// data.data.id -> ID do pagamento criado
```

### 3. Gerar QR Code PIX

```typescript
// POST /api/asaas
const response = await fetch('/api/asaas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    endpoint: `/payments/${paymentId}/pixQrCode`
  })
})

const data = await response.json()
// data.data.encodedImage -> Imagem do QR Code em base64
// data.data.payload -> Código PIX copia e cola
// data.data.expirationDate -> Data de expiração

// Para mostrar o QR Code:
const imageUrl = `data:image/png;base64,${data.data.encodedImage}`
```

## Exemplo de Uso Completo

Veja um exemplo completo em `/api/asaas/test-page` que demonstra:
1. Criação de cliente
2. Criação de cobrança PIX
3. Geração de QR Code

## Notas Importantes

1. **Ambiente Sandbox**
   - Use o prefixo `$aact_` na API Key para ambiente sandbox
   - Base URL: `https://sandbox.asaas.com/api/v3`

2. **QR Code PIX**
   - O QR Code é dinâmico e expira
   - Expira 12 meses após a data de vencimento
   - Só pode ser pago uma vez
   - Retorna tanto a imagem em base64 quanto o código copia e cola

3. **Tratamento de Erros**
   - Sempre verifique `response.ok` antes de usar os dados
   - Use try/catch para capturar erros de rede
   - Verifique os logs para debug em caso de erro

4. **Segurança**
   - Todas as chamadas devem ser feitas através do backend
   - Nunca exponha a API Key no frontend
   - Use HTTPS em produção

## Links Úteis

- [Documentação Oficial do Asaas](https://docs.asaas.com/)
- [Documentação PIX](https://docs.asaas.com/docs/pix-overview)
- [Referência da API](https://docs.asaas.com/reference/api-introduction)
