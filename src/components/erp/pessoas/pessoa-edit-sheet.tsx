"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PessoaEditSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  children: React.ReactNode
  onClose?: () => void
  onSave?: () => void
  loading?: boolean
}

export function PessoaEditSheet({ 
  open = false, 
  children, 
  className,
  onClose,
  onSave,
  loading,
  ...props 
}: PessoaEditSheetProps) {
  return (
    <div
      data-state={open ? "open" : "closed"}
      className={cn(
        "fixed top-[49px] bottom-[6px] right-0 w-[calc(100%-16rem)] bg-background transition-transform duration-300 z-50 flex flex-col border-l",
        open ? "translate-x-0" : "translate-x-full",
        className
      )}
      {...props}
    >
      <div className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6 flex-none">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Editar Pessoa</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button size="sm" onClick={onSave} disabled={loading}>
            Salvar
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 ml-2"
            onClick={onClose}
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
        "flex-1 flex flex-col overflow-hidden bg-background",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
