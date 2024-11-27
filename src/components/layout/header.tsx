"use client"

import { useHeader } from "@/contexts/header-context"

export function Header() {
  const { title, subtitle } = useHeader()

  return (
    <div className="flex items-center gap-2">
      <h1 className="text-xl font-semibold tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <>
          <span className="text-muted-foreground">/</span>
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        </>
      )}
    </div>
  )
}
