'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { RevendasHeader } from './revendas-header'
import { RevendasSidebar } from './revendas-sidebar'
import { cn } from '@/lib/utils'
import { useRevendaStatus } from '@/hooks/revendas/useRevendaStatus'
import { Loader2 } from 'lucide-react'

interface MenuItem {
  name: string
  href: string
  disabled?: boolean
}

interface MenuGroup {
  title: string
  items: MenuItem[]
}

interface RevendasLayoutProps {
  children: React.ReactNode
  menuItems: MenuGroup[]
}

export function RevendasLayout({ children, menuItems }: RevendasLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()
  const pathname = usePathname()
  const { isLoading, isActive } = useRevendaStatus()

  // Inicializa o menu fechado em dispositivos móveis
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768
      setIsMenuOpen(!isMobile)
    }

    handleResize() // Inicializa
    window.addEventListener('resize', handleResize)
    setIsMounted(true)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  if (!isMounted) {
    return null // Evita renderização no servidor
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  // Se não estiver ativo e não estiver na página de ativação, redireciona
  if (!isActive && !pathname.includes('/revendas/ativar_revenda')) {
    router.push('/revendas/ativar_revenda')
    return null
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <RevendasSidebar
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        menuItems={menuItems}
      />

      {/* Main Content */}
      <div className={cn(
        'flex-1 flex flex-col min-h-screen transition-all duration-300',
        isMenuOpen ? 'md:ml-64' : ''
      )}>
        <RevendasHeader
          onMenuClick={() => setIsMenuOpen(!isMenuOpen)}
          onLogout={handleLogout}
        />
        <main className="flex-1 p-4 bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
