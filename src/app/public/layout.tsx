'use client'

import { RevendaPerfilProvider } from '@/contexts/revendas/perfil'
import { Header } from './components/Header'
import { Footer } from './components/Footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RevendaPerfilProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </RevendaPerfilProvider>
  )
}
