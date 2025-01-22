'use client'

import { RevendaPerfilProvider } from '@/contexts/revendas/perfil'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { usePathname } from 'next/navigation'

// Páginas que não devem ter header/footer e provider
const NO_HEADER_PAGES = [
  '/public/inscricao-revenda'
]

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const hideHeaderFooter = NO_HEADER_PAGES.some(page => pathname?.startsWith(page))

  // Se for página de inscrição, não usa o provider
  if (hideHeaderFooter) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          {children}
        </main>
      </div>
    )
  }

  // Para outras páginas, usa o provider e header/footer normalmente
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
