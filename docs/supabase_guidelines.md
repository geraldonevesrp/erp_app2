# Diretrizes para Uso do Supabase

## Inicialização do Cliente Supabase

### Método Correto
Sempre use o `createClientComponentClient` do pacote `@supabase/auth-helpers-nextjs` para criar uma instância do cliente Supabase em componentes do lado do cliente:

```typescript
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function MeuComponente() {
  const supabase = createClientComponentClient()
  // ... resto do código
}
```

### Método Incorreto (NÃO USAR)
Não crie um arquivo separado para exportar uma instância do cliente Supabase. Isso pode causar problemas de hidratação e outros erros no Next.js:

```typescript
// ❌ NÃO FAÇA ISSO
// @/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(...)
```

## Boas Práticas

1. **Componentes do Cliente**
   - Use `createClientComponentClient` em componentes marcados com `"use client"`
   - Crie a instância dentro do componente que irá utilizá-la

2. **Componentes do Servidor**
   - Para componentes do servidor, use `createServerComponentClient`
   - Importe de `@supabase/auth-helpers-nextjs`

3. **Route Handlers**
   - Em route handlers, use `createRouteHandlerClient`
   - Importe de `@supabase/auth-helpers-nextjs`

4. **Tipagem**
   - Sempre defina os tipos das tabelas do Supabase
   - Use o comando `supabase gen types typescript --local` para gerar os tipos

## Exemplo de Uso em Contextos

```typescript
"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useCallback, useState } from "react"

export function MinhaFeature() {
  const [dados, setDados] = useState([])
  const supabase = createClientComponentClient()

  const carregarDados = useCallback(async () => {
    const { data, error } = await supabase
      .from('minha_tabela')
      .select('*')
    
    if (error) {
      console.error('Erro:', error)
      return
    }

    setDados(data)
  }, [supabase])

  // ... resto do código
}
```

## Tratamento de Erros

Sempre trate os erros retornados pelo Supabase:

```typescript
try {
  const { data, error } = await supabase.from('tabela').select('*')
  if (error) throw error
  // processe os dados
} catch (error) {
  console.error('Erro ao acessar o Supabase:', error)
  // trate o erro apropriadamente
}
```

## Referências

- [Documentação Oficial do Supabase com Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Auth Helpers para Next.js](https://github.com/supabase/auth-helpers)
