# Documentação das Áreas Revendas e Master

## Visão Geral

O sistema possui três áreas principais com diferentes níveis de acesso:
- `/erp` - Área principal do ERP
- `/revendas` - Área exclusiva para revendedores
- `/master` - Área administrativa do sistema

Cada área possui seu próprio layout, menu e funcionalidades específicas, mas mantém consistência visual através do componente `AppLayout`.

## Área de Revendas (`/revendas`)

### Estrutura de Arquivos
```
/src/app/revendas/
├── layout.tsx    # Layout base com menu
└── page.tsx      # Página inicial
```

### Menu e Rotas
1. **Dashboard**
   - `/revendas/dashboard` - Visão geral
   - `/revendas/dashboard/vendas` - Acompanhamento de vendas

2. **Clientes**
   - `/revendas/clientes` - Gestão de clientes
   - `/revendas/clientes/leads` - Gestão de leads

3. **Financeiro**
   - `/revendas/financeiro/comissoes` - Acompanhamento de comissões
   - `/revendas/financeiro/extratos` - Extratos financeiros

### Página Inicial
- Cards informativos para acesso rápido
- Visão geral de clientes, comissões e suporte
- Design responsivo (grid adaptável)

## Área Master (`/master`)

### Estrutura de Arquivos
```
/src/app/master/
├── layout.tsx    # Layout base com menu administrativo
└── page.tsx      # Dashboard administrativo
```

### Menu e Rotas
1. **Dashboard**
   - `/master/dashboard` - Painel principal
   - `/master/dashboard/metricas` - Métricas do sistema

2. **Gestão**
   - `/master/gestao/perfis` - Gestão de perfis
   - `/master/gestao/usuarios` - Gestão de usuários
   - `/master/gestao/revendedores` - Gestão de revendedores

3. **Configurações**
   - `/master/config/sistema` - Configurações do sistema
   - `/master/config/integracoes` - Integrações
   - `/master/config/logs` - Logs do sistema

4. **Financeiro**
   - `/master/financeiro/assinaturas` - Gestão de assinaturas
   - `/master/financeiro/comissoes` - Gestão de comissões
   - `/master/financeiro/relatorios` - Relatórios financeiros

### Página Inicial
- Badge indicativo de "Acesso Master"
- Cards com ícones para principais funcionalidades
- Integração com Lucide Icons para elementos visuais

## Componentes Compartilhados

### AppLayout
- Componente base usado em todas as áreas
- Mantém consistência visual
- Gerencia menu lateral e conteúdo principal

### UI Components
- Cards (`@/components/ui/card`)
- Ícones do Lucide React
- Classes Tailwind para estilização

## Considerações de Desenvolvimento

### Responsividade
- Grid system adaptável (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- Layout fluido com containers
- Espaçamento consistente

### Segurança
- Acesso baseado em perfil
- Rotas protegidas via middleware
- Validação de permissões por área

### Manutenção
- Estrutura modular para fácil expansão
- Componentes reutilizáveis
- Padrões consistentes de nomenclatura

## Próximos Passos

1. Implementar páginas individuais para cada rota
2. Adicionar validações de permissão específicas
3. Desenvolver funcionalidades de gestão
4. Implementar métricas e relatórios

## Observações Técnicas

- Todas as páginas são Client Components (`'use client'`)
- Utilização de TypeScript para type safety
- Integração com sistema de autenticação existente
- Compatibilidade com o middleware de subdomínios
