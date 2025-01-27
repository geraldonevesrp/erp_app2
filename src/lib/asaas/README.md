# Módulo Asaas

Este módulo implementa a integração com a API do Asaas para processamento de pagamentos.

## 🚀 Início Rápido

1. Configure as variáveis de ambiente:
```env
ASAAS_API_KEY="$aact_..."
ASAAS_WALLET_ID="..."
ASAAS_ENV="sandbox"  # ou "production"
```

2. Importe e use o cliente:
```typescript
import { asaasClient } from '@/lib/asaas/client'

// Fazer uma requisição
const response = await asaasClient.makeRequest('/customers')
```

## 📝 Documentação Detalhada

Para uma documentação completa da integração, consulte [docs/asaas-integration.md](../../../docs/asaas-integration.md).

## 🔑 Autenticação

```typescript
// Headers necessários (ordem importante)
const headers = {
  'access_token': process.env.ASAAS_API_KEY,
  'Content-Type': 'application/json',
  'User-Agent': 'erp_app2'
}
```

## 🛠️ Teste de Integração

1. Via API:
```typescript
GET /api/asaas/test
```

2. Via Interface:
- Acesse: `/public/asaas_testes/clientes`
- Clique em "Testar Autenticação"

## 📁 Estrutura do Módulo

```
src/lib/asaas/
├── README.md           # Este arquivo
├── client.ts          # Cliente principal do Asaas
└── types/             # Tipos TypeScript
```

## ⚠️ Notas Importantes

1. Nunca exponha a API Key no frontend
2. Use sempre o cliente `asaasClient` para requisições
3. Mantenha as variáveis de ambiente atualizadas
4. Faça backup seguro das chaves de API

## 🔍 Debugging

Para debug, verifique:
1. Console do servidor para logs detalhados
2. Página de teste em `/public/asaas_testes/clientes`
3. Resposta da rota `/api/asaas/test`

## 🔗 Links Úteis

- [Documentação Oficial Asaas](https://docs.asaas.com/)
- [Documentação Detalhada do Módulo](../../../docs/asaas-integration.md)
- [Sandbox Asaas](https://sandbox.asaas.com/)
