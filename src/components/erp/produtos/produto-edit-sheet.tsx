"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProdutoEditSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  loading?: boolean
  hasChanges?: boolean
  produto?: any
  onSave?: () => void
}

interface ProdutoEditSheetContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ProdutoEditSheet({ 
  open = false, 
  children, 
  className,
  onOpenChange,
  onSave,
  loading,
  hasChanges,
  produto,
  ...props 
}: ProdutoEditSheetProps) {
  console.log('Renderizando ProdutoEditSheet, open:', open);
  return (
    console.log('ProdutoEditSheet está sendo renderizado, open:', open),
    <div
      data-state={open ? "open" : "closed"}
      className={cn(
        "fixed top-16 bottom-0 right-0 w-[calc(100%-16rem)] bg-slate-50/95 z-50 flex flex-col border-l overflow-hidden",
        "transition-all duration-300 ease-in-out transform will-change-transform",
        "produto-edit-sheet",
        open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none",
        className
      )}
      {...props}
    >
      <div className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6 flex-none">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">
            {produto ? (
              <>
                Editando Produto: {produto.nome}
                {hasChanges && <span className="ml-2 text-sm text-yellow-600">(não salvo)</span>}
              </>
            ) : (
              "Editando Produto"
            )}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onOpenChange?.(false)} 
            disabled={loading}
            className={cn(
              hasChanges && "border-yellow-500 hover:border-yellow-600"
            )}
          >
            {hasChanges ? "Cancelar*" : "Cancelar"}
          </Button>
          <Button 
            size="sm" 
            onClick={onSave} 
            disabled={loading}
            className={cn(
              hasChanges && "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Salvando...
              </span>
            ) : (
              "Salvar"
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 ml-2"
            onClick={() => onOpenChange?.(false)}
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

export function ProdutoEditSheetContent({ 
  children,
  className,
  ...props 
}: ProdutoEditSheetContentProps) {
  return (
    <div
      className={cn(
        "flex-1 flex flex-col overflow-hidden bg-slate-50/95",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
