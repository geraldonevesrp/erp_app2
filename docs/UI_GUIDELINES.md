# UI Guidelines - ERP App

Este documento define os padrões de interface do usuário que devem ser seguidos em todo o sistema.

## Confirmações de Exclusão

### Diálogo de Confirmação
- **SEMPRE** usar um diálogo de confirmação antes de excluir qualquer registro
- Usar o componente `AlertDialog` do shadcn/ui
- Incluir ícone de alerta (`<AlertTriangle />`) na cor vermelha
- Título em vermelho (classe `text-destructive`)
- Mencionar o nome/identificador do item a ser excluído
- Avisar que a ação não pode ser desfeita
- Botão de confirmar em vermelho (classe `bg-destructive`)
- Desabilitar botões durante o processo de exclusão

Exemplo de implementação:
```tsx
<AlertDialog>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle className="text-destructive flex items-center gap-2">
        <AlertTriangle className="h-5 w-5" />
        Confirmar Exclusão
      </AlertDialogTitle>
      <AlertDialogDescription>
        Tem certeza que deseja excluir "{item.nome}"?
        <br />
        Esta ação não pode ser desfeita.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
      <AlertDialogAction
        onClick={handleConfirmDelete}
        disabled={loading}
        className="bg-destructive hover:bg-destructive/90"
      >
        {loading ? "Excluindo..." : "Excluir"}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Botões e Ações

### Botões de Ação em Grids
- Usar ícones em vez de texto para ações comuns
- Tamanho do botão: `size="icon"`
- Variante padrão: `variant="ghost"`
- Tamanho do ícone: `h-4 w-4`
- **SEMPRE** usar Tooltip para descrever a ação do botão
- Para exclusão, **SEMPRE** usar diálogo de confirmação

Exemplos de ícones padrão com seus Tooltips:
- Editar: `<Pencil />` - Tooltip: "Editar [item]"
- Excluir: `<Trash2 />` - Tooltip: "Excluir [item]"
- Visualizar: `<Eye />` - Tooltip: "Visualizar [item]"

### Botões de Ação Principal
- Usar texto descritivo
- Incluir ícone à esquerda quando relevante
- Variante padrão: `variant="default"`
- Usar Tooltip para ações que precisam de explicação adicional

## Tooltips
- **SEMPRE** usar em botões de ação com ícones
- Texto claro e conciso descrevendo a ação
- Usar `TooltipProvider` para configurações consistentes
- Usar `asChild` no `TooltipTrigger` quando envolvendo componentes personalizados

## Campos de Busca
- Incluir ícone `<Search />` à esquerda
- Placeholder descritivo
- Largura padrão: `w-[300px]`

## Grids
- Usar o componente `Table` do shadcn/ui
- Cabeçalhos claros e descritivos
- Coluna de ações sempre à direita
- Largura fixa para coluna de ações: `w-[100px]`
- Botões de ação **SEMPRE** com Tooltips
- Ações de exclusão **SEMPRE** com confirmação

## Formulários
- Labels descritivos usando o componente `Label`
- Mensagens de erro claras usando o componente `Alert`
- Espaçamento consistente: `space-y-4` para grupos de campos

## Modais e Sheets
- Título claro usando `SheetTitle`
- Botões de ação no rodapé
- Botão principal à direita
- Botão secundário (cancelar) com `variant="outline"`
- Tooltips em botões de ação quando necessário

## Feedback ao Usuário
- Usar `toast` para mensagens de sucesso e erro
- Mensagens claras e concisas
- Indicadores de loading quando apropriado
- Confirmações explícitas para ações destrutivas

## Responsividade
- Usar classes do Tailwind para diferentes breakpoints
- Layout responsivo para todas as telas
- Considerar experiência mobile-first

## Acessibilidade
- Manter contraste adequado
- Fornecer textos alternativos para ícones
- Garantir navegação por teclado
- Tooltips fornecem contexto adicional para ícones
- Diálogos de confirmação para ações destrutivas

---

Este documento deve ser atualizado conforme novos padrões são estabelecidos ou modificados.
