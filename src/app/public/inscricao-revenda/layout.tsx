'use client'

import { type ReactNode } from 'react'

export default function InscricaoRevendaLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/30 via-background/90 to-secondary/30">
      {children}
    </div>
  )
}
