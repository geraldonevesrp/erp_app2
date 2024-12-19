# Documentação da Integração com a API Nuvem Fiscal

## 📋 Visão Geral

Esta documentação descreve a integração com a API da Nuvem Fiscal no projeto ErpApp2. A integração foi desenvolvida de forma modular e type-safe, utilizando TypeScript.

## 🔐 Autenticação

A API usa OAuth2 com Client Credentials Flow.

```typescript
// Credenciais
CLIENT_ID: "xag3DXNYCN13qiNr6KRW"
CLIENT_SECRET: "b4zPtz5HS8NgWrgWakHSv5SVwdC9xhZ04ZheF08f"
SCOPE: "cep cnpj nfse nfe empresa conta mdfe cte"

// URLs
BASE_URL: "https://api.nuvemfiscal.com.br"
AUTH_URL: "https://auth.nuvemfiscal.com.br/oauth/token"

// Parâmetros de Autenticação
grant_type: "client_credentials"  // Obrigatório
```

O token de acesso é obtido automaticamente pela função `getNuvemFiscalToken()` em `src/lib/nuvemfiscal/config.ts`.

## 📁 Estrutura de Arquivos

```
src/lib/nuvemfiscal/
├── config.ts           # Configurações, autenticação e utilitários
├── api/
│   └── empresa.ts      # Funções para endpoints de empresa
└── types/
    └── empresa.ts      # Interfaces TypeScript para dados de empresa
```

## 🛠️ Como Usar

### 1. Consultar Empresa por CNPJ

```typescript
import { consultarEmpresa } from "@/lib/nuvemfiscal/api/empresa"

// O CNPJ pode ser formatado ou não
const empresa = await consultarEmpresa("00.000.000/0000-00")
// Faz uma chamada para GET /cnpj/{cnpj}
```

### 2. Listar Empresas com Filtros

```typescript
import { listarEmpresas } from "@/lib/nuvemfiscal/api/empresa"

const empresas = await listarEmpresas({
  top: 10,           // Limite de registros
  skip: 0,           // Offset para paginação
  filter: "uf eq 'SP'", // Filtro OData
  orderby: "razao_social" // Ordenação
})
// Faz uma chamada para GET /cnpj com parâmetros de query
```

### 3. Utilizando em Rotas da API

```typescript
// Em src/app/api/[sua-rota]/route.ts
import { consultarEmpresa } from "@/lib/nuvemfiscal/api/empresa"

export async function GET(request: NextRequest) {
  try {
    const data = await consultarEmpresa("00000000000000")
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

## 📊 Tipos de Dados

### Empresa

Interface principal para dados de empresa:

```typescript
interface Empresa {
  cnpj: string
  razao_social: string
  nome_fantasia?: string
  // ... outros campos
}
```

Consulte `src/lib/nuvemfiscal/types/empresa.ts` para a interface completa.

## 🔧 Utilitários

### Formatação de Documentos

Em `src/lib/utils.ts`:

```typescript
// Aplicar máscara CNPJ: 00.000.000/0000-00
maskCNPJ("00000000000000")

// Remover formatação
unmaskDocument("00.000.000/0000-00")
```

## 🚨 Tratamento de Erros

A integração inclui tratamento de erros robusto:

1. Erros de autenticação (400, 401, 403)
2. Erros de requisição (404, 500)
3. Erros de validação de dados

Exemplo de tratamento:

```typescript
try {
  const empresa = await consultarEmpresa(cnpj)
} catch (error) {
  console.error("Erro:", error.message)
  // O erro já vem formatado para exibição
}
```

## 🔗 Links Úteis

- [Documentação Oficial da API](https://dev.nuvemfiscal.com.br/docs/api)
- [Portal do Desenvolvedor](https://dev.nuvemfiscal.com.br/docs)

## 📝 Notas de Implementação

1. **Tokens de Acesso**: São gerenciados automaticamente pelo `nuvemFiscalFetch`
2. **Cache**: Não implementado ainda, considerar para otimização futura
3. **Rate Limiting**: Implementar monitoramento de uso
4. **Endpoints**: 
   - GET `/cnpj/{cnpj}` - Consulta dados de uma empresa
   - GET `/cnpj` - Lista empresas com filtros

## 🔄 Manutenção

Para adicionar novos endpoints:

1. Adicione tipos em `types/`
2. Crie funções em `api/`
3. Use o `nuvemFiscalFetch` para requisições

## 🚀 Exemplos de Uso

### No Módulo de Pessoas

```typescript
// Em add-pessoa-dialog.tsx
import { consultarEmpresa } from "@/lib/nuvemfiscal/api/empresa"

const handlePJSubmit = async () => {
  try {
    const empresa = await consultarEmpresa(cnpj)
    // Usar dados da empresa...
  } catch (error) {
    setError(error.message)
  }
}
```

## ⚠️ Limitações Conhecidas

1. Sem cache implementado
2. Sem retry em falhas de rede
3. Sem rate limiting

## 🔜 Próximos Passos

1. Implementar cache de respostas
2. Adicionar retry em falhas
3. Implementar rate limiting
4. Expandir para outros endpoints da API

## 🤝 Contribuindo

1. Mantenha a estrutura modular
2. Adicione tipos para tudo
3. Documente novas funcionalidades
4. Mantenha o tratamento de erros consistente

## Certificados Digitais

### Estrutura de Dados

```typescript
// Dados para upload de certificado
interface CertificadoDigital {
  nome: string;
  arquivo: string; // base64 do arquivo .pfx
  senha: string;
}

// Resposta da API com informações do certificado
interface CertificadoInfo {
  status: string;
  empresa: {
    cpf_cnpj: string;
    razao_social: string;
  };
  certificado: {
    serial_number: string;
    issuer_name: {
      country: string;
      organization: string;
      organizational_unit: string;
      common_name: string;
    };
    subject_name: {
      country: string;
      organization: string;
      state: string;
      locality: string;
      organizational_units: string[];
      common_name: string;
    };
    validity: {
      not_before: string;
      not_after: string;
    };
  };
}
```

### Endpoints

#### Consultar Certificado

```typescript
GET /api/nuvemfiscal/empresa/{empresaId}/certificado

// Resposta de sucesso
{
  status: "active",
  empresa: {
    cpf_cnpj: "06118552000185",
    razao_social: "ISOTEC TECNOLOGIA E INFORMATICA LTDA"
  },
  certificado: {
    serial_number: "12345678",
    issuer_name: {
      country: "BR",
      organization: "ICP-Brasil",
      organizational_unit: "Secretaria da Receita Federal do Brasil - RFB",
      common_name: "AC SAFEWEB RFB v5"
    },
    subject_name: {
      country: "BR",
      organization: "ICP-Brasil",
      state: "SP",
      locality: "RIBEIRAO PRETO",
      organizational_units: [
        "Secretaria da Receita Federal do Brasil - RFB",
        "RFB e-CNPJ A1",
        "31014048000182",
        "videoconferencia"
      ],
      common_name: "ISOTEC TECNOLOGIA E INFORMATICA LTDA:06118552000185"
    },
    validity: {
      not_before: "2024-02-26T00:00:00Z",
      not_after: "2025-02-25T23:59:59Z"
    }
  }
}

// Resposta quando não há certificado
null

// Resposta de erro
{
  error: "Mensagem de erro"
}
```

#### Upload de Certificado

```typescript
POST /api/nuvemfiscal/empresa/{empresaId}/certificado
Content-Type: application/json

{
  "nome": "certificado.pfx",
  "arquivo": "base64_do_arquivo_pfx",
  "senha": "senha_do_certificado"
}

// Resposta de sucesso
{
  // Mesma estrutura do GET
}

// Resposta de erro
{
  error: "Mensagem de erro"
}
```

#### Remover Certificado

```typescript
DELETE /api/nuvemfiscal/empresa/{empresaId}/certificado

// Resposta de sucesso
{
  success: true
}

// Resposta de erro
{
  error: "Mensagem de erro"
}
```

### Tratamento de Erros

- **404 Not Found**: Retornado quando não há certificado cadastrado para a empresa
- **400 Bad Request**: Erro nos dados enviados (senha incorreta, arquivo inválido, etc)
- **401 Unauthorized**: Erro de autenticação
- **500 Internal Server Error**: Erro interno do servidor

### Exemplo de Uso

```typescript
// Consultar certificado
const response = await fetch(`/api/nuvemfiscal/empresa/${empresaId}/certificado`);
const data = await response.json();
if (data === null) {
  // Não há certificado
} else if (data.error) {
  // Tratar erro
} else {
  // Usar dados do certificado
}

// Upload de certificado
const response = await fetch(`/api/nuvemfiscal/empresa/${empresaId}/certificado`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nome: arquivo.name,
    arquivo: base64,
    senha: senha
  })
});

// Remover certificado
const response = await fetch(`/api/nuvemfiscal/empresa/${empresaId}/certificado`, {
  method: 'DELETE'
});
