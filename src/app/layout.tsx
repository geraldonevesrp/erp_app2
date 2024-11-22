import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { PerfilProvider } from '@/contexts/perfil'
import { Providers } from '@/components/providers'
import { ClientLayout } from '@/components/client-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ErpApp2 - Sistema ERP White Label',
  description: 'Sistema ERP moderno e personalizável',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ClientLayout>
            <PerfilProvider>
              {children}
            </PerfilProvider>
          </ClientLayout>
        </Providers>
      </body>
    </html>
  )
}
