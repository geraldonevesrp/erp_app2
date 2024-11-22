# Configuração do Domínio erp1.com.br

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

## URLs do Sistema

- Site Principal: `https://erp1.com.br` ou `https://www.erp1.com.br`
- Área ERP: `https://erp.erp1.com.br`
- Área de Revendas: `https://revendas.erp1.com.br`
- Área Master: `https://master.erp1.com.br`

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

## Troubleshooting

### DNS não Propagado
- Aguarde até 48 horas para propagação completa
- Verifique se os registros DNS estão corretos
- Use ferramentas de verificação DNS online

### SSL não Ativo
- Verifique se os domínios estão configurados no Vercel
- Aguarde alguns minutos para emissão do certificado
- Verifique se não há conflitos de CNAME

### Subdomínios não Funcionando
- Verifique se o registro wildcard (*) está configurado
- Confirme se os CNAMEs estão apontando corretamente
- Verifique as configurações de domínio no Vercel

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

## Configuração de Subdomínios

### Visão Geral

O sistema requer uma configuração específica de DNS para suportar a arquitetura multi-tenant baseada em subdomínios. Cada perfil terá seu próprio subdomínio no formato `{cliente}.erp1.com.br`.

### Configuração DNS

#### Domínio Principal
1. Configure o domínio principal `erp1.com.br` apontando para a Vercel:
   ```
   erp1.com.br.    300    IN    A    76.76.21.21
   ```

2. Configure o registro CNAME `www`:
   ```
   www.erp1.com.br.    300    IN    CNAME    cname.vercel-dns.com.
   ```

#### Wildcard Subdomínio
Configure um registro wildcard para permitir subdomínios dinâmicos:
```
*.erp1.com.br.    300    IN    CNAME    cname.vercel-dns.com.
```

### Configuração Vercel

#### Domínios no Projeto
1. Acesse as configurações do projeto na Vercel
2. Vá para a seção "Domains"
3. Adicione os domínios:
   - `erp1.com.br`
   - `www.erp1.com.br`
   - `*.erp1.com.br`

#### Variáveis de Ambiente
```env
NEXT_PUBLIC_SITE_URL=https://erp1.com.br
NEXT_PUBLIC_VERCEL_URL=${NEXT_PUBLIC_SITE_URL}
```

### Desenvolvimento Local

#### Configuração do Host
Adicione ao arquivo hosts (`C:\Windows\System32\drivers\etc\hosts`):
```
127.0.0.1    localhost
127.0.0.1    erp.localhost
127.0.0.1    revendas.localhost
127.0.0.1    master.localhost
```

#### Configuração Next.js
Em `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
```

### Testes de Subdomínio

#### Desenvolvimento
- `http://erp.localhost:3000`
- `http://revendas.localhost:3000`
- `http://master.localhost:3000`

#### Produção
- `https://erp.erp1.com.br`
- `https://revendas.erp1.com.br`
- `https://master.erp1.com.br`

### Verificação de Configuração

#### DNS
Use o comando `dig` ou `nslookup`:
```bash
dig erp1.com.br
dig *.erp1.com.br
```

#### SSL/TLS
Verifique se os certificados estão válidos:
```bash
curl -vI https://erp1.com.br
curl -vI https://teste.erp1.com.br
```

### Considerações de Segurança

1. **SSL/TLS**
   - Certificados automáticos via Vercel
   - Forçar HTTPS em produção
   - Incluir HSTS headers

2. **DNS**
   - TTL adequado para atualizações (300s)
   - Proteção contra subdomain takeover
   - Monitoramento de DNS

3. **Headers**
   - X-DNS-Prefetch-Control
   - Strict-Transport-Security
   - X-Frame-Options
