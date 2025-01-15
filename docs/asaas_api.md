# Integração com Asaas

## Visão Geral

Nossa integração com o Asaas é feita através de uma API route centralizada que gerencia todas as chamadas para a API do Asaas. Isso garante consistência, segurança e facilita o debug.

## Estrutura

### API Route

Todas as chamadas para o Asaas devem ser feitas através da nossa API route:
```typescript
/api/asaas
```

### Exemplo de Uso

```typescript
const response = await fetch('/api/asaas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    endpoint: '/customers', // Endpoint do Asaas
    data: {                // Dados a serem enviados
      name: 'João Silva',
      email: 'joao@example.com'
    },
    customHeaders: {       // Headers opcionais
      'access_token': 'token_customizado'
    }
  })
})
```

### Parâmetros

- `endpoint`: O endpoint do Asaas (ex: '/customers', '/payments')
- `data`: Os dados a serem enviados na requisição
- `method`: O método HTTP (default: 'POST')
- `customHeaders`: Headers adicionais para a requisição (opcional)

## Boas Práticas

1. **Sempre use a API Route**
   - Não faça chamadas diretas para o Asaas
   - Use sempre `/api/asaas` como intermediário

2. **Tratamento de Erros**
   ```typescript
   const response = await fetch('/api/asaas', ...)
   const data = await response.json()
   
   if (!response.ok) {
     console.error('Erro:', data)
     throw new Error(data.error || 'Erro na chamada do Asaas')
   }
   ```

3. **Logs**
   - A API route já inclui logs detalhados
   - Adicione logs específicos em suas funções
   - Use o console do navegador (F12) para debug

## Exemplos

### Criar Cliente
```typescript
const response = await fetch('/api/asaas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    endpoint: '/customers',
    data: {
      name: 'João Silva',
      email: 'joao@example.com',
      cpfCnpj: '12345678900'
    }
  })
})
```

### Criar Subconta
```typescript
const response = await fetch('/api/asaas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    endpoint: '/accounts',
    data: {
      name: 'Empresa LTDA',
      email: 'contato@empresa.com',
      cpfCnpj: '12345678000100',
      companyType: 'LIMITED'
    }
  })
})

// Para configurar webhook da subconta
const webhookResponse = await fetch('/api/asaas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    endpoint: '/webhook',
    data: {
      url: 'https://sua-url/webhook',
      events: ['PAYMENT_RECEIVED']
    },
    customHeaders: {
      'access_token': subconta.apiKey // Use o token da subconta
    }
  })
})
```

## Configuração

A configuração do Asaas é feita em `src/lib/asaas/config.ts`:

```typescript
export const ASAAS_CONFIG = {
  sandbox: {
    apiKey: '...',
    baseUrl: 'https://sandbox.asaas.com/api/v3'
  },
  production: {
    apiKey: process.env.ASAAS_API_KEY,
    baseUrl: 'https://api.asaas.com/api/v3'
  }
}
```

## Debug

1. Abra o console do navegador (F12)
2. Procure por logs começando com:
   - `=== INÍCIO DO PROCESSAMENTO DA API ROUTE ===`
   - `=== INÍCIO DA CRIAÇÃO DO CLIENTE NO ASAAS ===`
   - etc.

## Webhooks

Os webhooks do Asaas são configurados para:
1. URL: `https://fwmxtjrxilkrirvrxlxb.supabase.co/functions/v1/asaas_webhook`
2. Eventos: `PAYMENT_RECEIVED`, `PAYMENT_CREATED`

## Troubleshooting

### Erro 401 (Unauthorized)
- Verifique se o token está correto
- Para subcontas, use o token específico da subconta
- Remova o `$` do início do token

### Erro 400 (Bad Request)
- Verifique os dados enviados
- CPF/CNPJ deve conter apenas números
- Campos obrigatórios não podem estar vazios
