# Configuração de Deploy no Vercel

## Pré-requisitos
- Conta no Vercel
- Domínio configurado (erpapp.com.br)
- Projeto Next.js pronto para deploy

## Passo a Passo

### 1. Configuração do Projeto no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "New Project"
3. Importe o repositório do projeto
4. Configure o projeto:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `next build`
   - Output Directory: .next

### 2. Configuração de Variáveis de Ambiente

No dashboard do projeto no Vercel, adicione as seguintes variáveis:

```env
NEXT_PUBLIC_APP_URL=https://erpapp.com.br
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_ALLOWED_DOMAINS=erpapp.com.br
NEXT_PUBLIC_ALLOWED_SUBDOMAINS=erp,revendas,master
```

### 3. Configuração de Domínios

1. No dashboard do projeto, vá para "Settings" > "Domains"
2. Adicione os seguintes domínios:
   - `erpapp.com.br` (domínio principal)
   - `*.erpapp.com.br` (wildcard para subdomínios)

3. Configure os registros DNS:
   ```
   Tipo    Nome    Valor
   A       @       76.76.21.21
   A       *       76.76.21.21
   ```

### 4. Configuração de Subdomínios

Certifique-se de que os seguintes subdomínios estão funcionando:
- erp.erpapp.com.br
- revendas.erpapp.com.br
- master.erpapp.com.br

### 5. Verificação de SSL

O Vercel fornece SSL automático. Verifique se todos os domínios estão com HTTPS ativo:
- https://erpapp.com.br
- https://erp.erpapp.com.br
- https://revendas.erpapp.com.br
- https://master.erpapp.com.br

### 6. Configurações Adicionais

1. **Headers de Segurança**
   - Já configurados no `vercel.json`
   - Incluem proteções contra XSS, clickjacking, etc.

2. **Redirecionamentos**
   - Configurados para manter URLs limpas
   - Sem trailing slashes
   - Redirecionamento automático para HTTPS

### 7. Monitoramento

1. Configure alertas de deploy no Vercel
2. Ative o monitoramento de performance
3. Configure logs de erro (recomendado: Sentry ou similar)

## Troubleshooting

### Problemas Comuns

1. **Subdomínios não funcionando**
   - Verifique as configurações DNS
   - Aguarde propagação DNS (pode levar até 48h)
   - Verifique se o wildcard SSL está ativo

2. **Erros de Build**
   - Verifique os logs de build no Vercel
   - Certifique-se de que todas as variáveis de ambiente estão configuradas
   - Verifique se o Next.js está configurado corretamente

3. **Problemas de Middleware**
   - Verifique os logs do Edge Function
   - Certifique-se de que o middleware está lidando corretamente com os subdomínios

## Manutenção

### Deploy Manual

```bash
vercel --prod
```

### Atualizações

1. Faça commit das alterações
2. Push para o repositório
3. O Vercel fará o deploy automático

### Rollback

Em caso de problemas:
1. Acesse o dashboard do Vercel
2. Vá para "Deployments"
3. Encontre o último deploy estável
4. Clique em "..." > "Promote to Production"

## Deploy no Vercel com Multi-Tenant

### Visão Geral

Este guia detalha o processo de deploy de uma aplicação Next.js multi-tenant na Vercel, com foco em:
- Configuração de subdomínios dinâmicos
- Gerenciamento de variáveis de ambiente
- Configuração de DNS e SSL
- Monitoramento e manutenção

### Pré-requisitos

- Conta no Vercel
- Domínio principal (erp1.com.br)
- Repositório Git com o projeto
- Supabase configurado

### Configuração do Projeto

#### 1. Deploy Inicial

1. Acesse [vercel.com](https://vercel.com)
2. Importe o repositório
3. Configure o framework:
   ```
   Framework: Next.js
   Root Directory: ./
   Build Command: next build
   Output Directory: .next
   Node.js Version: 18.x
   ```

#### 2. Variáveis de Ambiente

```env
# URLs e Endpoints
NEXT_PUBLIC_SITE_URL=https://erp1.com.br
NEXT_PUBLIC_VERCEL_URL=${NEXT_PUBLIC_SITE_URL}

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Configurações Multi-tenant
NEXT_PUBLIC_ALLOWED_DOMAINS=erp1.com.br
NEXT_PUBLIC_ALLOWED_SUBDOMAINS=erp,revendas,master
```

#### 3. Configuração de Domínios

##### Registros DNS
```
# Domínio Principal
erp1.com.br.        300    IN    A       76.76.21.21
www.erp1.com.br.    300    IN    CNAME   cname.vercel-dns.com.

# Wildcard para Subdomínios
*.erp1.com.br.      300    IN    CNAME   cname.vercel-dns.com.
```

##### Vercel Domains
1. Settings > Domains
2. Adicione:
   - `erp1.com.br`
   - `www.erp1.com.br`
   - `*.erp1.com.br`

### Configurações de Segurança

#### 1. Headers HTTP

Em `next.config.js`:
```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  }
}
```

#### 2. Middleware de Autenticação

Certifique-se que o middleware está:
- Verificando subdomínios
- Validando perfis
- Redirecionando corretamente

### Monitoramento

#### 1. Analytics e Logs

1. Ative o Vercel Analytics:
   ```bash
   npm install @vercel/analytics
   ```

2. Configure logs no Supabase:
   ```sql
   create table auth_logs (
     id uuid default uuid_generate_v4(),
     user_id uuid references auth.users,
     perfil_id uuid references perfis,
     action text,
     created_at timestamp with time zone default timezone('utc'::text, now())
   );
   ```

#### 2. Monitoramento de Performance

1. Ative o Real User Monitoring
2. Configure Speed Insights
3. Habilite Error Monitoring

### Manutenção

#### Deploy Automático

1. Push para `main` inicia deploy
2. Preview deployments em PRs
3. Rollback via dashboard

#### Comandos Úteis

```bash
# Deploy manual
vercel --prod

# Verificar domínios
vercel domains ls

# Logs
vercel logs

# Variáveis de ambiente
vercel env ls
```

### Troubleshooting

#### Problemas Comuns

1. **Subdomínios**
   - Verifique propagação DNS
   - Confirme registros CNAME
   - Valide certificados SSL

2. **Autenticação**
   - Verifique logs do Supabase
   - Confirme variáveis de ambiente
   - Teste middleware localmente

3. **Performance**
   - Use Vercel Speed Insights
   - Monitore Edge Functions
   - Verifique cache policies

### Checklist de Deploy

- [ ] Configurar domínios e DNS
- [ ] Definir variáveis de ambiente
- [ ] Verificar middleware
- [ ] Testar autenticação
- [ ] Validar SSL
- [ ] Configurar monitoramento
- [ ] Testar subdomínios
- [ ] Verificar logs
- [ ] Documentar alterações
