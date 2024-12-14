"use client"

import { ReactNode } from "react"
import { Sheet, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TabelaPrecosSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  hasChanges: boolean
  onSave: () => void
  children: ReactNode
  isMenuOpen: boolean
}

export function TabelaPrecosSheet({
  open,
  onOpenChange,
  title,
  hasChanges,
  onSave,
  children,
  isMenuOpen,
}: TabelaPrecosSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <div
        className={cn(
          "fixed top-16 bottom-0 right-0 z-50 flex flex-col border-l",
          "transition-transform duration-300 ease-in-out",
          "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "dark:border-slate-800",
          open ? "translate-x-0" : "translate-x-full",
        )}
        style={{
          width: isMenuOpen ? 'calc(100% - 16rem)' : '100%',
          maxWidth: isMenuOpen ? 'calc(100vw - 16rem)' : '100vw'
        }}
      >
        <div className="flex items-center justify-between px-6 py-3 border-b">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange?.(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
          <Button size="sm" onClick={onSave}>
            Salvar
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </Sheet>
  )
}
