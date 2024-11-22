"use client"

import { Loader2 } from "lucide-react"

export function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <span className="mt-2 text-sm text-muted-foreground">Carregando...</span>
    </div>
  )
}
