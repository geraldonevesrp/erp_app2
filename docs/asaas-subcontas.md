# Documentação de Subcontas Asaas

## Visão Geral
O módulo de subcontas permite criar e gerenciar subcontas no Asaas para revendas. Cada subconta tem sua própria API Key e Wallet ID para operações independentes.

## Estrutura do Código

### 1. Tipos (src/lib/asaas/types.ts)
```typescript
interface AsaasSubcontaPayload {
  // Dados Básicos (obrigatórios)
  name: string
  email: string
  loginEmail: string
  cpfCnpj: string // Apenas números
  personType: 'FISICA' | 'JURIDICA'
  
  // Dados Comerciais
  birthDate: string // Formato: YYYY-MM-DD
  companyType: 'MEI' | 'LIMITED' | 'INDIVIDUAL' | 'ASSOCIATION' // Obrigatório para PJ
  incomeValue: number // Obrigatório
  site?: string
  
  // Contato (obrigatórios)
  phone: string
  mobilePhone: string
  
  // Endereço (obrigatórios)
  address: string
  addressNumber: string
  complement?: string
  province: string // Bairro
  postalCode: string // Apenas números
  
  // Configuração de Webhooks (opcional)
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
```

### 2. Cliente Asaas (src/lib/asaas/client.ts)
O cliente usa o padrão Singleton e gerencia todas as requisições para a API do Asaas:

```typescript
const response = await asaasClient.createSubconta({
  name: "Nome da Subconta",
  email: "email@exemplo.com",
  // ... outros campos
});
```

### 3. Rota da API (src/app/api/asaas/accounts/route.ts)
Endpoint para criar subcontas:
- **URL**: POST /api/asaas/accounts
- **Headers**: Content-Type: application/json
- **Body**: AsaasSubcontaPayload

## Resposta da API

```typescript
interface AsaasSubcontaResponse {
  object: "account"
  id: string // UUID da subconta
  name: string
  email: string
  loginEmail: string
  apiKey: string // ⚠️ Retornado apenas na criação
  walletId: string // Para operações de split
  accountNumber: {
    agency: string
    account: string
    accountDigit: string
  }
  // ... outros campos
}
```

## Observações Importantes

1. **Segurança**:
   - A `apiKey` é retornada apenas uma vez na criação
   - Armazene a `apiKey` e o `walletId` de forma segura
   - Nunca exponha credenciais no frontend

2. **Validações**:
   - CPF/CNPJ deve conter apenas números
   - CEP deve ser válido (cidade/estado são preenchidos automaticamente)
   - Telefones são formatados automaticamente (apenas números)
   - Para PJ, `companyType` é obrigatório

3. **Webhooks**:
   - O `authToken` do webhook é gerado automaticamente
   - Configure os eventos necessários (payments, transfers, etc)
   - A URL do webhook deve ser HTTPS

4. **Limites**:
   - Ambiente sandbox: 20 subcontas por dia
   - Produção: sem limite documentado

## Exemplo de Uso

```typescript
// 1. Preparar os dados
const subcontaData = {
  name: "Revenda Exemplo",
  email: "revenda@exemplo.com",
  loginEmail: "revenda@exemplo.com",
  cpfCnpj: "31382903000108",
  birthDate: "1994-05-16",
  companyType: "LIMITED",
  personType: "JURIDICA",
  phone: "11 3230-0606",
  mobilePhone: "11 98845-1155",
  site: "https://revenda.com.br",
  incomeValue: 5000.00,
  address: "Av Principal",
  addressNumber: "123",
  complement: "Sala 1",
  province: "Centro",
  postalCode: "89223005"
};

// 2. Fazer a requisição
const response = await fetch('/api/asaas/accounts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(subcontaData)
});

// 3. Tratar a resposta
const data = await response.json();
if (data.apiKey) {
  // Armazenar apiKey e walletId de forma segura
  await saveApiCredentials(data.id, data.apiKey, data.walletId);
}
```

## Próximos Passos

1. Após criar a subconta:
   - Armazenar as credenciais (apiKey, walletId)
   - Configurar webhooks se necessário
   - Testar a conexão com a nova apiKey

2. Para operações de split:
   - Usar o walletId nas cobranças
   - Configurar regras de split conforme necessário

3. Monitoramento:
   - Implementar logs de auditoria
   - Monitorar webhooks
   - Verificar status das subcontas periodicamente
