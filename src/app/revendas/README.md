# Módulo de Revendas

Este módulo gerencia o sistema de revendas do ERP, permitindo que usuários se tornem revendedores após ativação.

## Estrutura

```
/revendas/
  ├── ativar_revenda/    # Processo de ativação de revenda
  │   └── page.tsx       # Página de ativação com integração Asaas
  └── README.md          # Esta documentação
```

## Fluxo de Ativação de Revenda

1. **Verificação de Cliente**
   - Verifica se o usuário já é cliente no Asaas
   - Se existir, usa o cliente existente
   - Se não existir, cria um novo cliente

2. **Geração de Cobrança**
   - Verifica se já existe cobrança pendente
   - Se não existir, gera uma nova cobrança via PIX
   - Valor fixo de R$ 30,00
   - Vencimento em 3 dias

3. **Integração com Asaas**
   - Usa a API do Asaas para gerenciar clientes e cobranças
   - Armazena dados localmente nas tabelas:
     - `asaas_clientes`: Registro de clientes
     - `cobrancas`: Registro de cobranças

## Tabelas do Banco de Dados

### asaas_clientes
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | ID único do registro |
| asaas_id | string | ID do cliente no Asaas |
| asaas_contas_id | integer | ID da conta Asaas (4 = produção) |
| perfis_id | uuid | ID do perfil relacionado |
| name | string | Nome do cliente |
| email | string | Email do cliente |
| ... | ... | Demais campos do cliente |

### cobrancas
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | ID único da cobrança |
| cobrancas_tipos_id | integer | Tipo da cobrança (1 = ativação revenda) |
| sacado_perfil_id | uuid | ID do perfil que deve pagar |
| cedente_perfil_id | uuid | ID do perfil que receberá |
| valor | decimal | Valor da cobrança |
| vencimento | date | Data de vencimento |
| pago_em | date | Data do pagamento |
| paga | boolean | Status do pagamento |
| asaas | jsonb | Dados completos da cobrança no Asaas |

## Configuração

O módulo depende das seguintes variáveis de ambiente:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
ASAAS_API_KEY=sua_chave_api_asaas
ASAAS_API_URL=url_api_asaas
```

## Desenvolvimento

Para trabalhar neste módulo:

1. Configure as variáveis de ambiente
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute em desenvolvimento:
   ```bash
   npm run dev
   ```

## Testes

Para executar os testes:
```bash
npm test
```

## Contribuindo

1. Crie uma branch para sua feature
2. Faça commit das mudanças
3. Abra um Pull Request

## Segurança

- Todas as chamadas à API do Asaas são feitas pelo servidor
- Chaves de API são mantidas seguras no servidor
- Autenticação via Supabase para proteção das rotas
