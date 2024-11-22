# Deploy no Vercel (Sem Domínio Próprio)

## Pré-requisitos
- Conta no Vercel
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
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_ALLOWED_SUBDOMAINS=erp,revendas,master
```

Obs: Não é necessário configurar `NEXT_PUBLIC_APP_URL` e `NEXT_PUBLIC_ALLOWED_DOMAINS` pois o Vercel preencherá automaticamente.

### 3. Acesso ao Sistema

Após o deploy, o Vercel fornecerá um domínio no formato:
- Produção: `seu-projeto.vercel.app`
- Preview: `seu-projeto-git-branch-seu-usuario.vercel.app`

Para acessar as diferentes áreas:
- Principal: `seu-projeto.vercel.app`
- ERP: `erp.seu-projeto.vercel.app`
- Revendas: `revendas.seu-projeto.vercel.app`
- Master: `master.seu-projeto.vercel.app`

### 4. Verificação

1. Aguarde o deploy finalizar
2. Verifique se todos os subdomínios estão funcionando
3. Teste o login em cada área
4. Verifique se o middleware está redirecionando corretamente

### 5. Desenvolvimento Local

Para desenvolvimento local, continue usando:
- `localhost:3000`
- `erp.localhost:3000`
- `revendas.localhost:3000`
- `master.localhost:3000`

## Observações

1. **SSL/HTTPS**
   - O Vercel fornece HTTPS automaticamente para todos os domínios e subdomínios

2. **Limitações**
   - Alguns recursos podem ter limitações no plano gratuito do Vercel
   - O domínio será mais longo que um domínio personalizado

3. **Migração Futura**
   - Quando decidir usar um domínio próprio, será necessário:
     1. Registrar o domínio
     2. Configurar no Vercel
     3. Atualizar as variáveis de ambiente
     4. Configurar os registros DNS

## Troubleshooting

1. **Subdomínios não funcionando**
   - Verifique se o middleware está configurado corretamente
   - Verifique os logs do Edge Function no Vercel
   - Certifique-se que as variáveis de ambiente estão corretas

2. **Erros de Build**
   - Verifique os logs de build no Vercel
   - Certifique-se que todas as variáveis necessárias estão configuradas
   - Verifique se o Next.js está configurado corretamente

3. **Problemas de Autenticação**
   - Verifique as configurações do Supabase
   - Certifique-se que as chaves do Supabase estão corretas
   - Verifique se o middleware está permitindo os subdomínios corretos
