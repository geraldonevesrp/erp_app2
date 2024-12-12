"use client"

import { ReactNode } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Save, X } from "lucide-react"

interface TabelaPrecosSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  hasChanges: boolean
  onSave: () => void
  children: ReactNode
}

export function TabelaPrecosSheet({
  open,
  onOpenChange,
  title,
  hasChanges,
  onSave,
  children,
}: TabelaPrecosSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[calc(100%-16rem)] max-w-none p-0 flex flex-col"
      >
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">
              {title}
              {hasChanges && <span className="text-muted-foreground ml-2">*</span>}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button size="sm" onClick={onSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </SheetContent>
    </Sheet>
  )
}
