"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMenu } from '@/contexts/menu-context'

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
  const { isMenuOpen } = useMenu()
  
  return (
    <div
      className={cn(
        "fixed top-16 bottom-0 right-0 z-50 flex flex-col border-l",
        "transition-transform duration-300 ease-in-out",
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "dark:border-slate-800",
        open ? "translate-x-0" : "translate-x-full",
        className
      )}
      style={{
        width: isMenuOpen ? 'calc(100% - 16rem)' : '100%',
        maxWidth: isMenuOpen ? 'calc(100vw - 16rem)' : '100vw'
      }}
      {...props}
    >
      <div 
        className={cn(
          "h-14 border-b flex items-center justify-between px-6 flex-none",
          "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "dark:border-slate-800"
        )}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">
            {pessoa ? (
              <>
                Editando Pessoa: {pessoa.apelido} - {pessoa.nome_razao}
                {hasChanges && <span className="ml-2 text-sm text-yellow-600 dark:text-yellow-500">(não salvo)</span>}
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
              hasChanges && "border-yellow-500 hover:border-yellow-600 dark:border-yellow-600 dark:hover:border-yellow-500"
            )}
          >
            {hasChanges ? "Cancelar*" : "Cancelar"}
          </Button>
          <Button 
            size="sm" 
            onClick={onSave} 
            disabled={loading}
            className={cn(
              "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600",
              hasChanges
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
      <PessoaEditSheetContent>
        {children}
      </PessoaEditSheetContent>
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
        "flex-1 overflow-auto p-4",
        className
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1800px]">
        {children}
      </div>
    </div>
  )
}
