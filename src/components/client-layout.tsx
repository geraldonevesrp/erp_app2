'use client'

import { useEffect, useState } from 'react'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <div suppressHydrationWarning>{children}</div>
}