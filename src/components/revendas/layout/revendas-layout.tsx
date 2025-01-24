'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { RevendasHeader } from './revendas-header'
import { RevendasSidebar } from './revendas-sidebar'
import { cn } from '@/lib/utils'
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

  // Não renderiza nada até o componente estar montado
  if (!isMounted) {
    return null
  }

  return (
    <div className="flex h-screen flex-col">
      <RevendasHeader isMenuOpen={isMenuOpen} onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} onLogout={handleLogout} />
      <div className="flex flex-1 overflow-hidden">
        <RevendasSidebar isOpen={isMenuOpen} menuItems={menuItems} pathname={pathname} />
        <main className={cn(
          "flex-1 overflow-y-auto p-4 transition-all duration-200",
          isMenuOpen ? "md:ml-64" : "md:ml-0"
        )}>
          {children}
        </main>
      </div>
    </div>
  )
}
