# Implementação dos Sidebars

## Visão Geral
O sistema utiliza três sidebars principais (ERP, Master e Revendas) que compartilham a mesma estrutura e comportamento, garantindo consistência na experiência do usuário.

## Estrutura
```
aside (container principal)
├─ div (área de perfil - fixa)
└─ nav (área de menu - scrollável)
    └─ div (container de itens)
```

## Classes Tailwind Essenciais

### Container Principal (aside)
```typescript
className={cn(
  "fixed md:fixed top-0 left-0 h-screen w-64 bg-background border-r z-40 flex flex-col",
  "transition-transform duration-300 ease-in-out",
  isOpen ? "translate-x-0" : "-translate-x-full"
)}
```

### Área de Perfil
```typescript
className="flex-none flex flex-col items-center justify-center py-6 border-b w-full px-2"
```

### Área de Navegação
```typescript
nav: "flex-1 min-h-0"
container: "h-full overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent p-4"
```

### Grupos de Menu
```typescript
container: "space-y-1 overflow-hidden transition-all duration-200"
estado: expandedGroups[group.title] ? "h-auto" : "h-0"
```

## Características

### Scroll
- Área de perfil fixa no topo
- Scroll apenas na área de menu
- Scrollbar customizado com Tailwind
- Comportamento suave

### Responsividade
- Layout adaptativo para desktop e mobile
- Menu retrátil em telas menores
- Overlay em modo mobile
- Fechamento automático após seleção em mobile

### Grupos de Menu
- Expansão dinâmica sem limite de altura
- Animações suaves
- Estado persistente
- Indicador visual de grupo ativo

## Boas Práticas
1. Manter consistência entre os três sidebars
2. Usar apenas classes Tailwind para estilização
3. Preservar a estrutura flexbox para layout
4. Manter as animações suaves
5. Garantir acessibilidade

## Manutenção
Ao fazer alterações:
1. Aplicar as mudanças em todos os três sidebars
2. Testar em diferentes resoluções
3. Verificar comportamento de scroll
4. Confirmar funcionamento das animações
5. Validar em modo claro e escuro
