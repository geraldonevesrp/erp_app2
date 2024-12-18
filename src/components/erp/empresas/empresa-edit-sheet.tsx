"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useMenu } from '@/contexts/menu-context'

interface EmpresaEditSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  children: React.ReactNode
  onOpenChange?: (open: boolean) => void
  onSave?: () => void
  loading?: boolean
  hasChanges?: boolean
  empresa?: {
    nome_fantasia?: string
    razao_social?: string
  }
}

export function EmpresaEditSheet({ 
  open = false, 
  children, 
  className,
  onOpenChange,
  onSave,
  loading,
  hasChanges,
  empresa,
  ...props 
}: EmpresaEditSheetProps) {
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
            {empresa ? (
              <>
                Editando Empresa: {empresa.nome_fantasia} - {empresa.razao_social}
                {hasChanges && <span className="ml-2 text-sm text-yellow-600 dark:text-yellow-500">(não salvo)</span>}
              </>
            ) : (
              "Editando Empresa"
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
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}

interface EmpresaEditSheetContentProps {
  children: React.ReactNode
  className?: string
}

export function EmpresaEditSheetContent({ 
  children,
  className,
  ...props 
}: EmpresaEditSheetContentProps) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  )
}
