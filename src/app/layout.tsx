import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { ClientLayout } from '@/components/client-layout'
import { Toaster as ShadcnToaster } from "@/components/ui/toaster"
import { Toaster } from "sonner"

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
      <body className={inter.className} suppressHydrationWarning>
        <Providers suppressHydrationWarning>
          <ClientLayout suppressHydrationWarning>
            {children}
            <ShadcnToaster suppressHydrationWarning />
            <Toaster richColors closeButton position="top-right" />
          </ClientLayout>
        </Providers>
      </body>
    </html>
  )
}
