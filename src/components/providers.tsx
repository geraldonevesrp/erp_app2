'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { SupabaseProvider } from '@/contexts/supabase'
import { PerfilProvider } from '@/contexts/perfil'

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
          {children}
        </PerfilProvider>
      </SupabaseProvider>
    </ThemeProvider>
  )
}
