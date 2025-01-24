'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { PerfilProvider } from '@/contexts/perfil'
import { SupabaseProvider } from '@/contexts/supabase'
import { RevendaPerfilProvider } from '@/contexts/revendas/perfil'

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
          <RevendaPerfilProvider>
            <div suppressHydrationWarning>{children}</div>
          </RevendaPerfilProvider>
        </PerfilProvider>
      </SupabaseProvider>
    </ThemeProvider>
  )
}
