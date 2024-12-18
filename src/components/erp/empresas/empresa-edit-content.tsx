"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { EmpresaDados } from "./empresa-dados"
import { EmpresaEditSheetContent } from "./empresa-edit-sheet"

interface EmpresaEditContentProps {
  data: any
  onChange: (field: string, value: any) => void
  className?: string
}

export function EmpresaEditContent({
  data,
  onChange,
  className,
  ...props
}: EmpresaEditContentProps) {
  return (
    <EmpresaEditSheetContent className={cn("space-y-6", className)} {...props}>
      <EmpresaDados data={data} onChange={onChange} />
    </EmpresaEditSheetContent>
  )
}
