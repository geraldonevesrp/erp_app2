# Diretrizes para Componentes de Tabela

## Estrutura de Diretórios

```
src/components/data-tables/
├── base/                      # Componentes base reutilizáveis
│   ├── data-table-base.tsx   # Componente base com funcionalidades comuns
│   ├── data-table-header.tsx # Cabeçalho base
│   └── columns.tsx           # Tipos e funções auxiliares para colunas
│
├── pessoas/                   # Componentes específicos para a página Pessoas
│   ├── data-table.tsx        # Implementação específica da tabela
│   ├── columns.tsx           # Definição das colunas
│   └── filters.tsx           # Filtros específicos
│
└── [outras_páginas]/         # Outros módulos seguem o mesmo padrão
    ├── data-table.tsx
    ├── columns.tsx
    └── filters.tsx
```

## Princípios

1. **Componentes Base**
   - Localizados em `/base`
   - São templates reutilizáveis
   - Contêm funcionalidades comuns a todas as tabelas
   - Modificar apenas quando necessário alterar comportamento global

2. **Componentes Específicos**
   - Cada página tem sua própria implementação
   - Herdam funcionalidades dos componentes base
   - Personalizações específicas ficam isoladas no diretório da página
   - Mudanças em uma página não afetam outras implementações

3. **Organização do Código**
   - Separar definição de colunas em arquivo próprio (`columns.tsx`)
   - Manter filtros específicos em arquivo separado (`filters.tsx`)
   - Implementar lógica de tabela em arquivo dedicado (`data-table.tsx`)

## Fluxo de Desenvolvimento

1. **Criar Nova Página**
   - Criar novo diretório com nome da página
   - Copiar e adaptar componentes base
   - Implementar personalizações específicas

2. **Modificar Página Existente**
   - Alterar apenas componentes no diretório da página
   - Não modificar componentes base
   - Manter isolamento entre páginas

3. **Mudanças Globais**
   - Discutir impacto antes de alterar componentes base
   - Documentar alterações que afetam todas as páginas
   - Testar impacto em todas as implementações

## Exemplo de Uso

```typescript
// src/components/data-tables/[modulo]/data-table.tsx
import { DataTableBase } from "../base/data-table-base"

export function ModuloDataTable<TData, TValue>({
  // Props específicas do módulo
}) {
  // Lógica específica do módulo
  return (
    <DataTableBase
      // Configurações específicas
    />
  )
}
```

## Boas Práticas

1. **Tipagem**
   - Usar TypeScript para todos os componentes
   - Definir interfaces claras para props
   - Manter tipos específicos em `columns.tsx`

2. **Personalização**
   - Implementar busca específica por módulo
   - Definir colunas visíveis por padrão
   - Configurar ordenação inicial

3. **Performance**
   - Implementar virtualização quando necessário
   - Otimizar renders com useMemo/useCallback
   - Manter número adequado de registros por página

4. **Manutenção**
   - Documentar alterações significativas
   - Manter consistência entre implementações
   - Seguir padrões de código estabelecidos
