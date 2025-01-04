# Documentação da Estrutura de Autenticação e Rotas

## Visão Geral do Sistema

O sistema implementa uma arquitetura multi-tenant baseada em subdomínios, onde cada perfil tem seu próprio subdomínio e conjunto de permissões. Todo acesso é estritamente controlado através de subdomínios e autenticação.

## Estrutura de Perfis

### Tipos de Perfil
```typescript
const PERFIL_TIPOS = {
  PESSOA: 1,  // Apenas dados do usuário
  REVENDA: 2, // Acesso à área /revendas
  ERP: 3,     // Acesso à área /erp
  MASTER: 4   // Acesso à área /master
}
```

### Rotas por Tipo de Perfil
```typescript
const PERFIL_ROTAS = {
  [PERFIL_TIPOS.PESSOA]: '/pessoa',
  [PERFIL_TIPOS.REVENDA]: '/revendas',
  [PERFIL_TIPOS.ERP]: '/erp',
  [PERFIL_TIPOS.MASTER]: '/master'
}
```

## Política de Acesso

### Regras Principais
1. **Acesso Exclusivo via Subdomínio**
   - Todo acesso DEVE ser feito via subdomínio
   - Domínio principal (erp1.com.br) redireciona para `/auth/sem-acesso`
   - Todas as páginas exigem autenticação e Perfil na sessão

2. **Controle de Acesso**
   - Verificação de proprietário do perfil (`user_id`)
   - Verificação de acesso via `perfis_users`
   - Redirecionamento automático baseado no tipo de perfil

### Páginas Públicas
```typescript
const PUBLIC_PAGES = [
  '/auth/sem-acesso',
  '/auth/usuario-nao-autorizado',
  '/auth/login',
  '/auth/logout'
]
```

### Fluxo de Autenticação

1. **Login**
```typescript
// 1. Tenta fazer login com email/senha
const { error } = await supabase.auth.signInWithPassword({
  email,
  password,
})

// 2. Atualiza o perfil no contexto
await refreshPerfil()

// 3. Aguarda carregamento do perfil
await new Promise(resolve => setTimeout(resolve, 500))

// 4. Verifica sessão e perfil
const { data: { session } } = await supabase.auth.getSession()
const { data: perfilAtual } = await supabase
  .from('perfis')
  .select('*')
  .eq('dominio', subdomain)
  .single()

// 5. Redireciona baseado no tipo do perfil
switch (perfilAtual.tipo) {
  case PERFIL_TIPOS.REVENDA:
    router.push('/revendas')
    break
  case PERFIL_TIPOS.ERP:
    router.push('/erp')
    break
  case PERFIL_TIPOS.MASTER:
    router.push('/master')
    break
  default:
    router.push('/auth/sem-acesso')
}
```

2. **Logout**
```typescript
// 1. Executa logout no Supabase
await supabase.auth.signOut()

// 2. Redireciona para login
window.location.href = '/auth/login'
```

## Middleware de Proteção

O middleware protege todas as rotas e implementa a lógica de redirecionamento:

1. **Verificação de Página Pública**
```typescript
if (PUBLIC_PAGES.includes(pathname)) {
  return res // Permite acesso direto
}
```

2. **Verificação de Subdomínio**
```typescript
const hostname = req.headers.get('host') || ''
const subdomain = hostname.split('.')[0]

// Busca perfil pelo subdomínio
const { data: perfil } = await supabase
  .from('perfis')
  .select('*')
  .eq('dominio', subdomain)
  .single()
```

3. **Verificação de Sessão**
```typescript
const { data: { session } } = await supabase.auth.getSession()

if (!session) {
  return NextResponse.redirect(new URL('/auth/login', req.url))
}
```

4. **Verificação de Autorização**
```typescript
const isOwner = perfil.user_id === session.user.id

if (!isOwner) {
  // Verifica acesso via perfis_users
  const { data: userPerfil } = await supabase
    .from('perfis_users')
    .select('*')
    .eq('perfil_id', perfil.id)
    .eq('user_id', session.user.id)
    .single()

  if (!userPerfil) {
    return NextResponse.redirect(new URL('/auth/usuario-nao-autorizado', req.url))
  }
}
```

5. **Verificação de Área**
```typescript
const isRevendaAccessing = pathname.startsWith('/revendas') && perfil.tipo === PERFIL_TIPOS.REVENDA
const isErpAccessing = pathname.startsWith('/erp') && perfil.tipo === PERFIL_TIPOS.ERP
const isMasterAccessing = pathname.startsWith('/master') && perfil.tipo === PERFIL_TIPOS.MASTER

if (!isRevendaAccessing && !isErpAccessing && !isMasterAccessing) {
  // Redireciona para a área correta do perfil
  switch (perfil.tipo) {
    case PERFIL_TIPOS.REVENDA:
      return NextResponse.redirect(new URL('/revendas', req.url))
    case PERFIL_TIPOS.ERP:
      return NextResponse.redirect(new URL('/erp', req.url))
    case PERFIL_TIPOS.MASTER:
      return NextResponse.redirect(new URL('/master', req.url))
    default:
      return NextResponse.redirect(new URL('/auth/sem-acesso', req.url))
  }
}
```

## Desenvolvimento Local

### Configuração de Subdomínios
- Use `.localhost` para testes
- Exemplos:
  - `erp.localhost:3000`
  - `revendas.localhost:3000`
  - `master.localhost:3000`

### Testes de Login
1. Acesse o subdomínio correto (ex: `atualsoft.localhost:3000`)
2. Use `/auth/login` para fazer login
3. Use `/auth/logout` para fazer logout
4. Será redirecionado automaticamente para a área correta baseado no tipo do perfil

## Considerações de Segurança

1. **Autenticação Estrita**
   - Todas as rotas são protegidas
   - Verificação de subdomínio em todas as requisições
   - Múltiplas camadas de verificação de autorização

2. **Controle de Acesso**
   - Verificação de proprietário do perfil
   - Sistema de autorização via `perfis_users`
   - Redirecionamentos seguros para páginas de erro

3. **Tratamento de Erros**
   - Mensagens de erro amigáveis para usuários
   - Logs de erro apenas em desenvolvimento
   - Redirecionamentos seguros em caso de erro

4. **Sessão**
   - Perfil mantido em contexto seguro
   - Verificações de tipo de perfil em todas as rotas
   - Refresh automático do perfil após login
