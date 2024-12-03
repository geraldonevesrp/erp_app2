"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PessoaEditSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  children: React.ReactNode
  onOpenChange?: (open: boolean) => void
  onSave?: () => void
  loading?: boolean
  hasChanges?: boolean
  pessoa?: {
    apelido?: string
    nome_razao?: string
  }
}

export function PessoaEditSheet({ 
  open = false, 
  children, 
  className,
  onOpenChange,
  onSave,
  loading,
  hasChanges,
  pessoa,
  ...props 
}: PessoaEditSheetProps) {
  return (
    <div
      data-state={open ? "open" : "closed"}
      className={cn(
        "fixed top-16 bottom-0 right-0 w-[calc(100%-16rem)] bg-slate-50/95 z-50 flex flex-col border-l min-h-screen",
        "transition-all duration-300 ease-in-out transform will-change-transform",
        "pessoa-edit-sheet",
        open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none",
        className
      )}
      {...props}
    >
      <div className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6 flex-none">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">
            {pessoa ? (
              <>
                Editando Pessoa: {pessoa.apelido} - {pessoa.nome_razao}
                {hasChanges && <span className="ml-2 text-sm text-yellow-600">(não salvo)</span>}
              </>
            ) : (
              "Editando Pessoa"
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
      {children}
    </div>
  )
}

interface PessoaEditSheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function PessoaEditSheetContent({ 
  children,
  className,
  ...props 
}: PessoaEditSheetContentProps) {
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
