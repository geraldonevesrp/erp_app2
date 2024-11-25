'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { PerfilProvider } from '@/contexts/perfil'
import { SupabaseProvider } from '@/contexts/supabase'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SupabaseProvider>
        <PerfilProvider>
          <div suppressHydrationWarning>{children}</div>
        </PerfilProvider>
      </SupabaseProvider>
    </ThemeProvider>
  )
}
