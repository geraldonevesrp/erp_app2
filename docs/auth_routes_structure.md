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

### Fluxo de Autenticação

1. **Verificação de Subdomínio**
   ```typescript
   // Extrai subdomínio
   const subdomain = hostname.split('.')[0]
   
   // Busca perfil
   const { data: perfil } = await supabase
     .from('perfis')
     .select('*')
     .eq('dominio', subdomain)
     .single()
   ```

2. **Verificação de Autorização**
   ```typescript
   // Verifica proprietário
   const isOwner = perfil.user_id === user.id
   
   if (!isOwner) {
     // Verifica acesso via perfis_users
     const { data: userPerfil } = await supabase
       .from('perfis_users')
       .select('*')
       .eq('perfil_id', perfil.id)
       .eq('user_id', user.id)
       .single()
   }
   ```

## Estrutura de Dados

### Interface Perfil
```typescript
interface Perfil {
  id: string
  user_id: string
  tipo: TipoPerfil
  dominio: string
  nome?: string
  created_at: string
  updated_at: string
}
```

### Interface PerfilUser
```typescript
interface PerfilUser {
  id: string
  perfil_id: string
  user_id: string
  created_at: string
  updated_at: string
}
```

## Rotas do Sistema

### Rotas de Autenticação
- `/auth/login` - Login (sem sessão, requer subdomínio)
- `/auth/sem-acesso` - Erro de acesso ao subdomínio
- `/auth/usuario-nao-autorizado` - Sem autorização para o perfil

### Rotas Protegidas
Todas as rotas abaixo requerem:
- Autenticação válida
- Perfil carregado na sessão
- Tipo de perfil correspondente

```typescript
// Exemplo de verificação no middleware
const isRevendaAccessing = path.startsWith('/revendas') && 
                          perfil.tipo === PERFIL_TIPOS.REVENDA
const isErpAccessing = path.startsWith('/erp') && 
                      perfil.tipo === PERFIL_TIPOS.ERP
```

## Contexto de Perfil

O sistema utiliza um contexto React para gerenciar o estado do perfil:

```typescript
interface PerfilContextType {
  perfil: Perfil | null
  isLoading: boolean
  error: Error | null
  refreshPerfil: () => Promise<void>
}
```

### Uso do Contexto
```typescript
const { perfil, isLoading, error, refreshPerfil } = usePerfil()
```

## Desenvolvimento Local

### Configuração de Subdomínios
- Use `.localhost` para testes
- Exemplos:
  - `erp.localhost:3000`
  - `revendas.localhost:3000`
  - `master.localhost:3000`

## Considerações de Segurança

1. **Autenticação Estrita**
   - Todas as rotas são protegidas
   - Verificação de subdomínio em todas as requisições
   - Múltiplas camadas de verificação de autorização

2. **Controle de Acesso**
   - Verificação de proprietário do perfil
   - Sistema de autorização via `perfis_users`
   - Redirecionamentos seguros para páginas de erro

3. **Sessão**
   - Perfil mantido em contexto seguro
   - Verificações de tipo de perfil em todas as rotas
   - Refresh automático do perfil após login
