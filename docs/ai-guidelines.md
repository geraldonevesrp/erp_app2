# Guia de Navegação do Projeto ERP

Este documento serve como um guia rápido para ajudar na navegação e entendimento da estrutura do projeto.

## 📁 Estrutura Principal de Diretórios

- `src/app/`: Páginas e rotas da aplicação (Next.js App Router)
- `src/components/`: Componentes reutilizáveis
- `src/types/`: Tipos TypeScript e definições de tipos do Supabase
- `src/lib/`: Utilitários e configurações
- `src/hooks/`: Custom hooks React
- `src/contexts/`: Contextos React
- `supabase/`: Configurações do Supabase

## 🗄️ Arquivos Importantes

### Tipos e Banco de Dados
- Tipos do Supabase: `src/types/database.types.ts`
- Configuração do Supabase: `src/lib/supabase.ts`

### Componentes Principais
- Layout Base: `src/app/layout.tsx`
- Componentes UI: `src/components/ui/`
- Componentes de Formulário: `src/components/forms/`
- Componentes de Tabela: `src/components/tables/`

### Rotas Principais
- Dashboard: `src/app/dashboard/`
- Cadastros: `src/app/cadastros/`
- Financeiro: `src/app/financeiro/`
- Relatórios: `src/app/relatorios/`

## 🔑 Arquivos de Configuração
- Variáveis de Ambiente: `.env`
- Configuração Next.js: `next.config.js`
- Configuração Tailwind: `tailwind.config.ts`

## 📊 Estrutura do Banco de Dados
O arquivo `src/types/database.types.ts` contém todas as definições de tipos das tabelas do Supabase.

Tabelas Principais:
- api_config
- [Adicionar outras tabelas principais aqui]

## 🎨 Componentes UI
Utilizamos os seguintes componentes base:
- Radix UI para componentes base
- Tailwind CSS para estilização
- Lucide React para ícones

## 🔄 Fluxos Comuns
1. Autenticação: `src/app/auth/`
2. CRUD de Registros: `src/components/forms/`
3. Listagens: `src/components/tables/`

## 📝 Convenções
- Componentes: PascalCase (ex: `Button.tsx`)
- Hooks: camelCase começando com 'use' (ex: `useAuth.ts`)
- Páginas: kebab-case para URLs amigáveis
- Types/Interfaces: PascalCase com sufixo Type/Props (ex: `UserType`, `ButtonProps`)

## 📋 Diretrizes do Projeto

### Princípios Gerais
- Manter consistência com o código existente
- Seguir as práticas de Clean Code
- Documentar alterações significativas
- Testar mudanças antes de implementar

### Diretrizes de Desenvolvimento
- **Segurança**:
  - Nunca expor chaves de API ou credenciais no código
  - Sempre usar variáveis de ambiente para dados sensíveis
  - Validar inputs do usuário

- **Performance**:
  - Otimizar consultas ao banco de dados
  - Minimizar chamadas desnecessárias à API
  - Implementar paginação em listagens grandes

- **UX/UI**:
  - Manter consistência visual com o design system
  - Garantir feedback adequado ao usuário
  - Implementar tratamento de erros amigável

- **Código**:
  - Usar TypeScript com tipos explícitos
  - Evitar `any` e `@ts-ignore`
  - Manter componentes pequenos e focados
  - Implementar tratamento de erros adequado

### Diretrizes de Integração
- **Supabase**:
  - Manter compatibilidade com estruturas existentes
  - Não alterar schemas sem autorização
  - Seguir padrões de nomenclatura existentes
  - Documentar novas políticas de segurança

- **APIs e Serviços**:
  - Usar interceptors para tratamento de erros
  - Implementar retry logic quando apropriado
  - Manter versionamento de endpoints

### Diretrizes de Testes
- Implementar testes unitários para lógica crítica
- Testar casos de erro e edge cases
- Manter cobertura de testes adequada

## ⚠️ Avisos Importantes

### Supabase e Integrações Existentes

- **NUNCA altere estruturas do Supabase sem autorização explícita**
- O sistema é grande e possui múltiplos frontends que dependem da estrutura atual do Supabase
- Isso inclui:
  - Estrutura de paths no Storage
  - Esquema do banco de dados
  - Políticas de segurança
  - Funções e triggers existentes

## 🛠️ Scripts Úteis
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "update-types": "supabase gen types typescript --linked > src/types/database.types.ts"
}
```

---
Este guia será atualizado conforme o projeto evolui. Mantenha-o atualizado para facilitar a navegação e desenvolvimento.
