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

## Uso nas Rotas de API

### Forma Segura (Recomendada)

```typescript
import { asaasClient } from '@/lib/asaas/client'

export async function GET() {
  try {
    // Lista clientes
    const response = await asaasClient.listCustomers()
    const data = await response.json()
    
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao acessar Asaas' 
    }, { status: 500 })
  }
}
```

### ❌ Forma Insegura (Não Recomendada)

```typescript
// NÃO FAÇA ISSO!
const apiKey = process.env.ASAAS_SANDBOX_API_KEY
const response = await fetch('https://sandbox.asaas.com/api/v3/customers', {
  headers: { 'access_token': apiKey }
})
```

## Troubleshooting

### Problemas com Variáveis de Ambiente

Se você estiver tendo problemas com as variáveis de ambiente não sendo carregadas corretamente, aqui estão algumas soluções:

1. **Solução 1: Verificar Arquivos**
   - Confirme que `.env.local` existe na raiz do projeto
   - Verifique se as variáveis estão escritas corretamente (sem espaços)
   - Certifique-se que não há caracteres especiais ou BOM no arquivo

2. **Solução 2: Reiniciar o Servidor**
   ```powershell
   # Pare todos os processos node
   taskkill /F /IM node.exe
   # Inicie o servidor novamente
   npm run dev
   ```

3. **Solução 3: Configuração Manual**
   Se ainda houver problemas, você pode configurar as variáveis diretamente no código para debug:
   ```typescript
   // Apenas para debug - NÃO USE EM PRODUÇÃO
   const API_KEY = process.env.ASAAS_SANDBOX_API_KEY || '$aact_seu_api_key'
   ```

4. **Solução 4: Usar dotenv**
   Se nada mais funcionar, você pode usar o pacote dotenv:
   ```typescript
   import * as dotenv from 'dotenv'
   dotenv.config({ path: '.env.local' })
   ```

### Outros Problemas Comuns

1. **Erro 401 (Não Autorizado)**
   - Verifique se a API key está correta
   - Confirme se está usando o ambiente correto (sandbox/produção)

2. **Erro 404 (Não Encontrado)**
   - Verifique se a rota está no diretório correto (`app/api/...`)
   - Certifique-se que o arquivo se chama `route.ts`

3. **Erro 500 (Erro Interno)**
   - Verifique os logs do servidor para mais detalhes
   - Tente usar um try/catch para capturar erros específicos

## Teste das Credenciais

Para testar se suas credenciais estão configuradas corretamente:

```bash
# Teste básico
curl http://localhost:3000/api/asaas/test

# Resposta esperada
{
  "success": true,
  "data": {
    "object": "list",
    "hasMore": false,
    "totalCount": X,
    "data": [...]
  }
}
