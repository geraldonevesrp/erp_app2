# Configuração do Domínio erp1.com.br

## Visão Geral

O sistema utiliza uma arquitetura multi-tenant baseada em subdomínios, onde cada perfil tem seu próprio subdomínio e conjunto de permissões. Existem três tipos principais de áreas:

- **Área ERP** (`erp.erp1.com.br`)
- **Área de Revendas** (`revendas.erp1.com.br`)
- **Área Master** (`master.erp1.com.br`)

Além disso, cada cliente/revenda tem seu próprio subdomínio personalizado (ex: `atualsoft.erp1.com.br`).

## Configuração DNS

### 1. Registros A
Configure os seguintes registros A no seu provedor DNS:

```
Tipo    Nome    Valor           TTL
A       @       76.76.21.21     Auto
A       *       76.76.21.21     Auto
```

### 2. Registros CNAME
Configure os seguintes registros CNAME:

```
Tipo    Nome        Valor               TTL
CNAME   www         erp1.com.br.        Auto
CNAME   erp         erp1.com.br.        Auto
CNAME   revendas    erp1.com.br.        Auto
CNAME   master      erp1.com.br.        Auto
```

## Configuração no Vercel

1. Acesse o dashboard do projeto no Vercel
2. Vá para "Settings" > "Domains"
3. Adicione os seguintes domínios:
   - `erp1.com.br`
   - `www.erp1.com.br`
   - `erp.erp1.com.br`
   - `revendas.erp1.com.br`
   - `master.erp1.com.br`
   - `*.erp1.com.br` (para subdomínios personalizados)

## URLs do Sistema

### URLs Principais
- Site Principal: `https://erp1.com.br` ou `https://www.erp1.com.br`
- Área ERP: `https://erp.erp1.com.br`
- Área de Revendas: `https://revendas.erp1.com.br`
- Área Master: `https://master.erp1.com.br`

### URLs de Autenticação
- Login: `/auth/login`
- Logout: `/auth/logout`
- Erro de Acesso: `/auth/sem-acesso`
- Usuário Não Autorizado: `/auth/usuario-nao-autorizado`

### Redirecionamentos
- Domínio principal redireciona para `/auth/sem-acesso`
- Após login, redireciona para a área correta baseado no tipo do perfil:
  - Tipo 2 (Revenda) → `/revendas`
  - Tipo 3 (ERP) → `/erp`
  - Tipo 4 (Master) → `/master`

## Verificação SSL

O Vercel fornecerá certificados SSL automaticamente. Verifique se todos os domínios estão com HTTPS ativo:

1. Aguarde alguns minutos após a configuração DNS
2. Acesse cada URL via HTTPS
3. Verifique se o cadeado está presente no navegador

## Verificação de Propagação

1. Use o comando `nslookup` para verificar a propagação:
```bash
nslookup erp1.com.br
nslookup www.erp1.com.br
nslookup erp.erp1.com.br
nslookup revendas.erp1.com.br
nslookup master.erp1.com.br
```

2. Ou use sites como https://www.whatsmydns.net/ para verificar a propagação global

## Desenvolvimento Local

### Configuração do Host
Adicione ao arquivo hosts (`C:\Windows\System32\drivers\etc\hosts`):
```
127.0.0.1    localhost
127.0.0.1    erp.localhost
127.0.0.1    revendas.localhost
127.0.0.1    master.localhost
127.0.0.1    atualsoft.localhost  # Para testes com perfil específico
```

### URLs de Desenvolvimento
- `http://erp.localhost:3000`
- `http://revendas.localhost:3000`
- `http://master.localhost:3000`
- `http://atualsoft.localhost:3000`

### Fluxo de Teste
1. Configure o arquivo hosts
2. Inicie o servidor: `npm run dev`
3. Acesse o subdomínio desejado
4. Use `/auth/login` para fazer login
5. Use `/auth/logout` para fazer logout

## Troubleshooting

### DNS não Propagado
- Aguarde até 48 horas para propagação completa
- Verifique se os registros DNS estão corretos
- Use ferramentas de verificação DNS online

### SSL não Ativo
- Verifique se os domínios estão configurados no Vercel
- Aguarde alguns minutos para emissão do certificado
- Verifique se não há conflitos de CNAME

### Problemas de Login
1. **Redirecionamento Incorreto**
   - Verifique o tipo do perfil no banco de dados
   - Confirme se o subdomínio está correto
   - Limpe os cookies e cache do navegador

2. **Erro de Acesso**
   - Verifique se o usuário tem permissão no perfil
   - Confirme se o perfil existe para o subdomínio
   - Verifique os logs para mais detalhes

3. **Usuário Não Autorizado**
   - Verifique a tabela `perfis_users`
   - Confirme o `user_id` e `perfil_id`
   - Tente fazer logout e login novamente

## Manutenção

### Monitoramento
- Configure alertas de SSL no Vercel
- Monitore a validade dos certificados
- Verifique regularmente o status dos domínios

### Backup
- Mantenha um backup das configurações DNS
- Documente todas as alterações realizadas
- Mantenha contato do provedor DNS acessível

## Segurança

1. **Forçar HTTPS**
   - Já configurado no Vercel
   - Redirecionamento automático de HTTP para HTTPS

2. **Headers de Segurança**
   - Configurados no `vercel.json`
   - Proteção contra XSS, clickjacking, etc.

3. **Monitoramento de Segurança**
   - Ative alertas de segurança no Vercel
   - Monitore tentativas de acesso suspeitas
   - Mantenha registros de alterações
